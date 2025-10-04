/**
 * Reusable Button component with multiple variants and sizes
 * @param {Object} props - Component props
 * @param {string} props.variant - Button style variant (primary, secondary, tertiary, ghost)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 */
export default function Button({
  as: Tag = "button",
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
  ...props
}) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    tertiary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const buttonClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`;

  return (
    <Tag
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </Tag>
  );
}


