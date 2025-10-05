/**
 * ApplicationActionButtons Component
 * 
 * Displays dynamic action buttons based on application status.
 * Maintains existing button styling and icons for status updates.
 */

import { CheckIcon, XIcon, UserAddIcon } from "../../icons/ActionIcons.jsx";
import { CalendarIcon } from "../../icons/DashboardIcons.jsx";

const Button = ({ onClick, className, children, ...props }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-transform duration-200 hover:scale-105 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const ApplicationActionButtons = ({ application, onStatusUpdate }) => {
  const actionsMap = {
    APPLIED: [
      {
        label: "Shortlist",
        status: "SHORTLISTED",
        color: "bg-yellow-500 hover:bg-yellow-600",
        icon: <CheckIcon className="w-4 h-4 mr-1" />,
      },
      {
        label: "Reject",
        status: "REJECTED",
        color: "bg-red-500 hover:bg-red-600",
        icon: <XIcon className="w-4 h-4 mr-1" />,
      },
    ],
    SHORTLISTED: [
      {
        label: "Schedule Interview",
        status: "INTERVIEW_SCHEDULED",
        color: "bg-purple-500 hover:bg-purple-600",
        icon: <CalendarIcon className="w-4 h-4 mr-1" />,
      },
      {
        label: "Reject",
        status: "REJECTED",
        color: "bg-red-500 hover:bg-red-600",
        icon: <XIcon className="w-4 h-4 mr-1" />,
      },
    ],
    INTERVIEW_SCHEDULED: [
      {
        label: "Hire",
        status: "HIRED",
        color: "bg-green-500 hover:bg-green-600",
        icon: <UserAddIcon className="w-4 h-4 mr-1" />,
      },
      {
        label: "Reject",
        status: "REJECTED",
        color: "bg-red-500 hover:bg-red-600",
        icon: <XIcon className="w-4 h-4 mr-1" />,
      },
    ],
  };

  const availableActions = actionsMap[application.applicationStatus] || [];

  return (
    <div className="flex gap-2 flex-wrap items-center mt-4 pt-4 border-t">
      {availableActions.map((action) => (
        <Button
          key={action.status}
          onClick={() => onStatusUpdate(application.id, action.status)}
          className={action.color}
        >
          {action.icon} {action.label}
        </Button>
      ))}
    </div>
  );
};

export default ApplicationActionButtons;