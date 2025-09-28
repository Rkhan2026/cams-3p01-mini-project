import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { role, email, password, name, ...rest } = body;

    // Validation
    if (!role || !email || !password || !name) {
      return NextResponse.json(
        { success: false, error: { message: "Missing required fields" } },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await Promise.all([
      prisma.student.findUnique({ where: { email } }),
      prisma.companyRecruiter.findUnique({ where: { email } }),
      prisma.tpoAdmin.findUnique({ where: { email } }),
    ]);

    if (existingUser.some((user) => user !== null)) {
      return NextResponse.json(
        { success: false, error: { message: "Email already registered" } },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    let createdUser;
    let successMessage;

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
        resumeLink,
      } = rest;

      const academicRecords = {
        classXPercentage: classXPercentage
          ? parseFloat(classXPercentage)
          : null,
        classXIIPercentage: classXIIPercentage
          ? parseFloat(classXIIPercentage)
          : null,
        courseEnrolled: courseEnrolled || null,
        college: college || null,
        currentCGPA: currentCGPA ? parseFloat(currentCGPA) : null,
        currentYearSemester: currentYearSemester || null,
        resumeLink: resumeLink || null,
      };

      createdUser = await prisma.student.create({
        data: {
          name,
          email,
          passwordHash,
          facultyNo: facultyNo || null,
          enrollmentNo: enrollmentNo || null,
          academicRecords,
          accountStatus: "PENDING_STUDENT",
        },
      });

      successMessage = "Student registration submitted for approval";
    } else if (role === "RECRUITER") {
      const { companyName, companyProfile } = rest;

      if (!companyName || !companyProfile) {
        return NextResponse.json(
          {
            success: false,
            error: { message: "Company name and profile are required" },
          },
          { status: 400 }
        );
      }

      createdUser = await prisma.companyRecruiter.create({
        data: {
          name,
          email,
          passwordHash,
          companyProfile,
          accountStatus: "PENDING_RECRUITER",
        },
      });

      successMessage = "Recruiter registration submitted for approval";
    } else if (role === "TPO") {
      createdUser = await prisma.tpoAdmin.create({
        data: {
          name,
          email,
          passwordHash,
          role: "TPO_ADMIN",
        },
      });

      successMessage = "TPO Admin account created successfully";
    } else {
      return NextResponse.json(
        { success: false, error: { message: "Invalid role" } },
        { status: 400 }
      );
    }

    // ------------------------------
    // Send registration email via EmailJS
    // ------------------------------
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_WELCOME;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    console.log("EmailJS config:", { templateId, serviceId, publicKey });

    if (templateId && serviceId && publicKey) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      try {
        console.log("Sending welcome email to:", createdUser.email);

        const response = await fetch(
          "https://api.emailjs.com/api/v1.0/email/send",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              service_id: serviceId,
              template_id: templateId,
              user_id: publicKey,
              template_params: {
                name: createdUser.name, // replaces {{name}} in your EmailJS template
                email: createdUser.email, // recipient in template
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeout);

        console.log("EmailJS response status:", response.status);
        const responseText = await response.text();
        console.log("EmailJS response body:", responseText);

        if (!response.ok) {
          console.error("EmailJS API returned an error");
        } else {
          console.log("Welcome email sent successfully!");
        }
      } catch (err) {
        clearTimeout(timeout);
        if (err.name === "AbortError") {
          console.error("EmailJS request timed out");
        } else {
          console.error("EmailJS request error:", err);
        }
      }
    } else {
      console.error("Missing EmailJS environment variables");
    }

    return NextResponse.json(
      {
        success: true,
        message: successMessage,
        user: {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: role === "TPO" ? "TPO" : role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === "production") {
      await prisma.$disconnect();
    }
  }
}
