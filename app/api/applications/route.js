import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { normalizeSalaryInput, parseSalaryFromText } from "@/lib/salary";

export async function POST(request) {
  try {
    const session = await getSession();

    // Check if user is a student
    if (!session || session.role !== "STUDENT") {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return Response.json(
        { success: false, error: { message: "Job ID is required" } },
        { status: 400 }
      );
    }

    // Check if job exists and is approved
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobId },
      include: {
        recruiter: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!job) {
      return Response.json(
        { success: false, error: { message: "Job not found" } },
        { status: 404 }
      );
    }

    if (job.approvalStatus !== "APPROVED") {
      return Response.json(
        {
          success: false,
          error: { message: "Job is not available for applications" },
        },
        { status: 400 }
      );
    }

    // Check if deadline has passed
    if (new Date(job.applicationDeadline) <= new Date()) {
      return Response.json(
        {
          success: false,
          error: { message: "Application deadline has passed" },
        },
        { status: 400 }
      );
    }

    // Check for duplicate application
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        studentId: session.id,
      },
    });

    if (existingApplication) {
      return Response.json(
        {
          success: false,
          error: { message: "You have already applied for this job" },
        },
        { status: 400 }
      );
    }

    // If student is already hired/placed, enforce salary constraint: they may only apply
    // to jobs whose salary <= 2 * their current CTC (if CTC is available in academicRecords)
    const alreadyHired = await prisma.application.findFirst({
      where: {
        studentId: session.id,
        applicationStatus: { in: ["HIRED", "PLACED"] },
      },
    });

    if (alreadyHired) {
      // Try to read student's current CTC from academicRecords
      const studentRecord = await prisma.student.findUnique({
        where: { id: session.id },
        select: { academicRecords: true },
      });

      let studentCtc = null;
      try {
        const records = studentRecord?.academicRecords
          ? typeof studentRecord.academicRecords === "string"
            ? JSON.parse(studentRecord.academicRecords)
            : studentRecord.academicRecords
          : null;

        const possible =
          records?.currentCtc ||
          records?.current_ctc ||
          records?.ctc ||
          records?.currentSalary ||
          records?.current_salary ||
          records?.salary ||
          null;

        studentCtc = normalizeSalaryInput(possible);
      } catch (e) {
        studentCtc = null;
      }

      if (studentCtc) {
        // Determine job salary from job.jobDescription if possible
        let jobSalary = null;
        // If jobDescription is JSON with salary field, try parse
        try {
          if (typeof job.jobDescription === "string") {
            // try JSON
            try {
              const jd = JSON.parse(job.jobDescription);
              jobSalary =
                normalizeSalaryInput(jd.salary) ||
                normalizeSalaryInput(jd.package) ||
                null;
            } catch (e) {
              jobSalary =
                parseSalaryFromText(job.jobDescription) ||
                normalizeSalaryInput(job.jobDescription) ||
                null;
            }
          }
        } catch (e) {
          jobSalary = null;
        }

        if (jobSalary && jobSalary > 2 * studentCtc) {
          return Response.json(
            {
              success: false,
              error: {
                message:
                  "As you are already hired, you may only apply to jobs with salary up to twice your current CTC.",
              },
            },
            { status: 400 }
          );
        }
      }
      // If we couldn't determine student CTC, allow application (constraint cannot be enforced)
    }

    // Create application
    // --- New: eligibility comparison against student's academicRecords ---
    // Parse job eligibilityCriteria (expected format: 'Degree: ...; MinCGPA: 7.0; ClassX: 85; ClassXII: 85; Notes: ...')
    function parseEligibility(text) {
      if (!text || typeof text !== "string") return {};
      const parts = text
        .split(";")
        .map((p) => p.trim())
        .filter(Boolean);
      const out = {};
      parts.forEach((p) => {
        const [k, ...rest] = p.split(":");
        if (!k) return;
        const key = k.trim();
        const val = rest.join(":").trim();
        if (!val) return;
        if (key.toLowerCase() === "mincgpa") out.minCgpa = parseFloat(val);
        else if (key.toLowerCase() === "classx") out.classX = parseFloat(val);
        else if (key.toLowerCase() === "classxii")
          out.classXII = parseFloat(val);
        else if (key.toLowerCase() === "degree") out.degree = val;
        else if (key.toLowerCase() === "notes") out.notes = val;
        else out[key] = val;
      });
      return out;
    }

    // Load student academic records
    const studentRecord = await prisma.student.findUnique({
      where: { id: session.id },
      select: { academicRecords: true },
    });

    let studentRecordsObj = null;
    try {
      const rec = studentRecord?.academicRecords;
      studentRecordsObj =
        rec && typeof rec === "string" ? JSON.parse(rec) : rec;
    } catch (e) {
      studentRecordsObj = studentRecord?.academicRecords || null;
    }

    const jobEligibility = parseEligibility(job.eligibilityCriteria || "");

    // Compare fields: if a criterion exists in jobEligibility, it must match student's record
    const unmet = [];
    if (jobEligibility.degree) {
      const studentCourse = (studentRecordsObj?.courseEnrolled || "")
        .toString()
        .toLowerCase();
      if (
        !studentCourse ||
        !studentCourse.includes(jobEligibility.degree.toLowerCase())
      ) {
        unmet.push({ field: "degree", required: jobEligibility.degree });
      }
    }
    if (!isNaN(jobEligibility.minCgpa)) {
      const studentCgpa = parseFloat(
        studentRecordsObj?.currentCGPA ||
          studentRecordsObj?.currentCgpa ||
          studentRecordsObj?.currentGPA ||
          null
      );
      if (isNaN(studentCgpa) || studentCgpa < jobEligibility.minCgpa) {
        unmet.push({
          field: "minCgpa",
          required: jobEligibility.minCgpa,
          actual: studentCgpa ?? null,
        });
      }
    }
    if (!isNaN(jobEligibility.classX)) {
      const sX = parseFloat(
        studentRecordsObj?.classXPercentage || studentRecordsObj?.classX || null
      );
      if (isNaN(sX) || sX < jobEligibility.classX) {
        unmet.push({
          field: "classX",
          required: jobEligibility.classX,
          actual: sX ?? null,
        });
      }
    }
    if (!isNaN(jobEligibility.classXII)) {
      const sXII = parseFloat(
        studentRecordsObj?.classXIIPercentage ||
          studentRecordsObj?.classXii ||
          studentRecordsObj?.classXII ||
          null
      );
      if (isNaN(sXII) || sXII < jobEligibility.classXII) {
        unmet.push({
          field: "classXII",
          required: jobEligibility.classXII,
          actual: sXII ?? null,
        });
      }
    }

    if (unmet.length > 0) {
      return Response.json(
        {
          success: false,
          error: { message: "You do not meet the eligibility criteria" },
          unmetCriteria: unmet,
        },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        jobId: jobId,
        studentId: session.id,
        applicationStatus: "APPLIED",
      },
      include: {
        job: {
          include: {
            recruiter: {
              select: {
                name: true,
                companyProfile: true,
              },
            },
          },
        },
        student: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return Response.json(
      {
        success: true,
        message: "Application submitted successfully",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Application creation error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const jobId = searchParams.get("jobId");

    let whereClause = {};

    if (session.role === "STUDENT") {
      // Students can only see their own applications
      whereClause.studentId = session.id;
    } else if (session.role === "RECRUITER") {
      // Recruiters can see applications for their jobs
      const recruiterJobs = await prisma.jobPosting.findMany({
        where: { recruiterId: session.id },
        select: { id: true },
      });
      const jobIds = recruiterJobs.map((job) => job.id);
      whereClause.jobId = { in: jobIds };
    } else if (session.role === "TPO") {
      // TPO can see all applications
      if (studentId) whereClause.studentId = studentId;
      if (jobId) whereClause.jobId = jobId;
    } else {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
      include: {
        job: {
          include: {
            recruiter: {
              select: {
                name: true,
                companyProfile: true,
              },
            },
          },
        },
        student: {
          select: {
            name: true,
            email: true,
            facultyNo: true,
            enrollmentNo: true,
            academicRecords: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    return Response.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error("Applications fetch error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
