import StatCard from '../shared/StatCard.jsx';
import { 
  BriefcaseIcon, 
  DocumentTextIcon, 
  ClockIcon, 
  StarIcon, 
  CalendarIcon, 
  CheckCircleIcon 
} from '../../icons';

/**
 * Student dashboard statistics component
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 * @param {string} props.className - Additional CSS classes
 */
export default function StudentStats({ stats, className = "", ...props }) {
  const statCards = [
    {
      icon: <BriefcaseIcon className="w-6 h-6 text-white" />,
      value: stats.totalJobs,
      label: "Available Jobs",
      color: "gray"
    },
    {
      icon: <DocumentTextIcon className="w-6 h-6 text-white" />,
      value: stats.myApplications,
      label: "Applications", 
      color: "gray"
    },
    {
      icon: <ClockIcon className="w-6 h-6 text-white" />,
      value: stats.pendingApplications,
      label: "Pending",
      color: "blue"
    },
    {
      icon: <StarIcon className="w-6 h-6 text-white" />,
      value: stats.shortlisted,
      label: "Shortlisted",
      color: "yellow"
    },
    {
      icon: <CalendarIcon className="w-6 h-6 text-white" />,
      value: stats.interviews,
      label: "Interviews",
      color: "purple"
    },
    {
      icon: <CheckCircleIcon className="w-6 h-6 text-white" />,
      value: stats.hired,
      label: "Hired",
      color: "green"
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8 ${className}`} {...props}>
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}