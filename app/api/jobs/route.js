import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function POST(request) {
  try {
    const session = await getSession();

    // Check if user is a recruiter
    if (!session || session.role !== "RECRUITER") {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { jobDescription, eligibilityCriteria, applicationDeadline } = body;

    // Validation: jobDescription and applicationDeadline are required; eligibilityCriteria may be null
    if (!jobDescription || !applicationDeadline) {
      return Response.json(
        {
          success: false,
          error: { message: "Job description and deadline are required" },
        },
        { status: 400 }
      );
    }

    // If salary present in jobDescription, prefer to validate any recruiter-provided salary snippet
    // We expect recruiter's form to enforce 'X LPA' format; double-check here if a Salary: line exists.
    const salaryLineMatch =
      typeof jobDescription === "string" &&
      jobDescription.match(/Salary:\s*(.+)/i);
    if (salaryLineMatch) {
      const salaryText = salaryLineMatch[1].trim();
      const salaryRe = /^\d+(?:\.\d+)?\s+LPA$/i;
      if (salaryText && !salaryRe.test(salaryText)) {
        return Response.json(
          {
            success: false,
            error: {
              message:
                "Salary must be in the format 'X LPA' or 'X.Y LPA' when provided from the recruiter form.",
            },
          },
          { status: 400 }
        );
      }
    }

    // Validate deadline is in the future
    const deadline = new Date(applicationDeadline);
    if (deadline <= new Date()) {
      return Response.json(
        {
          success: false,
          error: { message: "Application deadline must be in the future" },
        },
        { status: 400 }
      );
    }

    const jobPosting = await prisma.jobPosting.create({
      data: {
        recruiterId: session.id,
        jobDescription,
        eligibilityCriteria,
        applicationDeadline: deadline,
        approvalStatus: "PENDING",
      },
      include: {
        recruiter: {
          select: {
            name: true,
            companyProfile: true,
          },
        },
      },
    });

    return Response.json(
      {
        success: true,
        message: "Job posting created and submitted for approval",
        job: jobPosting,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Job creation error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const recruiterId = searchParams.get("recruiterId");

    let whereClause = {};

    if (status) {
      whereClause.approvalStatus = status;
    }

    if (recruiterId) {
      if (recruiterId === "current") {
        const session = await getSession();
        if (!session || session.role !== "RECRUITER") {
          return Response.json(
            { success: false, error: { message: "Unauthorized" } },
            { status: 401 }
          );
        }
        whereClause.recruiterId = session.id;
      } else {
        whereClause.recruiterId = recruiterId;
      }
    }

    if (search) {
      whereClause.OR = [
        { jobDescription: { contains: search, mode: "insensitive" } },
        { eligibilityCriteria: { contains: search, mode: "insensitive" } },
      ];
    }

    const jobs = await prisma.jobPosting.findMany({
      where: whereClause,
      include: {
        recruiter: {
          select: {
            name: true,
            companyProfile: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
      orderBy: {
        applicationDeadline: "asc",
      },
    });

    // Derive a simple `title` field from the free-form jobDescription so
    // the frontend can show a concise job title without depending on build-time parsing.
    const extractTitle = (description) => {
      if (!description) return null;
      // parentheses
      const paren = description.match(/\(([^)]+)\)/);
      if (paren) return paren[1].trim();
      // '<Title> at <Company>'
      const atMatch = description.match(/^(.+?)\s+at\s+/i);
      if (atMatch) return atMatch[1].trim();
      // '<Title> CTC' or similar
      const ctcMatch = description.match(/^(.+?)\s+CTC[:\s]/i);
      if (ctcMatch) return ctcMatch[1].trim();
      // leading phrase
      const leadMatch = description.match(/^([^.:]+)[.:]/);
      if (leadMatch) return leadMatch[1].trim();
      return null;
    };

    const jobsWithTitle = jobs.map((j) => ({
      ...j,
      title: extractTitle(j.jobDescription) || null,
    }));

    return Response.json({
      success: true,
      jobs: jobsWithTitle,
    });
  } catch (error) {
    console.error("Jobs fetch error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
