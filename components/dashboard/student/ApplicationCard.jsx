import { useMemo } from "react";
import Badge from "../../ui/Badge.jsx";

/**
 * Application card component for displaying individual applications
 * @param {Object} props - Component props
 * @param {Object} props.application - Application object with job and status data
 * @param {function} props.onViewDetails - Handler for viewing job details
 * @param {function} props.onWithdraw - Handler for withdrawing application
 * @param {string} props.className - Additional CSS classes
 */
export default function ApplicationCard({
  application,
  onViewDetails,
  onWithdraw,
  className = "",
  ...props
}) {
  const { job, applicationStatus, appliedAt } = application;

  // Extract job title from parentheses in description
  const extractJobTitle = (description) => {
    const match = description.match(/\(([^)]+)\)/);
    return match ? match[1] : "Position";
  };

  // Get description without parentheses content
  const getCleanDescription = (description) => {
    return description.replace(/\s*\([^)]*\)\s*/g, "").trim();
  };

  const statusConfig = useMemo(
    () => ({
      APPLIED: {
        label: "Applied",
        icon: "📝",
        status: "info",
        infoText: null,
      },
      SHORTLISTED: {
        label: "Shortlisted",
        icon: "⭐",
        status: "warning",
        infoText: "You're on the shortlist! The recruiter may reach out soon.",
      },
      INTERVIEW_SCHEDULED: {
        label: "Interview",
        icon: "📅",
        status: "info",
        infoText: "Interview scheduled! Check your email for details.",
      },
      HIRED: {
        label: "Hired",
        icon: "🎉",
        status: "success",
        infoText:
          "Congratulations, you got the job! The recruiter will be in touch.",
      },
      REJECTED: {
        label: "Rejected",
        icon: "❌",
        status: "rejected",
        infoText:
          "Application not selected. Don't give up, more opportunities await!",
      },
    }),
    [applicationStatus]
  );

  const currentStatus = statusConfig[applicationStatus] || {
    label: applicationStatus,
    icon: "📋",
    status: "info",
    infoText: null,
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div
      className={`bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 ${className}`}
      {...props}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">{currentStatus.icon}</span>
            <h3 className="text-xl font-bold text-gray-900">
              {extractJobTitle(job.jobDescription)}
            </h3>
            <Badge status={currentStatus.status}>{currentStatus.label}</Badge>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2 sm:mt-0">
          Deadline: {formatDate(job.applicationDeadline)}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4 mb-4">
        <h4 className="font-semibold text-sm mb-2 text-gray-800">
          Company & Recruiter
        </h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Name:</span> {job.recruiter.name}
          </p>
          <p className="line-clamp-2">
            <span className="font-medium">Profile:</span>{" "}
            {job.recruiter.companyProfile}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-gray-800">
          Job Description
        </h4>
        <p className="text-sm text-gray-700 line-clamp-2">
          {getCleanDescription(job.jobDescription)}
        </p>
      </div>

      {currentStatus.infoText && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm border ${
            currentStatus.status === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : currentStatus.status === "warning"
              ? "bg-yellow-50 border-yellow-200 text-yellow-700"
              : currentStatus.status === "rejected"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          <p>{currentStatus.infoText}</p>
        </div>
      )}

      <div className="flex gap-3 mt-6 border-t border-gray-100 pt-4">
        <button
          onClick={onViewDetails}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          View Job Details
        </button>
      </div>
    </div>
  );
}
