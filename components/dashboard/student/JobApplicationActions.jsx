const Button = ({ onClick, className, children, ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function JobApplicationActions({
  hasApplied,
  deadlinePassed,
  applying,
  onApply,
  onViewApplications,
}) {
  return (
    <div className="border-t pt-6 flex items-center gap-4">
      {!hasApplied && !deadlinePassed && (
        <Button
          onClick={onApply}
          disabled={applying}
          className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 min-w-[180px]"
          aria-label={applying ? "Submitting application" : "Apply for this job"}
        >
          {applying ? "Submitting..." : "Apply for this Job"}
        </Button>
      )}

      <Button
        onClick={onViewApplications}
        className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
        aria-label="View my applications"
      >
        View My Applications
      </Button>
    </div>
  );
}