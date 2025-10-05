/**
 * JobsPageSkeleton Component
 * 
 * Displays skeleton loading component for TPO jobs page.
 * Implements consistent loading animation and layout structure.
 */

const JobsPageSkeleton = () => {
  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen animate-pulse">
      <div className="mb-8">
        <div className="h-10 w-48 bg-gray-300 rounded-lg mb-4"></div>
        <div className="h-9 w-64 bg-gray-300 rounded mb-2"></div>
        <div className="h-5 w-96 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <div className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
      </div>
      <div className="space-y-6">
        <div className="bg-gray-200 rounded-xl h-64"></div>
        <div className="bg-gray-200 rounded-xl h-64"></div>
      </div>
    </div>
  );
};

export default JobsPageSkeleton;