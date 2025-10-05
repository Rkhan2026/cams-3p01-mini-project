import Button from '../../ui/Button.jsx';

/**
 * Empty state component specifically for student applications
 * @param {Object} props - Component props
 * @param {string} props.filter - Current filter being applied
 * @param {function} props.onBrowseJobs - Handler for browse jobs action
 * @param {string} props.className - Additional CSS classes
 */
export default function ApplicationsEmptyState({ 
  filter, 
  onBrowseJobs, 
  className = "",
  ...props 
}) {
  const getTitle = () => {
    if (filter === "ALL") {
      return "You haven't applied for any jobs yet";
    }
    return `No applications found for "${filter.replace("_", " ").toLowerCase()}"`;
  };

  const getMessage = () => {
    if (filter === "ALL") {
      return "Get started by browsing available opportunities.";
    }
    return "Try selecting another category or browse for new jobs.";
  };

  return (
    <div className={`text-center py-16 px-6 bg-gray-50 rounded-lg border-2 border-dashed ${className}`} {...props}>
      <div className="mx-auto h-12 w-12 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-800">
        {getTitle()}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {getMessage()}
      </p>
      <div className="mt-6">
        <Button onClick={onBrowseJobs}>
          Browse Jobs
        </Button>
      </div>
    </div>
  );
}