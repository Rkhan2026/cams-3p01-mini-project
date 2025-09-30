import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PUT(request, { params }) {
  try {
    const session = await getSession();

    // Authorization: recruiter or TPO only
    if (!session || (session.role !== "RECRUITER" && session.role !== "TPO")) {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = [
      "APPLIED",
      "SHORTLISTED",
      "INTERVIEW_SCHEDULED",
      "HIRED",
      "REJECTED",
    ];
    if (!validStatuses.includes(status)) {
      return Response.json(
        { success: false, error: { message: "Invalid status" } },
        { status: 400 }
      );
    }

    // Fetch application with relations
    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: { recruiter: true },
        },
        student: true,
      },
    });

    if (!application) {
      return Response.json(
        { success: false, error: { message: "Application not found" } },
        { status: 404 }
      );
    }

    // Check recruiter ownership (if not TPO)
    if (
      session.role === "RECRUITER" &&
      application.job.recruiterId !== session.id
    ) {
      return Response.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    // Update status
    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { applicationStatus: status },
      include: {
        job: {
          include: {
            recruiter: { select: { name: true, companyProfile: true } },
          },
        },
        student: {
          select: {
            name: true,
            email: true,
            facultyNo: true,
            enrollmentNo: true,
          },
        },
      },
    });

    // Extract job title from parentheses in jobDescription
    const jobDescription = updatedApplication.job.jobDescription;
    const match = jobDescription.match(/\(([^)]+)\)/);
    const jobTitle = match ? match[1] : "Job";

    // Fetch all jobs posted by this recruiter
    let recruiterJobs = [];
    if (session.role === "RECRUITER") {
      recruiterJobs = await prisma.jobPosting.findMany({
        where: { recruiterId: session.id },
        select: {
          id: true,
          jobDescription: true,
          approvalStatus: true,
          applicationDeadline: true,
        },
      });
    }

    // ------------------------------
    // Send EmailJS status update email
    // ------------------------------
    const templateId =
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_STATUS_UPDATE;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (templateId && serviceId && publicKey) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      try {
        console.log(
          `Sending application status update email to: ${updatedApplication.student.email}`
        );

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
                name: updatedApplication.student.name,
                email: updatedApplication.student.email,
                status: status,
                jobTitle: jobTitle,
                company: updatedApplication.job.recruiter.companyProfile,
              },
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeout);
        console.log("EmailJS status:", response.status);
        if (!response.ok) {
          console.error("EmailJS API error:", await response.text());
        }
      } catch (err) {
        clearTimeout(timeout);
        console.error("EmailJS request error:", err);
      }
    } else {
      console.error("Missing EmailJS env variables for status emails");
    }

    return Response.json({
      success: true,
      message: `Application status updated to ${status
        .toLowerCase()
        .replace("_", " ")}`,
      application: updatedApplication,
      recruiterJobs, // all jobs by this recruiter
      jobDescription: updatedApplication.job.jobDescription, // description of this job
    });
  } catch (error) {
    console.error("Application status update error:", error);
    return Response.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
