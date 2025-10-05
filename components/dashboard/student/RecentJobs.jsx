import EmptyState from "../../ui/EmptyState.jsx";

/**
 * Recent jobs component for student dashboard
 * @param {Object} props - Component props
 * @param {Array} props.jobs - Array of job objects
 * @param {Array} props.appliedJobIds - Array of job IDs the student has applied to
 * @param {function} props.onNavigate - Navigation handler function
 * @param {string} props.className - Additional CSS classes
 */
export default function RecentJobs({
  jobs,
  appliedJobIds = [],
  onNavigate,
  className = "",
  ...props
}) {
  const getDaysUntilDeadline = (deadline) =>
    Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));

  // Extract job title from parentheses in description
  const extractJobTitle = (description) => {
    const match = description.match(/\(([^)]+)\)/);
    return match ? match[1] : "Position";
  };

  // Get description without parentheses content
  const getCleanDescription = (description) => {
    return description.replace(/\s*\([^)]*\)\s*/g, "").trim();
  };

  // Filter out jobs that have been applied to
  const unappliedJobs = jobs.filter((job) => !appliedJobIds.includes(job.id));

  return (
    <div
      className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm ${className}`}
      {...props}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Recent Opportunities
        </h2>
        <button
          onClick={() => onNavigate("/student/jobs")}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
        </button>
      </div>

      {unappliedJobs.length === 0 ? (
        <EmptyState
          title="No Jobs Available"
          message="New opportunities will appear here."
          buttonText="Browse All Jobs"
          onButtonClick={() => onNavigate("/student/jobs")}
        />
      ) : (
        <div className="space-y-4">
          {unappliedJobs.map((job) => {
            const daysLeft = getDaysUntilDeadline(job.applicationDeadline);
            const jobTitle = extractJobTitle(job.jobDescription);
            const cleanDescription = getCleanDescription(job.jobDescription);

            return (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{jobTitle}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {job.recruiter.companyProfile || job.recruiter.name}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        daysLeft <= 3
                          ? "text-red-700 bg-red-100"
                          : "text-green-700 bg-green-100"
                      }`}
                    >
                      {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {cleanDescription}
                </p>
                <button
                  onClick={() => onNavigate(`/student/jobs/${job.id}`)}
                  className="text-sm font-semibold text-blue-600 hover:underline transition-colors"
                >
                  View & Apply
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
