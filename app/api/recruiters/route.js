import prisma from "@/lib/prisma";

export async function GET() {
  const recruiters = await prisma.companyRecruiter.findMany();
  return Response.json(recruiters);
}

export async function POST(request) {
  const data = await request.json();
  const created = await prisma.companyRecruiter.create({ data });
  return Response.json(created, { status: 201 });
}







