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
  // new props
  isEligible = true,
  eligibilityReason = "",
  showViewApplications = true,
}) {
  return (
    <div className="border-t pt-6 flex items-center gap-4">
      {!hasApplied && !deadlinePassed && (
        <div className="flex flex-col">
          <Button
            onClick={onApply}
            disabled={applying || !isEligible}
            className={`min-w-[180px] ${
              isEligible
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            aria-label={
              applying ? "Submitting application" : "Apply for this job"
            }
          >
            {applying ? "Submitting..." : "Apply for this Job"}
          </Button>
          {!isEligible && (
            <div className="text-sm text-gray-600 mt-2">
              {eligibilityReason ||
                "You do not meet the eligibility criteria for this role."}
            </div>
          )}
        </div>
      )}

      {showViewApplications && (
        <Button
          onClick={onViewApplications}
          className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
          aria-label="View my applications"
        >
          View My Applications
        </Button>
      )}
    </div>
  );
}
