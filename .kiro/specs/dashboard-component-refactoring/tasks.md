# Implementation Plan

- [ ] 1. Set up component structure and extract Student Jobs page components
  - Create directory structure for new components following existing patterns
  - Extract JobCard component with proper props interface and styling
  - Extract JobCardSkeleton component for loading states
  - Extract JobsSearchBar component with search functionality
  - Extract JobsEmptyState component with conditional messaging
  - Update Student Jobs page to use extracted components
  - _Requirements: 1.1, 2.2, 3.1, 3.6_

- [ ] 2. Extract Student Job Details page components
  - [ ] 2.1 Create JobDetailsHeader component
    - Extract PageHeader component with back navigation and title display
    - Implement proper prop interface with title, subtitle, onBack, and buttonText
    - Maintain existing styling and hover states
    - _Requirements: 1.2, 2.3, 3.1, 3.6_

  - [ ] 2.2 Create JobInfoBlock component
    - Extract InfoBlock component for structured job information display
    - Implement title and children props for flexible content
    - Maintain consistent formatting and spacing
    - _Requirements: 1.2, 2.3, 3.1, 3.6_

  - [ ] 2.3 Create JobApplicationStatus component
    - Extract ApplicationStatus component with hasApplied and deadlinePassed props
    - Implement conditional rendering for different status states
    - Maintain existing icon usage and styling
    - _Requirements: 1.2, 2.3, 3.1, 3.6_

  - [ ] 2.4 Create JobDetailsSkeleton component
    - Extract skeleton loading component for job details page
    - Maintain consistent layout and animation
    - _Requirements: 1.2, 2.3, 3.1, 3.6_

  - [ ] 2.5 Update Student Job Details page
    - Replace inline components with extracted components
    - Update imports and ensure all functionality is preserved
    - Test navigation and application submission
    - _Requirements: 2.3, 2.7, 2.9_

- [ ] 3. Extract Recruiter Applications page components
  - [ ] 3.1 Create ApplicationCard component
    - Extract ApplicationCard with application prop and onStatusUpdate callback
    - Implement student details display and academic records section
    - Include resume link and status badge functionality
    - Maintain existing grid layout and styling
    - _Requirements: 1.3, 2.4, 3.2, 3.6_

  - [ ] 3.2 Create ApplicationStatPill component
    - Extract StatPill component with label, value, color, isActive, and onClick props
    - Implement dynamic styling based on color and active state
    - Maintain hover effects and transitions
    - _Requirements: 1.3, 2.4, 3.2, 3.6_

  - [ ] 3.3 Create ApplicationStatsHeader component
    - Extract stats header with stats, activeFilter, onFilterChange, and onDownloadReport props
    - Implement grid layout for stat pills
    - Include page title and download functionality
    - _Requirements: 1.3, 2.4, 3.2, 3.6_

  - [ ] 3.4 Create ApplicationActionButtons component
    - Extract ActionButtons component with application and onStatusUpdate props
    - Implement dynamic action buttons based on application status
    - Maintain existing button styling and icons
    - _Requirements: 1.3, 2.4, 3.2, 3.6_

  - [ ] 3.5 Create ApplicationFilters component
    - Extract ApplicationFilters with jobs, selectedJob, and onJobChange props
    - Implement job dropdown filtering functionality
    - Maintain existing select styling
    - _Requirements: 1.3, 2.4, 3.2, 3.6_

  - [ ] 3.6 Update Recruiter Applications page
    - Replace inline components with extracted components
    - Update imports and maintain all existing functionality
    - Test filtering, status updates, and CSV download
    - _Requirements: 2.4, 2.7, 2.9_

