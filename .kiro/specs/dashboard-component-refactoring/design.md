# Design Document

## Overview

This design document outlines the technical approach for refactoring 5 specific dashboard pages that currently exceed 300 lines and contain multiple inline components. The refactoring will extract reusable components, improve code organization, and maintain all existing functionality while following established patterns from already well-refactored pages.

## Architecture

### Component Extraction Strategy

The refactoring follows a systematic approach:

1. **Identify Inline Components**: Extract components that are defined within the main page component
2. **Separate Concerns**: Move business logic into custom hooks where appropriate
3. **Create Reusable Components**: Extract components that can be used across multiple pages
4. **Maintain Existing Patterns**: Follow the component organization patterns already established in well-refactored pages

### Directory Structure

```
components/
├── dashboard/
│   ├── shared/           # Already exists - shared dashboard components
│   ├── student/          # Already exists - student-specific components
│   │   ├── JobCard.jsx           # NEW - Extract from jobs page
│   │   ├── JobCardSkeleton.jsx   # NEW - Extract from jobs page
│   │   ├── JobsSearchBar.jsx     # NEW - Extract from jobs page
│   │   ├── JobsEmptyState.jsx    # NEW - Extract from jobs page
│   │   ├── JobDetailsHeader.jsx  # NEW - Extract from job details page
│   │   ├── JobInfoBlock.jsx      # NEW - Extract from job details page
│   │   ├── JobApplicationStatus.jsx # NEW - Extract from job details page
│   │   └── JobDetailsSkeleton.jsx   # NEW - Extract from job details page
│   ├── recruiter/        # Already exists - recruiter-specific components
│   │   ├── ApplicationCard.jsx      # NEW - Extract from applications page
│   │   ├── ApplicationStatPill.jsx  # NEW - Extract from applications page
│   │   ├── ApplicationStatsHeader.jsx # NEW - Extract from applications page
│   │   ├── ApplicationActionButtons.jsx # NEW - Extract from applications page
│   │   ├── ApplicationFilters.jsx   # NEW - Extract from applications page
│   │   ├── NewJobForm.jsx          # NEW - Extract from new job page
│   │   ├── JobFormField.jsx        # NEW - Extract from new job page
│   │   └── TpoApprovalNote.jsx     # NEW - Extract from new job page
│   └── tpo/              # Already exists - TPO-specific components
│       ├── JobApprovalCard.jsx     # NEW - Extract from jobs page
│       ├── JobApprovalFilters.jsx  # NEW - Extract from jobs page
│       └── JobsPageSkeleton.jsx    # NEW - Extract from jobs page
└── ui/                   # Already exists - shared UI components
    ├── SearchBar.jsx     # NEW - Generic search bar component
    └── FormField.jsx     # NEW - Generic form field component
```

## Components and Interfaces

### Student Jobs Page Components

#### JobCard Component
```jsx
interface JobCardProps {
  job: Job;
  hasApplied: boolean;
  onViewJob: (jobId: string) => void;
}
```

**Responsibilities:**
- Display job information in card format
- Show application status and deadline
- Handle job viewing navigation
- Display company information and job package

#### JobCardSkeleton Component
```jsx
interface JobCardSkeletonProps {
  count?: number;
}
```

**Responsibilities:**
- Show loading state for job cards
- Maintain consistent card dimensions
- Provide smooth loading experience

#### JobsSearchBar Component
```jsx
interface JobsSearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
}
```

**Responsibilities:**
- Handle job search functionality
- Provide search input with icon
- Manage search state

#### JobsEmptyState Component
```jsx
interface JobsEmptyStateProps {
  searchTerm: string;
  onClearSearch: () => void;
}
```

**Responsibilities:**
- Display appropriate empty state message
- Handle search clearing
- Show relevant call-to-action

### Student Job Details Page Components

#### JobDetailsHeader Component
```jsx
interface JobDetailsHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  buttonText: string;
}
```

**Responsibilities:**
- Display page header with back navigation
- Show job title and company information
- Provide consistent header styling

#### JobInfoBlock Component
```jsx
interface JobInfoBlockProps {
  title: string;
  children: React.ReactNode;
}
```

**Responsibilities:**
- Display structured job information sections
- Provide consistent formatting for job details
- Handle text content with proper spacing

#### JobApplicationStatus Component
```jsx
interface JobApplicationStatusProps {
  hasApplied: boolean;
  deadlinePassed: boolean;
}
```

**Responsibilities:**
- Show application status indicators
- Display appropriate status messages
- Provide visual feedback for application state

### Recruiter Applications Page Components

