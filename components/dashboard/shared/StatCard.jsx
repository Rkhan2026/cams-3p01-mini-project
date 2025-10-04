/**
 * Reusable statistics card component for dashboards
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string|number} props.value - Statistical value to display
 * @param {string} props.label - Label for the statistic
 * @param {string} props.color - Color theme (blue, green, yellow, purple, red, gray)
 * @param {Object} props.trend - Optional trend data with value and direction
 * @param {string} props.className - Additional CSS classes
 */
export default function StatCard({ 
  icon, 
  value, 
  label, 
  color = "blue", 
  trend,
  className = "",
  ...props 
}) {
  const colorSchemes = {
    blue: {
      cardBg: "bg-blue-50 border-blue-200",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      valueColor: "text-blue-800",
      labelColor: "text-blue-600"
    },
    green: {
      cardBg: "bg-green-50 border-green-200", 
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      valueColor: "text-green-800",
      labelColor: "text-green-600"
    },
    yellow: {
      cardBg: "bg-yellow-50 border-yellow-200",
      iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-500", 
      valueColor: "text-yellow-800",
      labelColor: "text-yellow-600"
    },
    purple: {
      cardBg: "bg-purple-50 border-purple-200",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      valueColor: "text-purple-800", 
      labelColor: "text-purple-600"
    },
    red: {
      cardBg: "bg-red-50 border-red-200",
      iconBg: "bg-gradient-to-br from-red-500 to-red-600",
      valueColor: "text-red-800",
      labelColor: "text-red-600"
    },
    gray: {
      cardBg: "bg-white border-gray-100",
      iconBg: "bg-gradient-to-br from-gray-500 to-gray-600", 
      valueColor: "text-gray-900",
      labelColor: "text-gray-500"
    }
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div className={`${scheme.cardBg} rounded-2xl p-6 shadow-md border hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${className}`} {...props}>
      <div className={`w-12 h-12 ${scheme.iconBg} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className={`text-3xl font-bold ${scheme.valueColor} mb-1`}>
            {value}
          </div>
          <div className={`text-sm font-medium ${scheme.labelColor}`}>
            {label}
          </div>
        </div>
        
        {trend && (
          <div className={`text-xs font-semibold ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend.direction === 'up' ? '↗' : '↘'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
    </div>
  );
}