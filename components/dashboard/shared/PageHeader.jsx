import { ArrowLeftIcon } from '../../icons';

/**
 * Page header component with back button and title
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle/description
 * @param {function} props.onBack - Back button click handler
 * @param {string} props.backText - Custom back button text
 * @param {React.ReactNode} props.actions - Optional action buttons
 * @param {string} props.className - Additional CSS classes
 */
export default function PageHeader({ 
  title, 
  subtitle, 
  onBack, 
  backText = "Back to Dashboard",
  actions,
  className = "",
  ...props 
}) {
  return (
    <div className={className} {...props}>
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          {backText}
        </button>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {subtitle && (
            <p className="text-gray-500 mt-1">{subtitle}</p>
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