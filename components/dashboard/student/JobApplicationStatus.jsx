/**
 * JobApplicationStatus Component
 * 
 * Shows application status indicators with appropriate messaging.
 * Displays visual feedback for application state (applied/deadline passed).
 */

import { CheckCircleIcon, XCircleIcon } from "../../icons/StatusIcons.jsx";

const JobApplicationStatus = ({ hasApplied, deadlinePassed }) => {
  if (hasApplied) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 flex items-center">
        <CheckCircleIcon className="w-6 h-6 mr-3 text-green-600" />
        <div>
          <p className="font-semibold text-green-800">Application Submitted</p>
          <p className="text-sm text-green-700">
            You have already applied for this position.
          </p>
        </div>
      </div>
    );
  }
  
  if (deadlinePassed) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-center">
        <XCircleIcon className="w-6 h-6 mr-3 text-red-600" />
        <div>
          <p className="font-semibold text-red-800">Applications Closed</p>
          <p className="text-sm text-red-700">
            The deadline for this job has passed.
          </p>
        </div>
      </div>
    );
  }
  
  return null;
};

export default JobApplicationStatus;