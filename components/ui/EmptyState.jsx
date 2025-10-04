/**
 * Empty state component for when there's no data to display
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.title - Main title text
 * @param {string} props.message - Description message
 * @param {string} props.buttonText - Action button text
 * @param {function} props.onButtonClick - Button click handler
 * @param {string} props.className - Additional CSS classes
 */
export default function EmptyState({ 
  icon,
  title, 
  message, 
  buttonText, 
  onButtonClick,
  className = "",
  ...props 
}) {
  const defaultIcon = (
    <svg
      className="w-12 h-12 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );

  return (
    <div className={`text-center py-12 px-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 ${className}`} {...props}>
      <div className="mx-auto mb-4">
        {icon || defaultIcon}
      </div>
      
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      )}
      
      {message && (
        <p className="text-gray-500 mb-6">{message}</p>
      )}
      
      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}