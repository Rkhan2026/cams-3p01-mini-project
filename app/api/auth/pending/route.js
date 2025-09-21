import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request) {
  try {
    const session = await getSession();
    
    // Check if user is TPO Admin
    if (!session || session.role !== "TPO") {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    // Get pending students
    const pendingStudents = await prisma.student.findMany({
      where: { accountStatus: "PENDING_STUDENT" },
      select: {
        id: true,
        name: true,
        email: true,
        facultyNo: true,
        enrollmentNo: true,
        academicRecords: true,
        accountStatus: true
      }
    });

    // Get pending recruiters
    const pendingRecruiters = await prisma.companyRecruiter.findMany({
      where: { accountStatus: "PENDING_RECRUITER" },
      select: {
        id: true,
        name: true,
        email: true,
        companyProfile: true,
        accountStatus: true
      }
    });

    return Response.json({
      success: true,
      data: {
        students: pendingStudents.map(student => ({ ...student, userType: "STUDENT" })),
        recruiters: pendingRecruiters.map(recruiter => ({ ...recruiter, userType: "RECRUITER" }))
      }
    });

  } catch (error) {
    console.error("Pending users fetch error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}