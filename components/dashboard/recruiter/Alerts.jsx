/**
 * Recruiter alerts component for dashboard notifications
 * @param {Object} props - Component props
 * @param {number} props.newApplications - Number of new applications
 * @param {number} props.pendingJobs - Number of pending job approvals
 * @param {string} props.className - Additional CSS classes
 */
export default function Alerts({ 
  newApplications = 0, 
  pendingJobs = 0, 
  className = "",
  ...props 
}) {
  if (newApplications === 0 && pendingJobs === 0) {
    return null;
  }

  return (
    <div className={`mt-8 space-y-4 ${className}`} {...props}>
      {newApplications > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-2xl">📬</span>
          <div>
            <h3 className="font-semibold text-blue-800">
              New Applications Received
            </h3>
            <p className="text-sm text-blue-700">
              You have {newApplications} new application
              {newApplications > 1 ? "s" : ""} to review.
            </p>
          </div>
        </div>
      )}
      
      {pendingJobs > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-2xl">⏳</span>
          <div>
            <h3 className="font-semibold text-yellow-800">
              Jobs Pending Approval
            </h3>
            <p className="text-sm text-yellow-700">
              You have {pendingJobs} job posting{pendingJobs > 1 ? "s" : ""}{" "}
              awaiting TPO approval.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}