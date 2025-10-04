import Badge from '../../ui/Badge.jsx';
import EmptyState from '../../ui/EmptyState.jsx';

/**
 * Recent applications component for student dashboard
 * @param {Object} props - Component props
 * @param {Array} props.applications - Array of application objects
 * @param {function} props.onNavigate - Navigation handler function
 * @param {string} props.className - Additional CSS classes
 */
export default function RecentApplications({ applications, onNavigate, className = "", ...props }) {
  const getStatusBadge = (status) => {
    const statusMap = {
      APPLIED: { status: "info", label: "Applied" },
      SHORTLISTED: { status: "warning", label: "Shortlisted" },
      INTERVIEW_SCHEDULED: { status: "info", label: "Interview" },
      HIRED: { status: "success", label: "Hired" },
      REJECTED: { status: "rejected", label: "Rejected" }
    };
    
    const config = statusMap[status] || { status: "info", label: status };
    return <Badge status={config.status}>{config.label}</Badge>;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`} {...props}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
        <button
          onClick={() => onNavigate("/student/applications")}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
        </button>
      </div>
      
      {applications.length === 0 ? (
        <EmptyState
          title="No Applications Yet"
          message="Apply for a job to see your status here."
          buttonText="Start Applying"
          onButtonClick={() => onNavigate("/student/jobs")}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">
                  {app.job.recruiter.name}
                </h3>
                {getStatusBadge(app.applicationStatus)}
              </div>
              <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                {app.job.jobDescription}
              </p>
              <div className="text-xs text-gray-400">
                Deadline: {formatDate(app.job.applicationDeadline)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}