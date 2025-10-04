/**
 * Reusable dashboard header component with gradient backgrounds
 * @param {Object} props - Component props
 * @param {string} props.title - Main header title
 * @param {string} props.subtitle - Header subtitle/description
 * @param {string} props.gradient - Gradient color scheme (blue, gray, purple)
 * @param {React.ReactNode} props.actions - Optional action buttons or elements
 * @param {string} props.className - Additional CSS classes
 */
export default function DashboardHeader({ 
  title, 
  subtitle, 
  gradient = "blue", 
  actions,
  className = "",
  ...props 
}) {
  const gradients = {
    blue: "from-blue-600 to-purple-600",
    gray: "from-gray-800 to-gray-900", 
    purple: "from-purple-600 to-indigo-600"
  };

  return (
    <div className={`bg-gradient-to-r ${gradients[gradient]} rounded-2xl p-8 text-white mb-8 shadow-lg ${className}`} {...props}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          {subtitle && (
            <p className="text-blue-100 text-lg opacity-90">{subtitle}</p>
          )}
        </div>
        {actions && (
          <div className="mt-4 sm:mt-0 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}