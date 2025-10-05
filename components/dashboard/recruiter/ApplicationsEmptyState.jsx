/**
 * ApplicationsEmptyState Component
 * 
 * Displays empty state when no applications match the current filters.
 * Provides appropriate messaging for different filter states.
 */

const ApplicationsEmptyState = () => {
  return (
    <div className="text-center py-16 bg-white rounded-xl border">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No Applications Found
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        No applications match the current filters.
      </p>
    </div>
  );
};

export default ApplicationsEmptyState;