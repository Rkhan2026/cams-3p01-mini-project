import StatCard from "../shared/StatCard.jsx";
import {
  AcademicCapIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  TrophyIcon,
} from "../../ui/Icons.js";

/**
 * TPO dashboard statistics component
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics data object
 * @param {string} props.className - Additional CSS classes
 */
export default function TPOStats({ stats, className = "", ...props }) {
  const statCards = [
    {
      icon: <AcademicCapIcon className="w-8 h-8 text-white" />,
      value: stats.pendingStudents,
      label: "Pending Students",
      color: "blue",
    },
    {
      icon: <BuildingOfficeIcon className="w-8 h-8 text-white" />,
      value: stats.pendingRecruiters,
      label: "Pending Recruiters",
      color: "green",
    },
    {
      icon: <ClipboardDocumentListIcon className="w-8 h-8 text-white" />,
      value: stats.pendingJobs,
      label: "Pending Jobs",
      color: "yellow",
    },
    {
      icon: <TrophyIcon className="w-8 h-8 text-white" />,
      value: stats.hiredStudents,
      label: "Students Hired",
      color: "purple",
    },
  ];

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 ${className}`}
      {...props}
    >
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
}
