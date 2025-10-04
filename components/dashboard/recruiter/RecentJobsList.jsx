import Badge from '../../ui/Badge.jsx';
import Button from '../../ui/Button.jsx';

/**
 * Recent jobs list component for recruiter dashboard
 * @param {Object} props - Component props
 * @param {Array} props.jobs - Array of job objects
 * @param {function} props.onNavigate - Navigation handler function
 * @param {string} props.className - Additional CSS classes
 */
export default function RecentJobsList({ jobs, onNavigate, className = "", ...props }) {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: "pending",
      APPROVED: "approved",
      REJECTED: "rejected"
    };
    return statusMap[status] || "info";
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`} {...props}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Job Postings
        </h2>
        <Button
          onClick={() => onNavigate("/recruiter/jobs")}
          variant="secondary"
          size="sm"
        >
          View All
        </Button>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No job postings yet.</p>
          <Button
            onClick={() => onNavigate("/recruiter/jobs/new")}
          >
            Create First Job
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">
                  {job.title || `Job #${job.id.slice(-6)}`}
                </h3>
                <Badge status={getStatusBadge(job.approvalStatus)}>
                  {job.approvalStatus}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {job.jobDescription}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                <span className="font-medium text-blue-600">
                  {job._count?.applications || 0} Applications
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}