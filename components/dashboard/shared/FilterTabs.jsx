/**
 * Filter tabs component for filtering data by status
 * @param {Object} props - Component props
 * @param {Array} props.filters - Array of filter objects with key, label, and count
 * @param {string} props.activeFilter - Currently active filter key
 * @param {function} props.onFilterChange - Handler for filter changes
 * @param {string} props.className - Additional CSS classes
 */
export default function FilterTabs({ 
  filters, 
  activeFilter, 
  onFilterChange, 
  className = "",
  ...props 
}) {
  return (
    <div className={`flex gap-2 mb-6 pb-2 overflow-x-auto ${className}`} {...props}>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
            activeFilter === filter.key
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.label}
          <span
            className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
              activeFilter === filter.key 
                ? "bg-indigo-400 text-white" 
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {filter.count}
          </span>
        </button>
      ))}
    </div>
  );
}