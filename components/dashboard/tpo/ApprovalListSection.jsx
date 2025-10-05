import EmptyState from '../../ui/EmptyState.jsx';

/**
 * Approval list section component for displaying lists of users
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {Array} props.users - Array of user objects
 * @param {React.Component} props.CardComponent - Component to render each user
 * @param {function} props.onApprove - Approval handler function
 * @param {string} props.emptyMessage - Message to show when no users
 * @param {string} props.status - Current filter status
 * @param {string} props.className - Additional CSS classes
 */
export default function ApprovalListSection({
  title,
  users,
  CardComponent,
  onApprove,
  emptyMessage,
  status,
  className = "",
  ...props
}) {
  return (
    <div className={`mb-10 ${className}`} {...props}>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
      {users.length === 0 ? (
        <EmptyState
          title={emptyMessage}
          message="Check back later or try a different filter."
        />
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <CardComponent
              key={user.id}
              student={user}
              recruiter={user}
              onApprove={onApprove}
              status={status}
            />
          ))}
        </div>
      )}
    </div>
  );
}