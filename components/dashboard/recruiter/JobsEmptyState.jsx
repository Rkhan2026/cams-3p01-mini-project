import Button from '../../ui/Button.jsx';
import { PlusIcon } from '../../icons';

/**
 * Empty state component for recruiter jobs page
 * @param {Object} props - Component props
 * @param {function} props.onNewJobClick - Handler for create new job action
 * @param {string} props.className - Additional CSS classes
 */
export default function JobsEmptyState({ onNewJobClick, className = "", ...props }) {
  return (
    <div className={`text-center py-16 px-6 bg-white border-2 border-dashed rounded-xl ${className}`} {...props}>
      <h3 className="text-xl font-semibold text-gray-800">No Jobs Found</h3>
      <p className="text-gray-500 mt-2 mb-6">
        It looks like you have not posted any jobs yet. Get started now!
      </p>
      <Button onClick={onNewJobClick}>
        <PlusIcon className="w-5 h-5" />
        Create Your First Job
      </Button>
    </div>
  );
}