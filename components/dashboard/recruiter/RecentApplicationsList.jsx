import Badge from '../../ui/Badge.jsx';
import Button from '../../ui/Button.jsx';

/**
 * Recent applications list component for recruiter dashboard
 * @param {Object} props - Component props
 * @param {Array} props.applications - Array of application objects
 * @param {function} props.onNavigate - Navigation handler function
 * @param {string} props.className - Additional CSS classes
 */
export default function RecentApplicationsList({ applications, onNavigate, className = "", ...props }) {
  const getStatusBadge = (status) => {
    const statusMap = {
      APPLIED: "info",
      SHORTLISTED: "warning", 
      HIRED: "success"
    };
    return statusMap[status] || "info";
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`} {...props}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Applications
        </h2>
        <Button
          onClick={() => onNavigate("/recruiter/applications")}
          variant="secondary"
          size="sm"
        >
          View All
        </Button>
      </div>
      
      {applications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No new applications received.
        </p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {app.student?.name || 'Student'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Applied for:{" "}
                    {app.job?.title || `Job #${app.job?.id?.slice(-6) || 'N/A'}`}
                  </p>
                </div>
                <Badge status={getStatusBadge(app.applicationStatus)}>
                  {app.applicationStatus}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}