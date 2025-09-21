import prisma from "@/lib/prisma";

export async function GET() {
  const students = await prisma.student.findMany();
  return Response.json(students);
}

export async function POST(request) {
  const data = await request.json();
  const created = await prisma.student.create({ data });
  return Response.json(created, { status: 201 });
}







