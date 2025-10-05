# Integration Tests for Placement Management System

This directory contains comprehensive integration tests for the placement management system using Vitest. The tests cover all major workflows and user interactions in the system.

## Test Files Overview

### 1. `studentRegistrationFlow.test.jsx`
Tests the complete student registration workflow including:
- Student registration with academic records
- Email validation and duplicate prevention
- Account approval process
- Login after approval
- Handling of pending/rejected accounts

### 2. `recruiterRegistrationFlow.test.jsx`
Tests the recruiter registration and approval process:
- Recruiter registration with company profile
- Required field validation
- Account approval workflow
- Login after approval
- Rejection handling

### 3. `jobPostingFlow.test.jsx`
Tests job posting creation and management:
- Job posting creation by approved recruiters
- Validation of job details and deadlines
- Authorization checks
- Job listing and filtering
- Recruiter's own job management

### 4. `jobApplicationFlow.test.jsx`
Tests the job application process:
- Application submission by students
- Duplicate application prevention
- Application deadline validation
- Application status tracking
- Recruiter application management

### 5. `adminApprovalFlow.test.jsx`
Tests TPO admin approval workflows:
- Fetching pending registrations
- Student and recruiter approval/rejection
- Job posting approval process
- Authorization for admin functions

### 6. `roleBasedAccessControl.test.jsx`
Tests access control across different user roles:
- Student access to student features
- Recruiter access to recruiter features
- TPO admin access to all features
- Cross-role access prevention
- Session validation

### 7. `applicationStatusTracking.test.jsx`
Tests application status management:
- Status transitions (pending → review → accepted/rejected)
- Status history tracking
- Bulk status updates
- Notification system
- Invalid transition prevention

### 8. `reportGenerationFlow.test.jsx`
Tests report generation capabilities:
- Placement statistics reports
- Company-wise application reports
- Student placement reports with filters
- Report export functionality
- Trend analysis reports

### 9. `adminAccessControl.test.jsx`
Tests administrative access controls:
- TPO admin permissions
- System settings management
- Audit log access
- User account management
- Rate limiting for admin operations

### 10. `adminDashboardStats.test.jsx`
Tests dashboard statistics and metrics:
- Overview statistics
- Department-wise placement stats
- Real-time application metrics
- Company performance stats
- System health metrics

### 11. `jobApprovalVisibility.test.jsx`
Tests job visibility based on approval status:
- Approved jobs visible to students
- Pending/rejected jobs hidden from students
- Recruiter access to own jobs
- TPO admin access to all jobs
- Job status change notifications

## Running the Tests

### Run All Integration Tests
```bash
npm test
```

### Run Specific Test File
```bash
npx vitest tests/integration/studentRegistrationFlow.test.jsx
```

### Run Tests in Watch Mode
```bash
npx vitest tests/integration --watch
```

### Run Tests with Coverage
```bash
npx vitest tests/integration --coverage
```

### Run Integration Test Suite
```bash
node tests/run-integration-tests.js
```

## Test Configuration

The tests use the following configuration:

- **Test Framework**: Vitest
- **Environment**: jsdom (for DOM simulation)
- **Setup File**: `tests/setup.js`
- **Mocking**: Global fetch mocking for API calls
- **Assertions**: Vitest's built-in expect assertions

## Test Structure

Each test file follows a consistent structure:

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('Feature Name Integration Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('should test specific functionality', async () => {
    // Mock API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: {} })
    })

    // Make API call
    const response = await fetch('/api/endpoint')
    const result = await response.json()

    // Assertions
    expect(result.success).toBe(true)
  })
})
```

## Key Testing Patterns

### 1. API Mocking
All tests use `global.fetch` mocking to simulate API responses without making actual HTTP requests.

### 2. Role-Based Testing
Tests verify that different user roles have appropriate access to features and endpoints.

### 3. Workflow Testing
Tests follow complete user workflows from start to finish, ensuring all steps work together.

### 4. Error Handling
Tests include both success and failure scenarios to ensure proper error handling.

### 5. Data Validation
Tests verify that proper validation is applied to user inputs and API requests.

## System Coverage

The integration tests cover:

- **User Management**: Registration, approval, login, role-based access
- **Job Management**: Posting, approval, visibility, applications
- **Application Workflow**: Submission, tracking, status updates
- **Administrative Functions**: Approvals, reports, system management
- **Security**: Authentication, authorization, access control
- **Data Integrity**: Validation, constraints, business rules

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: External dependencies are mocked to ensure test reliability
3. **Assertions**: Clear and specific assertions verify expected behavior
4. **Error Cases**: Both success and failure scenarios are tested
5. **Real-world Scenarios**: Tests simulate actual user workflows

## Maintenance

When adding new features or modifying existing ones:

1. Update relevant test files to cover new functionality
2. Add new test files for major new features
3. Ensure all tests pass before deploying changes
4. Update this documentation as needed

## Troubleshooting

### Common Issues

1. **Mock not working**: Ensure `global.fetch = vi.fn()` is called in `beforeEach`
2. **Async issues**: Use `async/await` properly with mocked promises
3. **Import errors**: Check that all imports are correctly specified
4. **Test isolation**: Clear mocks between tests using `vi.clearAllMocks()`

### Debug Mode

Run tests with debug output:
```bash
DEBUG=1 npx vitest tests/integration
```