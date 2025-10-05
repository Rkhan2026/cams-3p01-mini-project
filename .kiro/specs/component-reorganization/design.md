# Design Document

## Overview

This design outlines the systematic reorganization of core components in the placement management system. The approach focuses on moving components from the root components directory into logical subdirectories based on their functionality and usage patterns, while ensuring all import paths are updated to maintain application functionality.

## Architecture

### Current Component Structure

```
components/
├── BackButton.jsx              # Used in student profile page
├── Header.jsx                  # Used in main app layout
├── Logo.jsx                    # Used across multiple pages and layouts
├── RoleCard.jsx               # Used in homepage role selection
├── Toast.jsx                  # Used in global toast notifications
├── PlacementReportEnhanced.jsx # Used in TPO reports page
├── PlacementReportGenerator.jsx # Report generation component
└── [other components...]
```

### Target Component Structure

```
components/
├── ui/                         # Reusable UI components
│   ├── BackButton.jsx         # Navigation component
│   ├── RoleCard.jsx          # Card component for role selection
│   └── Toast.jsx             # Notification component
├── layout/                     # Layout-specific components
│   └── Header.jsx            # Main application header
├── shared/                     # Shared components used across contexts
│   └── Logo.jsx              # Application logo component
├── reports/                    # Report-specific components
│   ├── PlacementReportEnhanced.jsx
│   └── PlacementReportGenerator.jsx
└── [existing organized components...]
```

### Component Categorization Logic

#### UI Components (`components/ui/`)
- **BackButton.jsx**: Reusable navigation component that can be used across different pages
- **RoleCard.jsx**: Reusable card component for displaying role options
- **Toast.jsx**: Reusable notification component for displaying messages

#### Layout Components (`components/layout/`)
- **Header.jsx**: Main application header that defines the layout structure

#### Shared Components (`components/shared/`)
- **Logo.jsx**: Brand component used across multiple contexts (homepage, auth, dashboards)

#### Report Components (`components/reports/`)
- **PlacementReportEnhanced.jsx**: Specialized component for enhanced report display
- **PlacementReportGenerator.jsx**: Specialized component for report generation

## Components and Interfaces

### Import Path Mapping

The reorganization will require updating import paths in the following files:

#### BackButton.jsx
- **Current Location**: `components/BackButton.jsx`
- **New Location**: `components/ui/BackButton.jsx`
- **Files to Update**:
  - `app/(dashboards)/student/profile/page.js`

#### Header.jsx
- **Current Location**: `components/Header.jsx`
- **New Location**: `components/layout/Header.jsx`
- **Files to Update**:
  - `app/layout.js`

#### Logo.jsx
- **Current Location**: `components/Logo.jsx`
- **New Location**: `components/shared/Logo.jsx`
- **Files to Update**:
  - `app/page.js`
  - `app/auth/register/page.js`
  - `app/(dashboards)/student/layout.js`
  - `app/(dashboards)/recruiter/layout.js`
  - `app/(dashboards)/tpo/layout.js`
  - `components/Header.jsx` (will be `components/layout/Header.jsx`)

#### RoleCard.jsx
- **Current Location**: `components/RoleCard.jsx`
- **New Location**: `components/ui/RoleCard.jsx`
- **Files to Update**:
  - `app/page.js`

#### Toast.jsx
- **Current Location**: `components/Toast.jsx`
- **New Location**: `components/ui/Toast.jsx`
- **Files to Update**:
  - `app/layout.js`

#### PlacementReportEnhanced.jsx
- **Current Location**: `components/PlacementReportEnhanced.jsx`
- **New Location**: `components/reports/PlacementReportEnhanced.jsx`
- **Files to Update**:
  - `app/(dashboards)/tpo/reports/page.js`

#### PlacementReportGenerator.jsx
- **Current Location**: `components/PlacementReportGenerator.jsx`
- **New Location**: `components/reports/PlacementReportGenerator.jsx`
- **Files to Update**: (To be determined during implementation)

