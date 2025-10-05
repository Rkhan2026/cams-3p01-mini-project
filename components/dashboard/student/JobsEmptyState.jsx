/**
 * JobsEmptyState Component
 * 
 * Displays appropriate empty state message when no jobs are found.
 * Handles search clearing and shows relevant call-to-action.
 */

import Button from "@/components/ui/Button";
import { BriefcaseIcon } from "../../icons/DashboardIcons.jsx";

const JobsEmptyState = ({ searchTerm, onClearSearch }) => {
  return (
    <div className="text-center py-20 bg-white rounded-2xl border">
      <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h2 className="mt-4 text-xl font-semibold text-gray-900">
        {searchTerm
          ? "No jobs match your search"
          : "No jobs available right now"}
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        {searchTerm
          ? "Try adjusting your keywords or clearing the search."
          : "Please check back later for new opportunities."}
      </p>
      {searchTerm && (
        <Button onClick={onClearSearch} className="mt-6">
          Clear Search
        </Button>
      )}
    </div>
  );
};

export default JobsEmptyState;