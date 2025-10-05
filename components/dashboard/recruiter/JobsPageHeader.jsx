import Button from '../../ui/Button.jsx';
import { PlusIcon } from '../../icons';

/**
 * Jobs page header component for recruiter jobs page
 * @param {Object} props - Component props
 * @param {function} props.onNewJobClick - Handler for create new job action
 * @param {string} props.className - Additional CSS classes
 */
export default function JobsPageHeader({ onNewJobClick, className = "", ...props }) {
  return (
    <div className={`flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4 ${className}`} {...props}>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Job Postings</h1>
        <p className="text-gray-500 mt-1">
          Manage, view, and create new job opportunities.
        </p>
      </div>
      <Button onClick={onNewJobClick}>
        <PlusIcon className="w-5 h-5" />
        Create New Job
      </Button>
    </div>
  );
}