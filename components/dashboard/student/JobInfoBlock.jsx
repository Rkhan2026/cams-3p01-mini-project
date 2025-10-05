/**
 * JobInfoBlock Component
 * 
 * Displays structured job information sections with consistent formatting.
 * Provides proper spacing and typography for job details content.
 */

const JobInfoBlock = ({ title, children }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
        {title}
      </h3>
      <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
};

export default JobInfoBlock;