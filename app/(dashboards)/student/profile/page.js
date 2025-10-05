import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma"; // use the existing Prisma client
import { redirect } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import PersonalInfoSection from "@/components/dashboard/student/PersonalInfoSection.jsx";
import AcademicRecordsSection from "@/components/dashboard/student/AcademicRecordsSection.jsx";

const PageHeader = ({ title, subtitle }) => (
  <div className="mb-8">
    <BackButton />
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    <p className="text-gray-500 mt-1">{subtitle}</p>
  </div>
);

export default async function StudentProfile() {
  const session = await getSession();

  if (!session || session.role !== "STUDENT") {
    redirect("/auth/login");
  }

  // Use Prisma from lib
  const student = await prisma.student.findUnique({
    where: { id: session.id },
  });

  if (!student) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-white-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Student Profile"
          subtitle="View and manage your personal and academic information"
        />

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PersonalInfoSection student={student} />
              <AcademicRecordsSection
                academicRecords={student.academicRecords}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
