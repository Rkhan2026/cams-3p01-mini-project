/**
 * JobsEmptyState Component
 * 
 * Displays empty state when no jobs match the current filter.
 * Shows appropriate messaging based on the active filter status.
 */

const JobsEmptyState = ({ activeFilter }) => {
  return (
    <div className="text-center py-16 bg-white border border-dashed rounded-xl">
      <p className="text-gray-500">
        No {activeFilter.toLowerCase()} job postings found.
      </p>
    </div>
  );
};

export default JobsEmptyState;