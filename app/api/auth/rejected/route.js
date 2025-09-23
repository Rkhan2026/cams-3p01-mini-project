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

    // Get rejected students
    const rejectedStudents = await prisma.student.findMany({
      where: { accountStatus: "REJECTED" },
      select: {
        id: true,
        name: true,
        email: true,
        facultyNo: true,
        enrollmentNo: true,
        academicRecords: true,
        accountStatus: true,
      },
    });

    // Get rejected recruiters
    const rejectedRecruiters = await prisma.companyRecruiter.findMany({
      where: { accountStatus: "REJECTED" },
      select: {
        id: true,
        name: true,
        email: true,
        companyProfile: true,
        accountStatus: true,
      },
    });

    return Response.json({
      success: true,
      data: {
        students: rejectedStudents.map((student) => ({
          ...student,
          userType: "STUDENT",
        })),
        recruiters: rejectedRecruiters.map((recruiter) => ({
          ...recruiter,
          userType: "RECRUITER",
        })),
      },
    });
  } catch (error) {
    console.error("Rejected users fetch error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
