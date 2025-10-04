# Design Document

## Overview

This design outlines the systematic refactoring of dashboard pages in the placement management system. The approach focuses on extracting reusable components, organizing them in a logical structure, and splitting long pages into manageable pieces while maintaining all existing functionality.

## Architecture

### Component Organization Structure

```
components/
├── ui/                          # Basic reusable UI components
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── LoadingSpinner.jsx
│   └── EmptyState.jsx
├── dashboard/                   # Dashboard-specific components
│   ├── shared/                  # Shared across all dashboards
│   │   ├── DashboardHeader.jsx
│   │   ├── StatCard.jsx
│   │   ├── QuickActionCard.jsx
│   │   └── PageHeader.jsx
│   ├── student/                 # Student dashboard components
│   │   ├── StudentStats.jsx
│   │   ├── RecentJobs.jsx
│   │   ├── RecentApplications.jsx
│   │   └── ApplicationCard.jsx
│   ├── recruiter/               # Recruiter dashboard components
│   │   ├── RecruiterStats.jsx
│   │   ├── JobCard.jsx
│   │   └── ApplicationsList.jsx
│   └── tpo/                     # TPO dashboard components
│       ├── TPOStats.jsx
│       ├── PendingApprovals.jsx
│       └── SystemAlerts.jsx
└── icons/                       # Centralized icon components
    ├── ArrowIcons.jsx
    ├── StatusIcons.jsx
    └── DashboardIcons.jsx
```

### Refactoring Strategy

1. **Phase 1: Extract Basic UI Components**
   - Create foundational components (Button, Card, Badge, etc.)
   - Standardize prop interfaces and styling patterns

2. **Phase 2: Extract Dashboard-Specific Components**
   - Identify common patterns across dashboards
   - Create shared dashboard components
   - Extract role-specific components

3. **Phase 3: Refactor Main Dashboard Pages**
   - Split main dashboard pages using extracted components
   - Maintain existing functionality and state management

4. **Phase 4: Refactor Sub-Pages**
   - Apply same component extraction to sub-pages
   - Ensure consistent patterns across all pages

## Components and Interfaces

### Basic UI Components

#### Button Component
```jsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}
```

#### Card Component
```jsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}
```

#### Badge Component
```jsx
interface BadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
  size?: 'sm' | 'md';
}
```

### Dashboard Components

#### StatCard Component
```jsx
interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'gray';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}
```

#### QuickActionCard Component
```jsx
interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: 'blue' | 'green' | 'purple' | 'gray';
}
```

#### DashboardHeader Component
```jsx
interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  gradient?: 'blue' | 'gray' | 'purple';
  actions?: React.ReactNode;
}
```

### Icon Management

Centralize all SVG icons into organized components:
- **ArrowIcons**: ArrowLeft, ArrowRight, ArrowUp, ArrowDown
- **StatusIcons**: CheckCircle, XCircle, Clock, Star
- **DashboardIcons**: Briefcase, Users, DocumentText, Calendar, etc.

## Data Models

### Component State Management

Components will receive data through props and maintain minimal internal state:

```jsx
// Dashboard data structure
interface DashboardData {
  stats: {
    [key: string]: number;
  };
  recentItems: Array<any>;
  notifications: Array<{
    type: 'success' | 'warning' | 'info';
    message: string;
  }>;
}
```

### Props Standardization

All components will follow consistent prop naming:
- `onClick` for click handlers
- `className` for additional CSS classes
- `children` for nested content
- `variant` for style variations
- `size` for size variations

## Error Handling

### Component Error Boundaries

Each major component section will include error handling:

```jsx
const ComponentWithErrorBoundary = ({ children }) => {
  try {
    return children;
  } catch (error) {
    return <ErrorFallback error={error} />;
  }
};
```

### Loading States

All components that display dynamic data will support loading states:

```jsx
interface LoadingProps {
  loading?: boolean;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}
```

## Testing Strategy

### Component Testing Approach

1. **Unit Tests for UI Components**
   - Test prop variations and styling
   - Verify accessibility attributes
   - Test interaction handlers

2. **Integration Tests for Dashboard Components**
   - Test data flow and state management
   - Verify component composition
   - Test responsive behavior

3. **Visual Regression Tests**
   - Ensure consistent styling after refactoring
   - Test component variations
   - Verify responsive layouts

### Testing Tools

- Jest for unit testing
- React Testing Library for component testing
- Accessibility testing with jest-axe
- Visual testing considerations for future implementation

## Migration Strategy

### Backward Compatibility

During refactoring:
1. Keep original files until new components are tested
2. Gradually replace sections of pages with new components
3. Maintain all existing functionality and styling
4. Preserve all existing prop interfaces where possible

### Rollout Plan

1. **Week 1**: Create basic UI components and icon library
2. **Week 2**: Extract shared dashboard components
3. **Week 3**: Refactor main dashboard pages
4. **Week 4**: Refactor sub-pages and finalize testing

### Performance Considerations

- Use React.memo for components that receive stable props
- Implement lazy loading for heavy components
- Optimize bundle size by avoiding unnecessary re-renders
- Maintain existing performance characteristics