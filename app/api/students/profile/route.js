import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return new Response("Unauthorized", { status: 401 });
  }

  const student = await prisma.student.findUnique({
    where: { id: session.id },
    select: {
      name: true,
      facultyNo: true,
      enrollmentNo: true,
      academicRecords: true,
      accountStatus: true,
    },
  });

  if (!student) {
    return new Response("Student not found", { status: 404 });
  }

  return Response.json(student);
}

export async function PUT(request) {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") {
    return new Response("Unauthorized", { status: 401 });
  }

  const data = await request.json();
  const { name, facultyNo, enrollmentNo, academicRecords } = data;

  try {
    // Parse academic records if provided
    let parsedRecords = null;
    if (academicRecords) {
      try {
        parsedRecords = JSON.parse(academicRecords);
      } catch (e) {
        return new Response("Invalid JSON format for academic records", {
          status: 400,
        });
      }
    }

    const updated = await prisma.student.update({
      where: { id: session.id },
      data: {
        name,
        facultyNo,
        enrollmentNo,
        academicRecords: parsedRecords,
      },
    });

    return Response.json(updated);
  } catch (error) {
    return new Response("Failed to update profile", { status: 500 });
  }
}
