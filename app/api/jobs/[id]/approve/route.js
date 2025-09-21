import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PUT(request, { params }) {
  try {
    const session = await getSession();
    
    // Check if user is TPO Admin
    if (!session || session.role !== "TPO") {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { approved, comments } = body;

    if (typeof approved !== "boolean") {
      return Response.json(
        { success: false, error: { message: "Approval status is required" } },
        { status: 400 }
      );
    }

    const newStatus = approved ? "APPROVED" : "REJECTED";

    const updatedJob = await prisma.jobPosting.update({
      where: { id },
      data: { approvalStatus: newStatus },
      include: {
        recruiter: {
          select: {
            name: true,
            email: true,
            companyProfile: true
          }
        }
      }
    });

    return Response.json({
      success: true,
      message: `Job posting ${approved ? "approved" : "rejected"} successfully`,
      job: updatedJob
    });

  } catch (error) {
    console.error("Job approval error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}