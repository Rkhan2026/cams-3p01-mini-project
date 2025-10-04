import Button from '../../ui/Button.jsx';

/**
 * Pending jobs list component for TPO dashboard
 * @param {Object} props - Component props
 * @param {Array} props.jobs - Array of pending job objects
 * @param {function} props.onApprove - Approval handler function
 * @param {function} props.onNavigate - Navigation handler function
 * @param {string} props.className - Additional CSS classes
 */
export default function PendingJobsList({ 
  jobs, 
  onApprove, 
  onNavigate, 
  className = "",
  ...props 
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`} {...props}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Job Approvals
        </h2>
        <Button
          onClick={() => onNavigate("/tpo/jobs")}
          variant="secondary"
          size="sm"
        >
          View All
        </Button>
      </div>
      
      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No pending job approvals.
        </p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="border border-gray-200 rounded-lg p-3">
              <h3 className="font-semibold text-gray-900">
                {job.recruiter?.name || 'Recruiter'}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {job.jobDescription}
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() => onApprove(job.id, true)}
                  variant="primary"
                  size="sm"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => onApprove(job.id, false)}
                  variant="secondary"
                  size="sm"
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}