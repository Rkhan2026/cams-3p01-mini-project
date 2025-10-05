/**
 * JobApprovalFilters Component
 * 
 * Provides tab-based filtering with count badges for job approval status.
 * Maintains existing border and hover styling for filter tabs.
 */

const JobApprovalFilters = ({ counts, activeFilter, onFilterChange }) => {
  const filters = ["PENDING", "APPROVED", "REJECTED"];
  
  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      {filters.map((status) => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeFilter === status
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {status.charAt(0) + status.slice(1).toLowerCase()}
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {counts[status] || 0}
          </span>
        </button>
      ))}
    </div>
  );
};

export default JobApprovalFilters;