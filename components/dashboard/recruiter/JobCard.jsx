import Badge from "../../ui/Badge.jsx";
import Button from "../../ui/Button.jsx";
import { CalendarIcon, UsersIcon } from "../../icons";

/**
 * Job card component for recruiter dashboard
 * @param {Object} props - Component props
 * @param {Object} props.job - Job object with details
 * @param {Object} props.router - Next.js router object for navigation
 * @param {string} props.className - Additional CSS classes
 */
export default function JobCard({ job, router, className = "", ...props }) {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: "pending",
      APPROVED: "approved",
      REJECTED: "rejected",
    };
    return statusMap[status] || "info";
  };

  // Extract title from parentheses in job description
  const extractJobTitle = (description) => {
    if (!description) return null;
    // 1) If title is provided in parentheses: "(... )"
    const paren = description.match(/\(([^)]+)\)/);
    if (paren) return paren[1].trim();
    // 2) Common pattern: "<Title> at <Company>..." -> grab the part before " at "
    const atMatch = description.match(/^(.+?)\s+at\s+/i);
    if (atMatch) return atMatch[1].trim();
    // 3) If description contains "CTC" or "package" after title, capture leading segment
    const ctcMatch = description.match(/^(.+?)\s+CTC[:\s]/i);
    if (ctcMatch) return ctcMatch[1].trim();
    // 4) Fallback: title is the first phrase up to a period or colon
    const leadMatch = description.match(/^([^.:]+)[.:]/);
    if (leadMatch) return leadMatch[1].trim();
    return null;
  };

  // Get description without parentheses content
  const getCleanDescription = (description) => {
    if (!description) return "";
    // Remove parentheses content
    let cleaned = description.replace(/\s*\([^)]*\)\s*/g, "").trim();
    // Remove leading "<Title> at <Company>." patterns so the description body remains
    cleaned = cleaned.replace(/^.+?\s+at\s+[^.]+\.\s*/i, "");
    // Also remove leading title followed directly by CTC or package (e.g. "DevOps Engineer. CTC: ...")
    cleaned = cleaned.replace(/^.+?[.:]\s*/i, (match) => {
      // If the match contains 'CTC' or 'package', strip only the leading phrase
      if (/CTC|package/i.test(match)) return "";
      return match;
    });
    return cleaned.trim();
  };

  const jobTitle =
    extractJobTitle(job.jobDescription) ||
    job.title ||
    `Job Posting #${job.id.slice(-6)}`;
  const cleanDescription = getCleanDescription(job.jobDescription);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-300 ${className}`}
      {...props}
    >
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{jobTitle}</h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-gray-500" />
              <span>Deadline: {formatDate(job.applicationDeadline)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersIcon className="w-4 h-4 text-gray-500" />
              <span>{job._count?.applications || 0} Applications</span>
            </div>
          </div>
        </div>
        <Badge status={getStatusBadge(job.approvalStatus)}>
          {job.approvalStatus}
        </Badge>
      </div>

      {/* Card Body */}
      <div className="space-y-4 mb-5 pt-4 border-t border-gray-100">
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Description
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {cleanDescription}
          </p>
        </div>
        {job.eligibilityCriteria && (
          <div>
            <h4 className="font-semibold text-sm text-gray-800 mb-1">
              Eligibility
            </h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {job.eligibilityCriteria}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
