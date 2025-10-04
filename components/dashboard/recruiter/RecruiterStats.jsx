import StatCard from '../shared/StatCard.jsx';
import { BriefcaseIcon, UsersIcon } from '../../icons';

/**
 * Recruiter dashboard statistics component
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 * @param {string} props.className - Additional CSS classes
 */
export default function RecruiterStats({ stats, className = "", ...props }) {
  const statCards = [
    {
      icon: <BriefcaseIcon className="w-8 h-8 text-white" />,
      value: stats.totalJobs,
      label: "Total Jobs Posted",
      color: "blue"
    },
    {
      icon: <UsersIcon className="w-8 h-8 text-white" />,
      value: stats.totalApplications,
      label: "Total Applications",
      color: "green"
    },
    {
      icon: <BriefcaseIcon className="w-8 h-8 text-white" />,
      value: stats.pendingJobs,
      label: "Pending Approval",
      color: "yellow"
    },
    {
      icon: <UsersIcon className="w-8 h-8 text-white" />,
      value: stats.newApplications,
      label: "New Applications",
      color: "purple"
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${className}`} {...props}>
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}