/**
 * Loading spinner component for loading states
 * @param {Object} props - Component props
 * @param {string} props.size - Spinner size (sm, md, lg)
 * @param {string} props.color - Spinner color (blue, gray, white)
 * @param {string} props.className - Additional CSS classes
 */
export default function LoadingSpinner({ 
  size = "md", 
  color = "blue", 
  className = "",
  ...props 
}) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-16 w-16"
  };

  const colors = {
    blue: "border-blue-500",
    gray: "border-gray-500",
    white: "border-white"
  };

  const spinnerClasses = `animate-spin rounded-full border-2 border-t-transparent ${sizes[size]} ${colors[color]} ${className}`;

  return (
    <div className="flex justify-center items-center">
      <div className={spinnerClasses} {...props}></div>
    </div>
  );
}

/**
 * Full page loading spinner with optional text
 * @param {Object} props - Component props
 * @param {string} props.text - Loading text to display
 * @param {string} props.className - Additional CSS classes
 */
export function FullPageSpinner({ text = "Loading...", className = "" }) {
  return (
    <div className={`flex flex-col justify-center items-center h-64 ${className}`}>
      <LoadingSpinner size="lg" />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  );
}