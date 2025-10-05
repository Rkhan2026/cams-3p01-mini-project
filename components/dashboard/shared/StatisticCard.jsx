/**
 * Statistic card component for displaying key metrics
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon or emoji to display
 * @param {string} props.label - Label for the statistic
 * @param {string|number} props.value - Statistical value to display
 * @param {string} props.color - Border color class (e.g., "border-blue-500")
 * @param {string} props.className - Additional CSS classes
 */
export default function StatisticCard({ 
  icon, 
  label, 
  value, 
  color = "border-gray-500", 
  className = "",
  ...props 
}) {
  return (
    <div
      className={`bg-white border-l-4 ${color} rounded-lg p-4 shadow-sm flex items-center space-x-4 ${className}`}
      {...props}
    >
      <div className="text-2xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}