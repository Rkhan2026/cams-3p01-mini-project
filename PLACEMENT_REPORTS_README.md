# Placement Statistics Report System

## Overview
A comprehensive placement statistics report generation system for TPO (Training and Placement Office) administrators. This system allows generating detailed placement reports in both PDF and Excel formats with advanced filtering and analytics capabilities.

## Features

### 📊 Report Generation
- **PDF Reports**: Professional formatted reports with executive summary, detailed records, and analytics
- **Excel Reports**: Multi-sheet workbooks with raw data, statistics, and pivot-ready formats
- **Real-time Data**: Live data fetching from the database with automatic calculations

### 🔍 Advanced Filtering
- **Date Range**: Filter by application/placement date ranges
- **Company Filter**: Search and filter by company names
- **Status Filter**: Filter by placement status (Placed, Pending, Rejected)
- **Department Filter**: Filter by student departments/branches
- **Salary Range**: Filter by salary packages (Below 3L, 3-5L, 5-8L, Above 8L)

### 📈 Analytics & Statistics
- **Overall Statistics**: Total applications, placements, success rates
- **Company-wise Analysis**: Performance metrics per company
- **Department-wise Analysis**: Placement rates by academic departments
- **Salary Analytics**: Average, minimum, maximum packages

### 🎯 Report Types
1. **Summary Report**: High-level overview with key metrics
2. **Detailed Report**: Complete student placement records
3. **Company-wise Analysis**: Recruitment performance by companies
4. **Department-wise Analysis**: Academic performance correlation

## File Structure

```
app/
├── tpo/
│   ├── page.js                    # TPO Dashboard
│   ├── layout.js                  # TPO Layout with navigation
│   └── reports/
│       └── page.js                # Reports main page
├── api/
│   └── tpo/
│       └── placement-statistics/
│           └── route.js           # API endpoint for data
components/
├── PlacementReportGenerator.jsx   # Basic report component
└── PlacementReportEnhanced.jsx    # Advanced report component
```

## API Endpoints

### GET `/api/tpo/placement-statistics`
Fetches comprehensive placement data including:
- Student applications with personal details
- Job postings with company information
- Application statuses and outcomes
- Calculated statistics and analytics

### POST `/api/tpo/placement-statistics`
Updates placement status for applications:
```json
{
  "applicationId": "string",
  "status": "PLACED|PENDING|REJECTED",
  "salary": "number (optional)"
}
```

## Data Structure

### Placement Record
```javascript
{
  applicationId: "string",
  studentId: "string",
  studentName: "string",
  studentEmail: "string",
  facultyNo: "string",
  enrollmentNo: "string",
  companyName: "string",
  jobTitle: "string",
  jobDescription: "string",
  salary: "number",
  status: "PLACED|PENDING|REJECTED",
  applicationDate: "date",
  eligibilityCriteria: "string"
}
```

### Statistics Object
```javascript
{
  totalApplications: "number",
  totalPlacements: "number",
  pendingApplications: "number",
  rejectedApplications: "number",
  placementRate: "percentage",
  totalCompanies: "number",
  averageSalary: "number",
  maxSalary: "number",
  minSalary: "number"
}
```

## Usage Instructions

### Accessing Reports
1. Navigate to TPO Dashboard (`/tpo`)
2. Click on "Placement Reports" or go directly to `/tpo/reports`
3. Wait for data to load automatically

### Generating Reports
1. **Apply Filters** (optional):
   - Set date ranges for specific periods
   - Filter by company, department, or status
   - Select salary ranges for analysis

2. **Choose Report Type**:
   - Summary: Quick overview with key metrics
   - Detailed: Complete records with all fields
   - Company-wise: Analysis by recruiting companies
   - Department-wise: Analysis by academic departments

3. **Export Options**:
   - **PDF**: Click "Export Advanced PDF" for formatted report
   - **Excel**: Click "Export Advanced Excel" for data workbook

### Report Contents

#### PDF Report Includes:
- Cover page with report metadata
- Executive summary with key statistics
- Company-wise placement analysis
- Top performing companies list
- Detailed placement records (first 50 records)
- Clean text-based formatting optimized for readability

#### Excel Report Includes:
- **Executive Summary** sheet with key metrics
- **Detailed Records** sheet with all placement data
- **Company Statistics** sheet with company performance
- **Department Statistics** sheet with academic analysis
- Formatted headers and data validation

## Technical Implementation

### Dependencies
```json
{
  "jspdf": "^2.5.1",
  "xlsx": "^0.18.5"
}
```

### Database Integration
- Uses Prisma ORM for database operations
- Fetches data from Student, Application, JobPosting, and CompanyRecruiter models
- Handles JSON parsing for flexible data storage

### Performance Considerations
- Data is fetched once and cached in component state
- Filtering is performed client-side for responsive UI
- Large datasets are paginated in preview tables
- Export operations are optimized for memory usage

## Security Features
- TPO authentication required for access
- Data sanitization for export formats
- No sensitive information in client-side logs
- Secure API endpoints with proper error handling

## Customization Options

### Adding New Filters
1. Add filter state in component
2. Implement filter logic in `applyFilters()` function
3. Add UI elements in filters section

### Modifying Report Format
1. Update PDF generation in `generateAdvancedPDFReport()`
2. Modify Excel structure in `generateAdvancedExcelReport()`
3. Adjust styling and layout as needed

### Extending Analytics
1. Add new calculations in `calculateStatistics()`
2. Include additional data processing in API endpoint
3. Update UI to display new metrics

## Troubleshooting

### Common Issues
1. **Data not loading**: Check API endpoint and database connection
2. **Export failures**: Verify browser compatibility and file permissions
3. **Performance issues**: Consider pagination for large datasets
4. **Formatting problems**: Check PDF/Excel library versions

### Error Handling
- API errors are displayed with retry options
- Export errors show user-friendly messages
- Loading states prevent multiple simultaneous operations
- Graceful degradation for missing data fields

## Future Enhancements
- Real-time data updates with WebSocket integration
- Advanced charting and visualization
- Email report delivery system
- Scheduled report generation
- Custom report templates
- Integration with external HR systems

## Support
For technical support or feature requests, contact the development team or refer to the project documentation.