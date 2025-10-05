/**
 * JobApprovalCard Component
 * 
 * Displays job details for approval with recruiter information.
 * Includes approval/rejection buttons for pending jobs and status indicators.
 */

const Button = ({ onClick, className, children, ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const JobApprovalCard = ({ job, onApprove }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  // Extract job title from parentheses in job description
  const extractJobTitle = (description) => {
    const match = description.match(/\(([^)]+)\)/);
    return match ? match[1] : "Job Position";
  };

  // Extract description without parentheses
  const extractDescriptionWithoutParentheses = (description) => {
    return description.replace(/\([^)]*\)/g, '').trim();
  };

  const statusInfo = {
    APPROVED: {
      text: "✓ This job posting has been approved and is visible to students.",
      className: "text-green-700 bg-green-50 border-green-200",
    },
    REJECTED: {
      text: "✗ This job posting has been rejected and is not visible to students.",
      className: "text-red-700 bg-red-50 border-red-200",
    },
  };
  const currentStatusInfo = statusInfo[job.approvalStatus];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {extractJobTitle(job.jobDescription)}
          </h3>
          <p className="text-sm text-gray-500">
            <strong>Deadline:</strong> {formatDate(job.applicationDeadline)}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Applications Received:</strong> {job._count?.applications || 0}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.approvalStatus === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : job.approvalStatus === "APPROVED"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {job.approvalStatus}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Recruiter
          </h4>
          <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-700 whitespace-pre-wrap">
            {job.recruiter.name}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Company Profile
          </h4>
          <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-700 whitespace-pre-wrap">
            {job.recruiter.companyProfile}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Job Description
          </h4>
          <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-700 whitespace-pre-wrap">
            {extractDescriptionWithoutParentheses(job.jobDescription)}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Eligibility Criteria
          </h4>
          <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-700 whitespace-pre-wrap">
            {job.eligibilityCriteria}
          </p>
        </div>
      </div>

      {job.approvalStatus === "PENDING" && (
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <Button
            onClick={() => onApprove(job.id, true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
          <Button
            onClick={() => onApprove(job.id, false)}
            className="bg-red-600 hover:bg-red-700"
          >
            Reject
          </Button>
        </div>
      )}

      {currentStatusInfo && (
        <div
          className={`mt-6 p-3 rounded-lg border text-sm ${currentStatusInfo.className}`}
        >
          {currentStatusInfo.text}
        </div>
      )}
    </div>
  );
};

export default JobApprovalCard;