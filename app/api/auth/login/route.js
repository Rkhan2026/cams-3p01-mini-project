import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/session";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { success: false, error: { message: "Email and password are required" } },
        { status: 400 }
      );
    }

    // Try to find user in all three tables
    const [student, recruiter, tpoAdmin] = await Promise.all([
      prisma.student.findUnique({ where: { email } }),
      prisma.companyRecruiter.findUnique({ where: { email } }),
      prisma.tpoAdmin.findUnique({ where: { email } })
    ]);

    let user = null;
    let userRole = null;

    if (student) {
      user = student;
      userRole = "STUDENT";
    } else if (recruiter) {
      user = recruiter;
      userRole = "RECRUITER";
    } else if (tpoAdmin) {
      user = tpoAdmin;
      userRole = "TPO";
    }

    if (!user) {
      return Response.json(
        { success: false, error: { message: "Invalid credentials" } },
        { status: 401 }
      );
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return Response.json(
        { success: false, error: { message: "Invalid credentials" } },
        { status: 401 }
      );
    }

    // Check account approval status for students and recruiters
    if (userRole === "STUDENT" && user.accountStatus !== "APPROVED") {
      let message = "Account pending approval";
      if (user.accountStatus === "REJECTED") {
        message = "Account has been rejected";
      }
      return Response.json(
        { success: false, error: { message } },
        { status: 403 }
      );
    }

    if (userRole === "RECRUITER" && user.accountStatus !== "APPROVED") {
      let message = "Account pending approval";
      if (user.accountStatus === "REJECTED") {
        message = "Account has been rejected";
      }
      return Response.json(
        { success: false, error: { message } },
        { status: 403 }
      );
    }

    // Set session with user information
    await setSession({ 
      id: user.id, 
      role: userRole, 
      email: user.email,
      name: user.name
    });

    return Response.json({ 
      success: true, 
      message: "Login successful",
      user: {
        id: user.id,
        role: userRole,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
