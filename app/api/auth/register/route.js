import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const { role, email, password, name, ...rest } = body;

    // Validation
    if (!role || !email || !password || !name) {
      return Response.json(
        { success: false, error: { message: "Missing required fields" } },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await Promise.all([
      prisma.student.findUnique({ where: { email } }),
      prisma.companyRecruiter.findUnique({ where: { email } }),
      prisma.tpoAdmin.findUnique({ where: { email } })
    ]);

    if (existingUser.some(user => user !== null)) {
      return Response.json(
        { success: false, error: { message: "Email already registered" } },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    if (role === "STUDENT") {
      const { 
        enrollmentNo, 
        facultyNo, 
        classXPercentage,
        classXIIPercentage,
        courseEnrolled,
        college,
        currentCGPA,
        currentYearSemester,
        resumeLink
      } = rest;
      
      // Structure academic records from form fields
      const academicRecords = {
        classXPercentage: classXPercentage ? parseFloat(classXPercentage) : null,
        classXIIPercentage: classXIIPercentage ? parseFloat(classXIIPercentage) : null,
        courseEnrolled: courseEnrolled || null,
        college: college || null,
        currentCGPA: currentCGPA ? parseFloat(currentCGPA) : null,
        currentYearSemester: currentYearSemester || null,
        resumeLink: resumeLink || null
      };

      const created = await prisma.student.create({
        data: {
          name,
          email,
          passwordHash,
          facultyNo: facultyNo || null,
          enrollmentNo: enrollmentNo || null,
          academicRecords,
          accountStatus: "PENDING_STUDENT"
        },
      });
      
      return Response.json({ 
        success: true, 
        message: "Student registration submitted for approval",
        user: { id: created.id, name: created.name, email: created.email, role: "STUDENT" }
      }, { status: 201 });
    }

    if (role === "RECRUITER") {
      const { companyName, companyProfile } = rest;
      
      if (!companyName || !companyProfile) {
        return Response.json(
          { success: false, error: { message: "Company name and profile are required" } },
          { status: 400 }
        );
      }

      const created = await prisma.companyRecruiter.create({
        data: {
          name,
          email,
          passwordHash,
          companyProfile,
          accountStatus: "PENDING_RECRUITER"
        },
      });
      
      return Response.json({ 
        success: true, 
        message: "Recruiter registration submitted for approval",
        user: { id: created.id, name: created.name, email: created.email, role: "RECRUITER" }
      }, { status: 201 });
    }

    if (role === "TPO") {
      const created = await prisma.tpoAdmin.create({
        data: { 
          name,
          email, 
          passwordHash, 
          role: "TPO_ADMIN" 
        },
      });
      
      return Response.json({ 
        success: true, 
        message: "TPO Admin account created successfully",
        user: { id: created.id, name: created.name, email: created.email, role: "TPO" }
      }, { status: 201 });
    }

    return Response.json(
      { success: false, error: { message: "Invalid role" } },
      { status: 400 }
    );

  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
