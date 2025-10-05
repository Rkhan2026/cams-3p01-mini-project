/**
 * JobDeadlineInfo Component
 * 
 * Displays job application deadline with countdown and visual indicators.
 * Shows time remaining and urgency through color-coded badges.
 */

import { CalendarIcon } from "../../icons/DashboardIcons.jsx";

const JobDeadlineInfo = ({ deadline }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getDaysUntilDeadline = (deadline) => {
    const diffTime = new Date(deadline) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const deadlinePassed = new Date(deadline) <= new Date();
  const daysLeft = getDaysUntilDeadline(deadline);

  return (
    <div className="border-t border-b border-gray-200 py-4 mb-8">
      <div className="flex items-center text-base">
        <CalendarIcon className="w-5 h-5 mr-2 text-gray-500" />
        <strong className="text-gray-700">Deadline:</strong>
        <span className="ml-2 font-medium text-gray-900">
          {formatDate(deadline)}
        </span>
        {!deadlinePassed && (
          <span
            className={`ml-4 font-semibold text-sm px-3 py-1 rounded-full ${
              daysLeft <= 3
                ? "bg-red-100 text-red-700"
                : daysLeft <= 7
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {daysLeft <= 1 ? "Ends Today!" : `${daysLeft} days left`}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobDeadlineInfo;