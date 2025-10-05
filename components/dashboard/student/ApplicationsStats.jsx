import StatisticCard from '../shared/StatisticCard.jsx';

/**
 * Applications statistics component for student applications page
 * @param {Object} props - Component props
 * @param {Object} props.stats - Statistics object with application counts
 * @param {string} props.className - Additional CSS classes
 */
export default function ApplicationsStats({ stats, className = "", ...props }) {
  const statisticCards = [
    {
      icon: "📁",
      label: "Total",
      value: stats.TOTAL,
      color: "border-gray-500"
    },
    {
      icon: "📝",
      label: "Applied",
      value: stats.APPLIED,
      color: "border-blue-500"
    },
    {
      icon: "⭐",
      label: "Shortlisted",
      value: stats.SHORTLISTED,
      color: "border-yellow-500"
    },
    {
      icon: "📅",
      label: "Interviews",
      value: stats.INTERVIEW_SCHEDULED,
      color: "border-purple-500"
    },
    {
      icon: "🎉",
      label: "Hired",
      value: stats.HIRED,
      color: "border-green-500"
    },
    {
      icon: "❌",
      label: "Rejected",
      value: stats.REJECTED,
      color: "border-red-500"
    }
  ];

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 ${className}`} {...props}>
      {statisticCards.map((card, index) => (
        <StatisticCard key={index} {...card} />
      ))}
    </div>
  );
}