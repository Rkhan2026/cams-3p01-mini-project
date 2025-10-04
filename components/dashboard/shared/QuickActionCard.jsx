import { AnimatedArrowRight } from '../../icons';

/**
 * Quick action card component for dashboard navigation
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {function} props.onClick - Click handler
 * @param {string} props.color - Color theme (blue, green, purple, gray)
 * @param {string} props.className - Additional CSS classes
 */
export default function QuickActionCard({ 
  title, 
  description, 
  icon, 
  onClick, 
  color = "blue",
  className = "",
  ...props 
}) {
  const colorSchemes = {
    blue: "bg-gradient-to-br from-blue-500 to-blue-600",
    green: "bg-gradient-to-br from-green-500 to-green-600", 
    purple: "bg-gradient-to-br from-purple-500 to-purple-600",
    gray: "bg-gradient-to-br from-gray-500 to-gray-600"
  };

  return (
    <div
      onClick={onClick}
      className={`group ${colorSchemes[color]} rounded-2xl p-6 text-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform ${className}`}
      {...props}
    >
      <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90 mb-4">{description}</p>
      
      <div className="flex items-center font-semibold">
        Proceed
        <AnimatedArrowRight />
      </div>
    </div>
  );
}