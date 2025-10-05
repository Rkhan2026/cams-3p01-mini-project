/**
 * SearchBar Component
 * 
 * Reusable search bar component with search icon and consistent styling.
 * Supports searchTerm, onSearchChange, and placeholder props.
 */

import { SearchIcon } from "../icons/DashboardIcons.jsx";

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search...",
  className = "w-full md:w-80 mb-8"
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 py-2.5 rounded-xl text-gray-900 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      />
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default SearchBar;