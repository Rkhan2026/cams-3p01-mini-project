/**
 * JobsSearchBar Component
 * 
 * Provides search functionality for job listings using the shared SearchBar component.
 * Handles search input and manages search state.
 */

import SearchBar from "../../ui/SearchBar.jsx";

const JobsSearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Search by company, role..." 
}) => {
  return (
    <SearchBar
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      placeholder={placeholder}
    />
  );
};

export default JobsSearchBar;