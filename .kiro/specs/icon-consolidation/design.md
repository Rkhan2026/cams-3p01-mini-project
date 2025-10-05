# Design Document

## Overview

This design outlines the consolidation of all dashboard icons into a single `components/ui/icons.js` file. The current architecture has icons scattered across multiple files (`components/icons/DashboardIcons.jsx`, `components/icons/StatusIcons.jsx`, `components/icons/ArrowIcons.jsx`) and some defined inline within dashboard pages. The new design will create a unified icon system that's easier to maintain and provides consistent imports across the application.

## Architecture

### Current State
- Icons are distributed across multiple files in `components/icons/`
- Some icons are defined inline within dashboard pages
- Dashboard pages import from `components/icons` index file
- Inconsistent icon definitions and patterns

### Target State
- All dashboard icons consolidated in `components/ui/icons.js`
- No inline icon definitions in dashboard pages
- Consistent import pattern: `import { IconName } from "../../components/ui/icons.js"`
- Standardized icon component structure

## Components and Interfaces

### Icon Component Structure
Each icon component will follow this standardized pattern:
```javascript
export const IconName = ({ className = "w-6 h-6", ...props }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="[SVG path data]"
    />
  </svg>
);
```

### Consolidated Icon Categories
The `components/ui/icons.js` file will include:

1. **Navigation Icons**: ArrowLeftIcon, ArrowRightIcon, BackArrowIcon
2. **Dashboard Icons**: BriefcaseIcon, UserGroupIcon, DocumentTextIcon, CalendarIcon, SearchIcon, UserIcon, PlusCircleIcon, PlusIcon, CollectionIcon, DocumentCheckIcon, ChartBarIcon
3. **Status Icons**: CheckCircleIcon, XCircleIcon, ClockIcon, StarIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckIcon, XIcon
4. **Action Icons**: DownloadIcon, UserAddIcon, MoneyIcon
5. **UI Icons**: SpinnerIcon (with animation classes)

### Import Pattern
All dashboard pages will use consistent imports:
```javascript
import { 
  ArrowLeftIcon, 
  BriefcaseIcon, 
  SearchIcon 
} from "../../../../components/ui/icons.js";
```

## Data Models

### Icon Inventory
Based on analysis of dashboard pages, the following icons need to be consolidated:

**Existing Icons (from components/icons/):**
- ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, ArrowDownIcon
- BriefcaseIcon, UsersIcon, UserGroupIcon, DocumentTextIcon, CalendarIcon, SearchIcon, UserIcon, PlusCircleIcon, PlusIcon, CollectionIcon, DocumentCheckIcon, ChartBarIcon
- CheckCircleIcon, XCircleIcon, ClockIcon, StarIcon, ExclamationTriangleIcon, InformationCircleIcon

**Inline Icons (to be extracted):**
- MoneyIcon (from student/jobs/page.js)
- BackArrowIcon (from recruiter/jobs/new/page.js)
- SpinnerIcon (from recruiter/jobs/new/page.js)
- CheckIcon (from recruiter/applications/page.js)
- XIcon (from recruiter/applications/page.js)
- UserAddIcon (from recruiter/applications/page.js)
- DownloadIcon (from recruiter/applications/page.js)

### File Mapping
Dashboard pages that need import updates:
- `app/(dashboards)/tpo/page.js`
- `app/(dashboards)/tpo/reports/page.js`
- `app/(dashboards)/tpo/jobs/page.js`
- `app/(dashboards)/student/page.js`
- `app/(dashboards)/student/jobs/page.js`
- `app/(dashboards)/student/jobs/[id]/page.js`
- `app/(dashboards)/student/applications/page.js`
- `app/(dashboards)/recruiter/page.js`
- `app/(dashboards)/recruiter/jobs/page.js`
- `app/(dashboards)/recruiter/jobs/new/page.js`
- `app/(dashboards)/recruiter/applications/page.js`

## Error Handling

### Migration Safety
- Preserve all existing icon functionality during migration
- Maintain backward compatibility during transition
- Validate that all icon references are updated correctly
- Ensure no broken imports after consolidation

### Validation Steps
1. Verify all inline icons are properly extracted
2. Confirm all dashboard pages import from the new location
3. Test that all icons render correctly with their original styling
4. Validate that icon props (className, etc.) work as expected

## Testing Strategy

### Manual Testing
- Visual verification that all icons display correctly in dashboard pages
- Confirm icon styling and sizing remains consistent
- Test icon interactions (hover states, click handlers)
- Verify responsive behavior across different screen sizes

### Code Validation
- Check that all import statements are updated correctly
- Ensure no unused imports remain in dashboard pages
- Validate that the consolidated icons file exports all required icons
- Confirm no TypeScript/JavaScript errors after refactoring

### Regression Testing
- Test all dashboard functionality to ensure no breaking changes
- Verify that icon-dependent features work correctly
- Check that all dashboard pages load without errors
- Validate that the application builds successfully after changes