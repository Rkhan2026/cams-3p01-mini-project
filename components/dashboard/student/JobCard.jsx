/**
 * JobCard Component
 * 
 * Displays job information in card format with application status and deadline.
 * Handles job viewing navigation and shows company information and job package.
 */

import Button from "@/components/ui/Button";
import { MoneyIcon } from "../../icons/ActionIcons.jsx";

const JobCard = ({ job, hasApplied, onViewJob }) => {
  const getDeadlineStatus = (deadline) => {
    const diffDays = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 1)
      return {
        text: "Closes today",
        textColor: "text-red-600",
        bgColor: "bg-red-100",
      };
    if (diffDays <= 3)
      return {
        text: `${diffDays} days left`,
        textColor: "text-orange-500",
        bgColor: "bg-orange-100",
      };
    return {
      text: `${diffDays} days left`,
      textColor: "text-green-600",
      bgColor: "bg-green-100",
    };
  };

  const deadlineStatus = getDeadlineStatus(job.applicationDeadline);
  const titleMatch = job.jobDescription.match(/\(([^)]+)\)/);
  const displayTitle = titleMatch
    ? titleMatch[1]
    : "Job Title Not Specified";
  const displayDescription = job.jobDescription.replace(
    /\(([^)]+)\)\s*\n*/,
    ""
  );

  return (
    <div className="bg-white border rounded-2xl p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              {displayTitle}
            </h3>
            <p className="text-sm font-medium text-gray-600">
              {job.recruiter.companyProfile || job.recruiter.name}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {hasApplied && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                Already Applied
              </span>
            )}
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deadlineStatus.bgColor} ${deadlineStatus.textColor}`}
            >
              {deadlineStatus.text}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-3 mt-4">
          {displayDescription}
        </p>
        <div className="border-t mt-4 pt-4 space-y-3">
          {job.package && (
            <div className="flex items-center gap-2">
              <MoneyIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                {job.package}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <Button
          onClick={() => onViewJob(job.id)}
          className={`w-full ${hasApplied 
            ? 'bg-gray-400 hover:bg-gray-500' 
            : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={hasApplied}
        >
          {hasApplied ? 'Already Applied' : 'View & Apply'}
        </Button>
      </div>
    </div>
  );
};

export default JobCard;