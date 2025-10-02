'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import Button from './ui/Button';

export default function PlacementReportEnhanced({ data, onRefresh }) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    company: '',
    status: 'all',
    department: 'all',
    salaryRange: 'all'
  });

  const [reportType, setReportType] = useState('summary');
  const [loading, setLoading] = useState(false);

  const applyFilters = () => {
    if (!data) return data;

    // ONLY show HIRED students - filter out all other statuses first
    let filtered = data.placements.filter(placement => 
      placement.status === 'HIRED' || placement.status === 'PLACED'
    );

    if (filters.startDate) {
      filtered = filtered.filter(placement => 
        new Date(placement.applicationDate) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(placement => 
        new Date(placement.applicationDate) <= new Date(filters.endDate)
      );
    }

    if (filters.company) {
      filtered = filtered.filter(placement => 
        placement.companyName.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.department !== 'all') {
      filtered = filtered.filter(placement => {
        try {
          const records = placement.academicRecords 
            ? (typeof placement.academicRecords === 'string' 
                ? JSON.parse(placement.academicRecords) 
                : placement.academicRecords)
            : {};
          const dept = records.department || records.branch || 'Unknown';
          return dept === filters.department;
        } catch {
          return filters.department === 'Unknown';
        }
      });
    }

    if (filters.salaryRange !== 'all') {
      filtered = filtered.filter(placement => {
        if (!placement.salary) return filters.salaryRange === 'not-disclosed';
        const salary = parseFloat(placement.salary);
        switch (filters.salaryRange) {
          case 'below-3': return salary < 300000;
          case '3-5': return salary >= 300000 && salary < 500000;
          case '5-8': return salary >= 500000 && salary < 800000;
          case 'above-8': return salary >= 800000;
          default: return true;
        }
      });
    }

    return {
      ...data,
      placements: filtered,
      statistics: calculateStatistics(filtered)
    };
  };



  const calculateStatistics = (placements) => {
    // Since we're only showing HIRED students, all records are successful placements
    const total = placements.length;
    
    const companies = [...new Set(placements.map(p => p.companyName))];
    const placedWithSalary = placements.filter(p => 
      p.salary && !isNaN(parseFloat(p.salary))
    );
    
    const avgSalary = placedWithSalary.length > 0
      ? placedWithSalary.reduce((sum, p) => sum + parseFloat(p.salary), 0) / placedWithSalary.length
      : 0;

    const maxSalary = placedWithSalary.length > 0
      ? Math.max(...placedWithSalary.map(p => parseFloat(p.salary)))
      : 0;

    const minSalary = placedWithSalary.length > 0
      ? Math.min(...placedWithSalary.map(p => parseFloat(p.salary)))
      : 0;

    return {
      totalHired: total,
      totalCompanies: companies.length,
      averageSalary: avgSalary.toFixed(2),
      maxSalary: maxSalary.toFixed(2),
      minSalary: minSalary.toFixed(2)
    };
  };

  const generateAdvancedPDFReport = async () => {
    setLoading(true);
    const currentData = applyFilters();
    
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      let yPosition = 20;
      
      // Header
      doc.setFontSize(20);
      doc.text('Hired Students Placement Report', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(14);
      doc.text('Training & Placement Office', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Report Period: ${filters.startDate || 'All Time'} to ${filters.endDate || 'Present'}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Note: This report shows only successfully hired/placed students`, 20, yPosition);
      yPosition += 8;
      doc.text(`Total Hired Students: ${currentData.placements.length}`, 20, yPosition);
      yPosition += 20;

      // Executive Summary
      doc.setFontSize(16);
      doc.text('Executive Summary', 20, yPosition);
      yPosition += 15;
      
      const stats = currentData.statistics;
      doc.setFontSize(10);
      
      doc.text(`Total Hired Students: ${stats.totalHired}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Companies Involved: ${stats.totalCompanies}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Average Salary Package: Rs.${stats.averageSalary}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Highest Package: Rs.${stats.maxSalary}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Lowest Package: Rs.${stats.minSalary}`, 20, yPosition);
      yPosition += 20;

      // Detailed Records
      doc.setFontSize(14);
      doc.text('Detailed Placement Records', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(8);
      
      // Table headers - better spacing for full text
      doc.text('Student Name', 20, yPosition);
      doc.text('Company', 75, yPosition);
      doc.text('Position', 125, yPosition);
      doc.text('Status', 170, yPosition);
      yPosition += 8;
      
      // Draw line under headers
      doc.line(20, yPosition - 2, 200, yPosition - 2);
      yPosition += 5;

      // Add placement records
      currentData.placements.slice(0, 35).forEach(placement => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Repeat headers on new page
          doc.setFontSize(8);
          doc.text('Student Name', 20, yPosition);
          doc.text('Company', 75, yPosition);
          doc.text('Position', 125, yPosition);
          doc.text('Status', 170, yPosition);
          yPosition += 8;
          doc.line(20, yPosition - 2, 200, yPosition - 2);
          yPosition += 5;
        }
        
        doc.text((placement.studentName || 'N/A').substring(0, 22), 20, yPosition);
        doc.text((placement.companyName || 'N/A').substring(0, 18), 75, yPosition);
        doc.text((placement.jobTitle || 'N/A').substring(0, 20), 125, yPosition);
        
        // Handle long status text
        let status = placement.status || 'PENDING';
        if (status.length > 10) {
          status = status.substring(0, 10) + '..';
        }
        doc.text(status, 170, yPosition);
        
        yPosition += 6;
      });
      
      // Add salary information on separate section
      if (currentData.placements.some(p => p.salary)) {
        yPosition += 10;
        doc.setFontSize(10);
        doc.text('Salary Information:', 20, yPosition);
        yPosition += 8;
        doc.setFontSize(8);
        
        currentData.placements.slice(0, 20).forEach(placement => {
          if (placement.salary && yPosition < 270) {
            doc.text(`${(placement.studentName || 'N/A').substring(0, 25)}: Rs.${placement.salary}`, 20, yPosition);
            yPosition += 6;
          }
        });
      }
      
      // Add additional student details on separate page
      if (currentData.placements.length > 0) {
        doc.addPage();
        yPosition = 20;
        doc.setFontSize(12);
        doc.text('Student Contact Details', 20, yPosition);
        yPosition += 15;
        
        doc.setFontSize(8);
        doc.text('Name', 20, yPosition);
        doc.text('Email', 80, yPosition);
        doc.text('Faculty No', 140, yPosition);
        doc.text('Enrollment No', 180, yPosition);
        yPosition += 8;
        doc.line(20, yPosition - 2, 200, yPosition - 2);
        yPosition += 5;
        
        currentData.placements.slice(0, 35).forEach(placement => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.text((placement.studentName || 'N/A').substring(0, 25), 20, yPosition);
          doc.text((placement.studentEmail || 'N/A').substring(0, 25), 80, yPosition);
          doc.text(placement.facultyNo || 'N/A', 140, yPosition);
          doc.text(placement.enrollmentNo || 'N/A', 180, yPosition);
          yPosition += 6;
        });
      }
      
      if (currentData.placements.length > 40) {
        yPosition += 10;
        doc.setFontSize(10);
        doc.text(`... and ${currentData.placements.length - 40} more records`, 20, yPosition);
        yPosition += 8;
        doc.text('Export Excel for complete data with all fields', 20, yPosition);
      }

      doc.save(`placement-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateAdvancedExcelReport = async () => {
    setLoading(true);
    const currentData = applyFilters();
    
    try {
      const wb = XLSX.utils.book_new();
      
      // Summary Sheet
      const summaryData = [
        ['HIRED STUDENTS PLACEMENT REPORT'],
        [`Generated on: ${new Date().toLocaleDateString()}`],
        [`Report Period: ${filters.startDate || 'All Time'} to ${filters.endDate || 'Present'}`],
        ['Note: This report shows only successfully hired/placed students'],
        [''],
        ['EXECUTIVE SUMMARY'],
        ['Metric', 'Value'],
        ['Total Hired Students', currentData.statistics.totalHired],
        ['Companies Involved', currentData.statistics.totalCompanies],
        ['Average Salary Package', `Rs.${currentData.statistics.averageSalary}`],
        ['Highest Package', `Rs.${currentData.statistics.maxSalary}`],
        ['Lowest Package', `Rs.${currentData.statistics.minSalary}`]
      ];
      
      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Executive Summary');
      
      // Detailed Records - Unified with PDF structure
      const detailHeaders = [
        'Student Name', 'Email', 'Faculty No', 'Enrollment No',
        'Company', 'Position', 'Status', 'Package', 'Application Date'
      ];
      
      const detailData = [
        detailHeaders,
        ...currentData.placements.map(p => [
          p.studentName || 'N/A',
          p.studentEmail || 'N/A',
          p.facultyNo || 'N/A',
          p.enrollmentNo || 'N/A',
          p.companyName || 'N/A',
          p.jobTitle || 'N/A',
          p.status || 'PENDING',
          p.salary ? `Rs.${p.salary}` : 'N/A',
          p.applicationDate ? new Date(p.applicationDate).toLocaleDateString() : 'N/A'
        ])
      ];
      
      const detailWs = XLSX.utils.aoa_to_sheet(detailData);
      XLSX.utils.book_append_sheet(wb, detailWs, 'Detailed Records');
      
      XLSX.writeFile(wb, `placement-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!data) {
    return <div>No data available</div>;
  }

  const currentData = applyFilters();
  const departments = [...new Set(data.placements.map(p => {
    try {
      const records = p.academicRecords 
        ? (typeof p.academicRecords === 'string' ? JSON.parse(p.academicRecords) : p.academicRecords)
        : {};
      return records.department || records.branch || 'Unknown';
    } catch {
      return 'Unknown';
    }
  }))];

  return (
    <div className="space-y-6" style={{ color: '#111827' }}>
      {/* Enhanced Filters */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Advanced Filters & Report Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="summary">Summary Report</option>
              <option value="detailed">Detailed Report</option>
              <option value="company-wise">Company-wise Analysis</option>
              <option value="department-wise">Department-wise Analysis</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({...filters, department: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Salary Range</label>
            <select
              value={filters.salaryRange}
              onChange={(e) => setFilters({...filters, salaryRange: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="all">All Ranges</option>
              <option value="below-3">Below Rs.3 LPA</option>
              <option value="3-5">Rs.3-5 LPA</option>
              <option value="5-8">Rs.5-8 LPA</option>
              <option value="above-8">Above Rs.8 LPA</option>
              <option value="not-disclosed">Not Disclosed</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Company</label>
            <input
              type="text"
              placeholder="Search company..."
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Report Type</label>
            <select
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            >
              <option>Hired Students Only</option>
            </select>
            <p className="text-xs text-gray-800 mt-1">Only showing successfully hired/placed students</p>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="text-sm font-medium text-green-800">Hired Students</h4>
          <p className="text-2xl font-bold text-green-900">{currentData.statistics.totalHired}</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800">Companies</h4>
          <p className="text-2xl font-bold text-blue-900">{currentData.statistics.totalCompanies}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="text-sm font-medium text-purple-800">Avg Package</h4>
          <p className="text-2xl font-bold text-purple-900">Rs.{currentData.statistics.averageSalary}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-medium text-yellow-800">Highest Package</h4>
          <p className="text-2xl font-bold text-yellow-900">Rs.{currentData.statistics.maxSalary}</p>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
          <h4 className="text-sm font-medium text-indigo-800">Lowest Package</h4>
          <p className="text-2xl font-bold text-indigo-900">Rs.{currentData.statistics.minSalary}</p>
        </div>
      </div>

      {/* Enhanced Export Options */}
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={generateAdvancedPDFReport}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
          📄 Export PDF Report
        </Button>
        
        <Button
          onClick={generateAdvancedExcelReport}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
          📊 Export Excel Report
        </Button>
        
        <Button
          onClick={onRefresh}
          className="px-6 py-3 flex items-center gap-2 bg-yellow-500 text-white hover:bg-yellow-600 border border-yellow-500"
          style={{ color: 'white', backgroundColor: '#EAB308' }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh Data
        </Button>
      </div>

      {/* Data Preview Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900" style={{ color: '#111827' }}>Hired Students Records</h3>
          <p className="text-sm text-gray-800" style={{ color: '#374151' }}>
            Showing {currentData.placements.length} hired students
          </p>
        </div>
        
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider" style={{ color: '#111827' }}>Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider" style={{ color: '#111827' }}>Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider" style={{ color: '#111827' }}>Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider" style={{ color: '#111827' }}>Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider" style={{ color: '#111827' }}>Package</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider" style={{ color: '#111827' }}>Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.placements.slice(0, 50).map((placement, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{placement.studentName}</div>
                      <div className="text-sm text-gray-700">{placement.studentEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{placement.companyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{placement.jobTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      placement.status === 'PLACED' ? 'bg-green-100 text-green-800'
                      : placement.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                    }`}>
                      {placement.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {placement.salary ? `₹${placement.salary}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(placement.applicationDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentData.placements.length > 50 && (
            <div className="px-6 py-4 bg-gray-50 text-center text-sm text-gray-800">
              Showing first 50 records. Export full report to see all {currentData.placements.length} records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}