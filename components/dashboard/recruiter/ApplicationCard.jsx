/**
 * ApplicationCard Component
 *
 * Displays student application information with academic records and resume link.
 * Provides status update actions and handles application status changes.
 */

import { DownloadIcon } from "../../icons/ActionIcons.jsx";
import ApplicationActionButtons from "./ApplicationActionButtons.jsx";

const ApplicationCard = ({ application, job, onStatusUpdate }) => {
  const getStatusBadge = (status) => {
    const styles = {
      APPLIED: "bg-blue-100 text-blue-800 border-blue-200",
      SHORTLISTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
      INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-800 border-purple-200",
      HIRED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
          styles[status] || "bg-gray-100"
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const student = application.student;
  const academics = student.academicRecords || {};
  // Try multiple places for job data so the UI works with different API shapes
  // Prefer the `job` prop passed by the parent (jobForApp)
  const jobSource = job || application.job || application.jobPosting || null;
  // JobPosting in Prisma stores details in `jobDescription` (no separate title field).
  // Reuse the same extraction logic used elsewhere: extract title inside parentheses.
  const extractJobTitle = (description) => {
    if (!description) return null;
    const match = description.match(/\(([^)]+)\)/);
    return match ? match[1] : null;
  };

  const getCleanDescription = (description) => {
    if (!description) return "";
    return description.replace(/\s*\([^)]*\)\s*/g, "").trim();
  };

  const rawDescription =
    job?.jobDescription ||
    jobSource?.jobDescription ||
    application.description ||
    application.jobDescription ||
    "";
  const jobTitle =
    extractJobTitle(rawDescription) ||
    jobSource?.title ||
    application.jobTitle ||
    application.title ||
    null;
  const jobDescription = getCleanDescription(rawDescription);

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-500">{student.email}</p>

          {/* Show only job title and brief description as requested */}
          {jobTitle || jobDescription ? (
            <div className="mt-2 text-sm">
              {jobTitle ? (
                <p className="font-medium text-gray-800">{jobTitle}</p>
              ) : null}

              {jobDescription ? (
                <p
                  className={`text-sm ${
                    jobTitle
                      ? "text-gray-600 mt-1"
                      : "font-medium text-gray-800"
                  } line-clamp-2`}
                >
                  {jobDescription}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="mt-2 text-sm">
              <p className="text-sm text-gray-500">Job details not available</p>
            </div>
          )}
        </div>
        {getStatusBadge(application.applicationStatus)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 text-sm mb-2">
            Student Details
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            {student.facultyNo && (
              <p>
                <strong>Faculty No:</strong> {student.facultyNo}
              </p>
            )}
            {student.enrollmentNo && (
              <p>
                <strong>Enrollment No:</strong> {student.enrollmentNo}
              </p>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 text-sm mb-2">
            Academic Snapshot
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>CGPA:</strong> {academics.currentCGPA || "N/A"}
            </p>
            <p>
              <strong>Course:</strong> {academics.courseEnrolled || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {academics.resumeLink && (
        <div className="mt-4">
          <a
            href={academics.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <DownloadIcon className="w-4 h-4 mr-1.5" /> View Full Resume
          </a>
        </div>
      )}

      <ApplicationActionButtons
        application={application}
        onStatusUpdate={onStatusUpdate}
      />
    </div>
  );
};

export default ApplicationCard;
