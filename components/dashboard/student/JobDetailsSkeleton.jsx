/**
 * JobDetailsSkeleton Component
 * 
 * Displays skeleton loading component for job details page.
 * Maintains consistent layout and animation during data loading.
 */

const JobDetailsSkeleton = () => {
  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen animate-pulse">
      <div className="max-w-4xl mx-auto">
        <div className="h-8 w-40 bg-gray-300 rounded-lg mb-8"></div>
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="h-10 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded mb-8"></div>
          <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2 mb-8">
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsSkeleton;