/**
 * Badge component for status indicators
 * @param {Object} props - Component props
 * @param {string} props.status - Badge status (pending, approved, rejected, success, warning, info)
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.size - Badge size (sm, md)
 * @param {string} props.className - Additional CSS classes
 */
export default function Badge({ 
  status = "info", 
  size = "md", 
  children, 
  className = "",
  ...props 
}) {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    approved: "bg-green-100 text-green-800 border-green-200", 
    rejected: "bg-red-100 text-red-800 border-red-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  };

  const baseClasses = "inline-flex items-center rounded-full font-semibold border";
  const badgeClasses = `${baseClasses} ${statusStyles[status] || statusStyles.info} ${sizes[size]} ${className}`;

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
}