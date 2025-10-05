const Button = ({ onClick, className, children, ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function JobNotFoundState({ onBackToJobs }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <p className="text-gray-600 text-lg mb-4">Job not found or invalid.</p>
      <Button
        onClick={onBackToJobs}
        className="bg-blue-600 hover:bg-blue-700"
        aria-label="Go back to jobs list"
      >
        Back to Applications
      </Button>
    </div>
  );
}