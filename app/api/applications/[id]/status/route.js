import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    
    // Check if user is authorized (recruiter or TPO)
    if (!session || (session.role !== "RECRUITER" && session.role !== "TPO")) {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["APPLIED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "HIRED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { success: false, error: { message: "Invalid status" } },
        { status: 400 }
      );
    }

    // Get the application with job details
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            recruiter: true
          }
        },
        student: true
      }
    });

    if (!application) {
      return Response.json(
        { success: false, error: { message: "Application not found" } },
        { status: 404 }
      );
    }

    // Check if recruiter owns this job (unless TPO)
    if (session.role === "RECRUITER" && application.job.recruiterId !== session.id) {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { applicationStatus: status },
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
            enrollmentNo: true
          }
        }
      }
    });

    return Response.json({
      success: true,
      message: `Application status updated to ${status.toLowerCase().replace("_", " ")}`,
      application: updatedApplication
    });

  } catch (error) {
    console.error("Application status update error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}