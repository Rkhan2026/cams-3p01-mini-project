import prisma from "@/lib/prisma";

export async function GET() {
  const pendingStudents = await prisma.student.findMany({
    where: { accountStatus: "PENDING_STUDENT" },
  });
  const pendingRecruiters = await prisma.companyRecruiter.findMany({
    where: { accountStatus: "PENDING_RECRUITER" },
  });
  const pendingJobs = await prisma.jobPosting.findMany({
    where: { approvalStatus: "PENDING" },
  });
  return Response.json({
    students: pendingStudents,
    recruiters: pendingRecruiters,
    jobs: pendingJobs,
  });
}

export async function POST(request) {
  const { type, id, action, tpoId } = await request.json();
  if (type === "student") {
    const updated = await prisma.student.update({
      where: { id },
      data: {
        accountStatus:
          action === "approve" ? "VERIFIED_STUDENT" : "REJECTED_STUDENT",
      },
    });
    return Response.json(updated);
  }
  if (type === "recruiter") {
    const updated = await prisma.companyRecruiter.update({
      where: { id },
      data: {
        accountStatus:
          action === "approve" ? "VERIFIED_RECRUITER" : "REJECTED_RECRUITER",
      },
    });
    return Response.json(updated);
  }
  if (type === "job") {
    const updated = await prisma.jobPosting.update({
      where: { id },
      data: {
        approvalStatus: action === "approve" ? "APPROVED" : "REJECTED",
      },
    });
    return Response.json(updated);
  }
  return new Response("Invalid type", { status: 400 });
}
