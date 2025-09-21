import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

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
            email: true
          }
        }
      }
    });

    if (!job) {
      return Response.json(
        { success: false, error: { message: "Job not found" } },
        { status: 404 }
      );
    }

    if (job.approvalStatus !== "APPROVED") {
      return Response.json(
        { success: false, error: { message: "Job is not available for applications" } },
        { status: 400 }
      );
    }

    // Check if deadline has passed
    if (new Date(job.applicationDeadline) <= new Date()) {
      return Response.json(
        { success: false, error: { message: "Application deadline has passed" } },
        { status: 400 }
      );
    }

    // Check for duplicate application
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId: jobId,
        studentId: session.id
      }
    });

    if (existingApplication) {
      return Response.json(
        { success: false, error: { message: "You have already applied for this job" } },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        jobId: jobId,
        studentId: session.id,
        applicationStatus: "APPLIED"
      },
      include: {
        job: {
          include: {
            recruiter: {
              select: {
                name: true,
                companyProfile: true
              }
            }
          }
        },
        student: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return Response.json({
      success: true,
      message: "Application submitted successfully",
      application
    }, { status: 201 });

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
        select: { id: true }
      });
      const jobIds = recruiterJobs.map(job => job.id);
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
                companyProfile: true
              }
            }
          }
        },
        student: {
          select: {
            name: true,
            email: true,
            facultyNo: true,
            enrollmentNo: true,
            academicRecords: true
          }
        }
      },
      orderBy: {
        id: "desc"
      }
    });

    return Response.json({
      success: true,
      applications
    });

  } catch (error) {
    console.error("Applications fetch error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
