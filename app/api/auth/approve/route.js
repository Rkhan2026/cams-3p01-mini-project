import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PUT(request) {
  try {
    const session = await getSession();
    
    // Check if user is TPO Admin
    if (!session || session.role !== "TPO") {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { userId, userType, approved, reason } = body;

    if (!userId || !userType || typeof approved !== "boolean") {
      return Response.json(
        { success: false, error: { message: "Missing required fields" } },
        { status: 400 }
      );
    }

    let updatedUser;
    const newStatus = approved ? "APPROVED" : "REJECTED";

    if (userType === "STUDENT") {
      updatedUser = await prisma.student.update({
        where: { id: userId },
        data: { accountStatus: newStatus }
      });
    } else if (userType === "RECRUITER") {
      updatedUser = await prisma.companyRecruiter.update({
        where: { id: userId },
        data: { accountStatus: newStatus }
      });
    } else {
      return Response.json(
        { success: false, error: { message: "Invalid user type" } },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      message: `User ${approved ? "approved" : "rejected"} successfully`,
      user: updatedUser
    });

  } catch (error) {
    console.error("Approval error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}