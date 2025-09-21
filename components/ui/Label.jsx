export default function Label({ children, className = "", ...props }) {
  const defaultClasses = "text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300";
  
  return (
    <label {...props} className={className || defaultClasses}>
      {children}
    </label>
  );
}


