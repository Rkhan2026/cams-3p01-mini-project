/**
 * Reusable Card component with hover effects and padding options
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Whether to show hover effects
 * @param {string} props.padding - Padding size (sm, md, lg)
 */
export function Card({ 
  className = "", 
  hover = false, 
  padding = "md", 
  children,
  ...props 
}) {
  const paddingClasses = {
    sm: "p-4",
    md: "p-6", 
    lg: "p-8"
  };

  const baseClasses = "bg-white border border-gray-200 rounded-xl shadow-sm";
  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1 transition-all duration-300" : "";
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", ...props }) {
  return <div className={`pb-4 border-b border-gray-100 ${className}`} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={`pt-4 space-y-2 ${className}`} {...props} />;
}


