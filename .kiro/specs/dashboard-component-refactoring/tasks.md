# Implementation Plan

- [x] 1. Create foundational UI components


  - Create reusable Button component with variants (primary, secondary, tertiary, ghost)
  - Create Card component with hover effects and padding options
  - Create Badge component for status indicators
  - Create LoadingSpinner component for loading states
  - Create EmptyState component for empty data scenarios
  - _Requirements: 1.1, 1.2, 1.3, 5.1, 5.2, 5.3_



- [ ] 2. Create centralized icon library
  - Extract all SVG icons from dashboard pages into organized icon components
  - Create ArrowIcons component (ArrowLeft, ArrowRight, etc.)
  - Create StatusIcons component (CheckCircle, XCircle, Clock, Star, etc.)
  - Create DashboardIcons component (Briefcase, Users, DocumentText, Calendar, etc.)


  - Ensure consistent sizing and styling across all icons
  - _Requirements: 1.1, 1.2, 5.1, 5.3_

- [ ] 3. Create shared dashboard components
  - Create DashboardHeader component with gradient options and action slots
  - Create StatCard component with icon, value, label, and color variants



  - Create QuickActionCard component with hover animations and click handlers
  - Create PageHeader component with back button and title/subtitle
  - Ensure all components support responsive design
  - _Requirements: 1.1, 1.2, 1.3, 4.2, 5.1, 5.2_



- [ ] 4. Extract student dashboard specific components
  - Create StudentStats component from DashboardStats section
  - Create RecentJobs component with job listing and navigation
  - Create RecentApplications component with application status display
  - Create ApplicationCard component for individual application display
  - Create Notifications component for student-specific alerts


  - _Requirements: 2.1, 2.2, 3.1, 3.3, 4.1, 4.2_

- [ ] 5. Extract recruiter dashboard specific components
  - Create RecruiterStats component from stats section
  - Create JobCard component for job posting display
  - Create RecentJobsList component with job management actions


  - Create RecentApplicationsList component for application review
  - Create Alerts component for recruiter notifications
  - _Requirements: 2.1, 2.2, 3.1, 3.3, 4.1, 4.2_

- [x] 6. Extract TPO dashboard specific components




  - Create TPOStats component from statistics section
  - Create PendingRegistrationsList component for user approvals
  - Create PendingJobsList component for job approvals


  - Create SystemAlerts component for TPO notifications

  - Ensure approval action handlers are properly integrated
  - _Requirements: 2.1, 2.2, 3.1, 3.3, 4.1, 4.2_

- [ ] 7. Refactor main student dashboard page
  - Replace inline components with extracted components in student/page.js
  - Maintain all existing state management and data fetching logic
  - Ensure skeleton loading states work with new component structure
  - Verify all navigation and interaction functionality is preserved
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 5.3_

- [ ] 8. Refactor main recruiter dashboard page
  - Replace inline components with extracted components in recruiter/page.js
  - Maintain all existing API calls and state management
  - Ensure skeleton loading components work correctly
  - Verify all button actions and navigation remain functional
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 5.3_

- [ ] 9. Refactor main TPO dashboard page
  - Replace inline components with extracted components in tpo/page.js
  - Maintain all approval functionality and API integration
  - Ensure loading states and error handling work correctly
  - Verify all user approval and job approval actions function properly
  - _Requirements: 2.1, 2.2, 2.3, 4.1, 4.2, 5.3_

- [ ] 10. Refactor student applications page
  - Extract ApplicationCard component from the existing inline implementation
  - Create FilterTabs component for application status filtering
  - Create StatisticCard component for application statistics
  - Split the long page into logical component sections
  - Maintain all filtering, navigation, and withdrawal functionality
  - _Requirements: 2.1, 2.2, 3.1, 3.3, 4.1, 4.2_

- [ ] 11. Refactor recruiter jobs page
  - Extract JobCard component with status badges and action buttons
  - Create JobsPageHeader component with create job action
  - Create EmptyState component for no jobs scenario
  - Maintain all job management and navigation functionality
  - Ensure responsive design is preserved
  - _Requirements: 2.1, 2.2, 3.1, 3.3, 4.1, 4.2_

- [ ] 12. Refactor TPO approvals page
  - Extract StudentCard and RecruiterCard components for user display
  - Create FilterTabs component for approval status filtering
  - Create ApprovalListSection component for reusable list display
  - Maintain all approval functionality and API integration
  - Ensure proper error handling and loading states
  - _Requirements: 2.1, 2.2, 3.1, 3.3, 4.1, 4.2_

- [ ] 13. Add component documentation and prop validation
  - Add JSDoc comments to all extracted components describing purpose and usage
  - Document prop interfaces and provide usage examples
  - Add PropTypes or TypeScript interfaces for better development experience
  - Create component usage guidelines for consistent implementation
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [ ] 14. Verify accessibility and responsive design
  - Test all extracted components for keyboard navigation support
  - Verify ARIA attributes are preserved in refactored components
  - Test responsive behavior across different screen sizes
  - Ensure focus management works correctly in component interactions
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 15. Create component unit tests
  - Write unit tests for all basic UI components (Button, Card, Badge, etc.)
  - Test component prop variations and styling
  - Verify accessibility attributes in component tests
  - Test interaction handlers and event propagation
  - _Requirements: 1.1, 1.2, 4.1, 6.1_

- [ ]* 16. Create integration tests for dashboard components
  - Test data flow between parent pages and extracted components
  - Verify component composition works correctly
  - Test responsive behavior and layout changes
  - Ensure state management integration works properly
  - _Requirements: 2.1, 2.2, 4.2, 5.1_