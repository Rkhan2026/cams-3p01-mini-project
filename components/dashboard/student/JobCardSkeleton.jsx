/**
 * JobCardSkeleton Component
 * 
 * Displays a loading skeleton for job cards while data is being fetched.
 * Maintains consistent card dimensions and provides smooth loading experience.
 */

const JobCardSkeleton = ({ count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div key={index} className="bg-white border rounded-2xl p-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
        <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
      </div>
      <div className="w-1/2 h-4 mt-2 bg-gray-200 rounded"></div>
      <div className="mt-4 space-y-2">
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-full h-4 bg-gray-200 rounded"></div>
        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-6 w-full h-10 bg-gray-200 rounded-lg"></div>
    </div>
  ));

  return count === 1 ? skeletons[0] : skeletons;
};

export default JobCardSkeleton;