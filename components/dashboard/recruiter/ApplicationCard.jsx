/**
 * ApplicationCard Component
 * 
 * Displays student application information with academic records and resume link.
 * Provides status update actions and handles application status changes.
 */

import { DownloadIcon } from "../../icons/ActionIcons.jsx";
import ApplicationActionButtons from "./ApplicationActionButtons.jsx";

const ApplicationCard = ({ application, onStatusUpdate }) => {
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

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-500">{student.email}</p>
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