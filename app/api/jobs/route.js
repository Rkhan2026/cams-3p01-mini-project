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

    // Validation
    if (!jobDescription || !eligibilityCriteria || !applicationDeadline) {
      return Response.json(
        { success: false, error: { message: "All fields are required" } },
        { status: 400 }
      );
    }

    // Validate deadline is in the future
    const deadline = new Date(applicationDeadline);
    if (deadline <= new Date()) {
      return Response.json(
        { success: false, error: { message: "Application deadline must be in the future" } },
        { status: 400 }
      );
    }

    const jobPosting = await prisma.jobPosting.create({
      data: {
        recruiterId: session.id,
        jobDescription,
        eligibilityCriteria,
        applicationDeadline: deadline,
        approvalStatus: "PENDING"
      },
      include: {
        recruiter: {
          select: {
            name: true,
            companyProfile: true
          }
        }
      }
    });

    return Response.json({
      success: true,
      message: "Job posting created and submitted for approval",
      job: jobPosting
    }, { status: 201 });

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
        { eligibilityCriteria: { contains: search, mode: "insensitive" } }
      ];
    }

    const jobs = await prisma.jobPosting.findMany({
      where: whereClause,
      include: {
        recruiter: {
          select: {
            name: true,
            companyProfile: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: {
        applicationDeadline: "asc"
      }
    });

    return Response.json({
      success: true,
      jobs
    });

  } catch (error) {
    console.error("Jobs fetch error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
