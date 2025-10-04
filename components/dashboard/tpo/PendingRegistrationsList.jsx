import Badge from '../../ui/Badge.jsx';
import Button from '../../ui/Button.jsx';

/**
 * Pending registrations list component for TPO dashboard
 * @param {Object} props - Component props
 * @param {Array} props.registrations - Array of pending user registrations
 * @param {function} props.onApprove - Approval handler function
 * @param {function} props.onNavigate - Navigation handler function
 * @param {string} props.className - Additional CSS classes
 */
export default function PendingRegistrationsList({ 
  registrations, 
  onApprove, 
  onNavigate, 
  className = "",
  ...props 
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`} {...props}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Pending Registrations
        </h2>
        <Button
          onClick={() => onNavigate("/tpo/approvals")}
          variant="secondary"
          size="sm"
        >
          View All
        </Button>
      </div>
      
      {registrations.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No pending registrations.
        </p>
      ) : (
        <div className="space-y-3">
          {registrations.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <Badge 
                  status={user.type === "Student" ? "info" : "success"}
                >
                  {user.type}
                </Badge>
              </div>
              <div className="flex gap-2 mt-3">
                <Button
                  onClick={() =>
                    onApprove(user.id, user.type.toUpperCase(), true)
                  }
                  variant="primary"
                  size="sm"
                >
                  Approve
                </Button>
                <Button
                  onClick={() =>
                    onApprove(user.id, user.type.toUpperCase(), false)
                  }
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