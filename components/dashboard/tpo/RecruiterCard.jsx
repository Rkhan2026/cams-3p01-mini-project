import Button from '../../ui/Button.jsx';
import Badge from '../../ui/Badge.jsx';

/**
 * Recruiter card component for TPO approvals page
 * @param {Object} props - Component props
 * @param {Object} props.recruiter - Recruiter object with details
 * @param {function} props.onApprove - Approval handler function
 * @param {string} props.status - Current status (PENDING, APPROVED, REJECTED)
 * @param {string} props.className - Additional CSS classes
 */
export default function RecruiterCard({ 
  recruiter, 
  onApprove, 
  status, 
  className = "",
  ...props 
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md ${className}`} {...props}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {recruiter.name}
          </h3>
          <p className="text-sm text-gray-500">{recruiter.email}</p>
        </div>
        {status !== "PENDING" && (
          <Badge status={status.toLowerCase()}>
            {status}
          </Badge>
        )}
      </div>

      <div className="mb-5">
        <h4 className="font-semibold text-sm text-gray-800 mb-2">
          Company Profile:
        </h4>
        <p className="text-sm bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
          {recruiter.companyProfile}
        </p>
      </div>

      {status === "PENDING" && (
        <div className="flex gap-3 pt-4 border-t mt-4">
          <Button
            onClick={() => onApprove(recruiter.id, "RECRUITER", true)}
            variant="primary"
          >
            Approve
          </Button>
          <Button
            onClick={() => onApprove(recruiter.id, "RECRUITER", false)}
            variant="secondary"
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}