#### ApplicationCard Component
```jsx
interface ApplicationCardProps {
  application: Application;
  onStatusUpdate: (applicationId: string, status: string) => void;
}
```

**Responsibilities:**
- Display student application information
- Show academic records and resume link
- Provide status update actions
- Handle application status changes

#### ApplicationStatPill Component
```jsx
interface ApplicationStatPillProps {
  label: string;
  value: number;
  color: string;
  isActive: boolean;
  onClick: () => void;
}
```

**Responsibilities:**
- Display application statistics
- Handle filter selection
- Provide visual feedback for active filters
- Show count badges

#### ApplicationStatsHeader Component
```jsx
interface ApplicationStatsHeaderProps {
  stats: ApplicationStats;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onDownloadReport: () => void;
}
```

**Responsibilities:**
- Display application statistics overview
- Handle filter changes
- Provide report download functionality
- Show page title and actions

### Recruiter New Job Page Components

#### NewJobForm Component
```jsx
interface NewJobFormProps {
  onSubmit: (jobData: JobFormData) => void;
  loading: boolean;
}
```

**Responsibilities:**
- Handle job creation form
- Manage form validation
- Submit job data
- Show loading states

#### JobFormField Component
```jsx
interface JobFormFieldProps {
  id: string;
  label: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
}
```

**Responsibilities:**
- Provide consistent form field styling
- Handle required field indicators
- Display help text
- Manage field layout

### TPO Jobs Management Page Components

#### JobApprovalCard Component
```jsx
interface JobApprovalCardProps {
  job: Job;
  onApprove: (jobId: string, approved: boolean) => void;
}
```

**Responsibilities:**
- Display job details for approval
- Show recruiter and company information
- Provide approval/rejection actions
- Display application counts

## Data Models

### Job Interface
```typescript
interface Job {
  id: string;
  jobDescription: string;
  eligibilityCriteria: string;
  applicationDeadline: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  package?: string;
  recruiter: {
    name: string;
    companyProfile: string;
  };
  _count?: {
    applications: number;
  };
}
```

### Application Interface
```typescript
interface Application {
  id: string;
  jobId: string;
  applicationStatus: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'HIRED' | 'REJECTED';
  student: {
    name: string;
    email: string;
    facultyNo?: string;
    enrollmentNo?: string;
    academicRecords?: {
      currentCGPA?: string;
      courseEnrolled?: string;
      resumeLink?: string;
    };
  };
  job: Job;
}
```

### ApplicationStats Interface
```typescript
interface ApplicationStats {
  total: number;
  applied: number;
  shortlisted: number;
  interviews: number;
  hired: number;
  rejected: number;
}
```

## Error Handling

### Component Error Boundaries
- Each extracted component will include proper error handling
- Failed API calls will show appropriate error messages
- Loading states will be maintained during data fetching
- Form validation errors will be displayed inline

### Graceful Degradation
- Components will handle missing or invalid data gracefully
- Default props will be provided where appropriate
- Empty states will be shown when no data is available
- Skeleton loaders will maintain layout during loading

## Testing Strategy

### Component Testing
- Unit tests for each extracted component
- Props validation testing
- Event handler testing
- Accessibility testing

### Integration Testing
- Test component interactions within pages
- Verify data flow between components
- Test navigation and routing
- Validate form submissions

### Visual Regression Testing
- Ensure UI consistency after refactoring
- Test responsive design across breakpoints
- Verify hover states and animations
- Check loading states and transitions

## Migration Strategy

### Phase 1: Student Pages
1. Extract components from Student Jobs Page
2. Extract components from Student Job Details Page
3. Update imports and test functionality

### Phase 2: Recruiter Pages
1. Extract components from Recruiter Applications Page
2. Extract components from Recruiter New Job Page
3. Update imports and test functionality

### Phase 3: TPO Pages
1. Extract components from TPO Jobs Management Page
2. Update imports and test functionality

### Phase 4: Shared Components
1. Identify and extract truly reusable components
2. Move to shared directories
3. Update all imports across the application

## Performance Considerations

### Code Splitting
- Components will be properly code-split
- Lazy loading for heavy components where appropriate
- Bundle size optimization through tree shaking

### Memoization
- Use React.memo for components that receive stable props
- Implement useMemo for expensive calculations
- Use useCallback for event handlers passed to child components

### Accessibility
- Maintain all existing ARIA attributes
- Ensure proper keyboard navigation
- Preserve focus management
- Test with screen readers

## Backward Compatibility

- All existing functionality will be preserved
- API interfaces will remain unchanged
- User experience will be identical
- No breaking changes to existing components