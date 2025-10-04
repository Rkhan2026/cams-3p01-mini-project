import { getSession } from "@/lib/session";
import { PrismaClient } from "@/app/generated/prisma";
import { redirect } from "next/navigation";
import BackButton from "@/components/BackButton";

const prisma = new PrismaClient();

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

  // Fetch student data from database
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
          {/* Profile Content */}
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Personal Information
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{student.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {student.email}
                    </p>
                  </div>

                  {student.facultyNo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Faculty Number
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {student.facultyNo}
                      </p>
                    </div>
                  )}

                  {student.enrollmentNo && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Enrollment Number
                      </label>
                      <p className="mt-1 text-sm text-gray-900">
                        {student.enrollmentNo}
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Account Status
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.accountStatus === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {student.accountStatus.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Records */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Academic Records
                </h2>

                {student.academicRecords ? (
                  <div className="space-y-3">
                    {student.academicRecords.college && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          College
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {student.academicRecords.college}
                        </p>
                      </div>
                    )}

                    {student.academicRecords.courseEnrolled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Course Enrolled
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {student.academicRecords.courseEnrolled}
                        </p>
                      </div>
                    )}

                    {student.academicRecords.currentYearSemester && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Current Year/Semester
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {student.academicRecords.currentYearSemester}
                        </p>
                      </div>
                    )}

                    {student.academicRecords.currentCGPA && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Current CGPA
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {student.academicRecords.currentCGPA}
                        </p>
                      </div>
                    )}

                    {student.academicRecords.classXPercentage && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Class X Percentage
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {student.academicRecords.classXPercentage}%
                        </p>
                      </div>
                    )}

                    {student.academicRecords.classXIIPercentage && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Class XII Percentage
                        </label>
                        <p className="mt-1 text-sm text-gray-900">
                          {student.academicRecords.classXIIPercentage}%
                        </p>
                      </div>
                    )}

                    {student.academicRecords.resumeLink && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Resume
                        </label>
                        <a
                          href={student.academicRecords.resumeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">
                    No academic records available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