## Data Models

### File Operation Structure

```javascript
const componentMoves = [
  {
    component: 'BackButton.jsx',
    from: 'components/BackButton.jsx',
    to: 'components/ui/BackButton.jsx',
    importUpdates: [
      'app/(dashboards)/student/profile/page.js'
    ]
  },
  {
    component: 'Header.jsx',
    from: 'components/Header.jsx',
    to: 'components/layout/Header.jsx',
    importUpdates: [
      'app/layout.js'
    ]
  },
  {
    component: 'Logo.jsx',
    from: 'components/Logo.jsx',
    to: 'components/shared/Logo.jsx',
    importUpdates: [
      'app/page.js',
      'app/auth/register/page.js',
      'app/(dashboards)/student/layout.js',
      'app/(dashboards)/recruiter/layout.js',
      'app/(dashboards)/tpo/layout.js',
      'components/layout/Header.jsx'
    ]
  },
  // ... additional components
];
```

### Import Path Transformation

```javascript
const importTransformations = {
  'components/BackButton': 'components/ui/BackButton',
  'components/Header': 'components/layout/Header',
  'components/Logo': 'components/shared/Logo',
  'components/RoleCard': 'components/ui/RoleCard',
  'components/Toast': 'components/ui/Toast',
  'components/PlacementReportEnhanced': 'components/reports/PlacementReportEnhanced',
  'components/PlacementReportGenerator': 'components/reports/PlacementReportGenerator'
};
```

## Error Handling

### File Operation Safety

1. **Backup Strategy**: Ensure all files are backed up before moving
2. **Validation**: Verify that source files exist before attempting to move
3. **Import Verification**: Check that all import paths are correctly updated
4. **Rollback Plan**: Maintain ability to revert changes if issues arise

### Import Path Validation

```javascript
const validateImportPaths = (filePath, expectedImports) => {
  // Read file content
  // Check for expected import statements
  // Verify import paths are correct
  // Report any missing or incorrect imports
};
```

## Testing Strategy

### Verification Approach

1. **File Structure Verification**
   - Confirm all components are moved to correct directories
   - Verify directory structure is created properly
   - Check that original files are removed

2. **Import Path Verification**
   - Verify all import statements are updated correctly
   - Check for any remaining references to old paths
   - Ensure no broken imports exist

3. **Functionality Testing**
   - Test homepage loads correctly with Logo and RoleCard
   - Test main layout works with Header and Toast
   - Test dashboard layouts load with Logo
   - Test student profile page works with BackButton
   - Test TPO reports page works with PlacementReportEnhanced
   - Test registration page works with Logo

### Testing Tools

- File system operations verification
- Import path scanning and validation
- Component functionality testing
- Application startup and navigation testing

## Migration Strategy

### Step-by-Step Process

1. **Phase 1: Directory Creation**
   - Create `components/ui/` directory
   - Create `components/layout/` directory
   - Create `components/shared/` directory
   - Create `components/reports/` directory

2. **Phase 2: Component Movement**
   - Move each component to its designated directory
   - Preserve exact file content and structure

3. **Phase 3: Import Path Updates**
   - Update import paths in all affected files
   - Use systematic approach to ensure no imports are missed

4. **Phase 4: Verification**
   - Verify all components are in correct locations
   - Test all affected pages and functionality
   - Confirm no broken imports or missing components

### Risk Mitigation

- **Incremental Approach**: Move one component at a time
- **Immediate Testing**: Test after each component move
- **Import Scanning**: Use tools to find all import references
- **Rollback Capability**: Maintain ability to revert individual moves

## Performance Considerations

### Bundle Impact

- Component moves should not affect bundle size
- Import paths remain relative, maintaining tree-shaking
- No performance degradation expected from reorganization

### Development Experience

- Improved component discoverability through logical organization
- Clearer separation of concerns
- Better maintainability for future development