- [ ] 4. Extract Recruiter New Job page components
  - [ ] 4.1 Create JobFormField component
    - Extract FormField component with id, label, helpText, required, and children props
    - Implement consistent form field styling and layout
    - Include required field indicators and help text display
    - _Requirements: 1.4, 2.5, 3.2, 3.6_

  - [ ] 4.2 Create TpoApprovalNote component
    - Extract approval note component with informational styling
    - Implement blue-themed notification design
    - Include appropriate icon and messaging
    - _Requirements: 1.4, 2.5, 3.2, 3.6_

  - [ ] 4.3 Create NewJobForm component
    - Extract form component with onSubmit and loading props
    - Implement form validation and submission logic
    - Maintain existing fieldset organization and styling
    - Include all form fields and validation
    - _Requirements: 1.4, 2.5, 3.2, 3.6_

  - [ ] 4.4 Update Recruiter New Job page
    - Replace inline components with extracted components
    - Update imports and ensure form submission works correctly
    - Test validation and error handling
    - _Requirements: 2.5, 2.7, 2.9_

- [ ] 5. Extract TPO Jobs Management page components
  - [ ] 5.1 Create JobApprovalCard component
    - Extract JobApprovalCard with job and onApprove props
    - Implement job details display with recruiter information
    - Include approval/rejection buttons for pending jobs
    - Maintain existing status styling and conditional rendering
    - _Requirements: 1.5, 2.6, 3.3, 3.6_

  - [ ] 5.2 Create JobApprovalFilters component
    - Extract FilterTabs component with counts, activeFilter, and onFilterChange props
    - Implement tab-based filtering with count badges
    - Maintain existing border and hover styling
    - _Requirements: 1.5, 2.6, 3.3, 3.6_

  - [ ] 5.3 Create JobsPageSkeleton component
    - Extract skeleton loading component for TPO jobs page
    - Implement consistent loading animation and layout
    - _Requirements: 1.5, 2.6, 3.3, 3.6_

  - [ ] 5.4 Update TPO Jobs Management page
    - Replace inline components with extracted components
    - Update imports and maintain approval functionality
    - Test job filtering and approval/rejection actions
    - _Requirements: 2.6, 2.7, 2.9_

- [ ] 6. Create shared UI components for reusability
  - [ ] 6.1 Create generic SearchBar component
    - Extract reusable SearchBar component in components/ui/
    - Implement searchTerm, onSearchChange, and placeholder props
    - Include search icon and consistent styling
    - _Requirements: 1.7, 3.5, 3.6_

  - [ ] 6.2 Create generic FormField component
    - Extract reusable FormField component in components/ui/
    - Implement flexible form field wrapper with label and help text
    - Support required field indicators
    - _Requirements: 1.7, 3.5, 3.6_

  - [ ] 6.3 Update components to use shared UI components
    - Replace duplicate SearchBar implementations with shared component
    - Replace duplicate FormField implementations with shared component
    - Update imports across all affected components
    - _Requirements: 1.8, 3.7_

- [ ] 7. Verify functionality and clean up
  - [ ] 7.1 Test all refactored pages
    - Verify Student Jobs page functionality (search, filtering, navigation)
    - Verify Student Job Details page functionality (application submission, navigation)
    - Verify Recruiter Applications page functionality (filtering, status updates, CSV download)
    - Verify Recruiter New Job page functionality (form submission, validation)
    - Verify TPO Jobs Management page functionality (filtering, approvals)
    - _Requirements: 2.7, 2.9, 4.1, 4.2, 4.3, 4.4_

  - [ ] 7.2 Ensure responsive design is maintained
    - Test all pages across different screen sizes
    - Verify mobile responsiveness is preserved
    - Check tablet and desktop layouts
    - _Requirements: 4.2, 5.2_

  - [ ] 7.3 Verify accessibility features
    - Test keyboard navigation on all refactored pages
    - Verify ARIA attributes are preserved
    - Check focus management and screen reader compatibility
    - _Requirements: 4.1, 4.3, 4.4_

  - [ ] 7.4 Performance optimization
    - Implement React.memo for stable components
    - Add useMemo for expensive calculations
    - Use useCallback for event handlers passed to children
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ]* 7.5 Write component documentation
    - Add JSDoc comments for all extracted components
    - Document prop interfaces and usage examples
    - Include component purpose and responsibilities
    - _Requirements: 6.1, 6.2, 6.4_