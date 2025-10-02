'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';

export default function PlacementReportGenerator({ data, onRefresh }) {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    company: '',
    status: 'all'
  });

  const [filteredData, setFilteredData] = useState(data);

  // Apply filters to data
  const applyFilters = () => {
    if (!data) return;

    let filtered = data.placements;

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

    if (filters.status !== 'all') {
      filtered = filtered.filter(placement => 
        placement.status === filters.status
      );
    }

    setFilteredData({
      ...data,
      placements: filtered,
      statistics: calculateStatistics(filtered)
    });
  };

  const calculateStatistics = (placements) => {
    const total = placements.length;
    const placed = placements.filter(p => p.status === 'PLACED').length;
    const pending = placements.filter(p => p.status === 'PENDING').length;
    const rejected = placements.filter(p => p.status === 'REJECTED').length;

    const companies = [...new Set(placements.map(p => p.companyName))];
    const avgSalary = placements
      .filter(p => p.status === 'PLACED' && p.salary)
      .reduce((sum, p) => sum + p.salary, 0) / placed || 0;

    return {
      totalApplications: total,
      totalPlacements: placed,
      pendingApplications: pending,
      rejectedApplications: rejected,
      placementRate: total > 0 ? ((placed / total) * 100).toFixed(2) : 0,
      totalCompanies: companies.length,
      averageSalary: avgSalary.toFixed(2)
    };
  };

  const generatePDFReport = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      const currentData = filteredData || data;
      
      let yPosition = 20;
      
      // Header
      doc.setFontSize(20);
      doc.text('Placement Statistics Report', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(14);
      doc.text('Training & Placement Office', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
      yPosition += 15;

      // Executive Summary
      doc.setFontSize(14);
      doc.text('Executive Summary', 20, yPosition);
      yPosition += 15;
      
      const stats = currentData.statistics;
      doc.setFontSize(10);
      
      doc.text(`Total Hired Students: ${stats.totalHired}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Companies Involved: ${stats.totalCompanies}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Average Salary: Rs.${stats.averageSalary}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Highest Package: Rs.${stats.maxSalary}`, 20, yPosition);
      yPosition += 8;
      doc.text(`Lowest Package: Rs.${stats.minSalary}`, 20, yPosition);
      yPosition += 20;

      // Detailed Records
      doc.setFontSize(12);
      doc.text('Detailed Placement Records', 20, yPosition);
      yPosition += 15;
      
      doc.setFontSize(8);
      
      // Headers with better spacing for full text
      doc.text('Student Name', 20, yPosition);
      doc.text('Company', 75, yPosition);
      doc.text('Position', 125, yPosition);
      doc.text('Status', 170, yPosition);
      yPosition += 8;
      doc.line(20, yPosition - 2, 190, yPosition - 2);
      yPosition += 5;

      // Records
      currentData.placements.slice(0, 30).forEach(placement => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          // Repeat headers
          doc.setFontSize(8);
          doc.text('Student Name', 20, yPosition);
          doc.text('Company', 75, yPosition);
          doc.text('Position', 125, yPosition);
          doc.text('Status', 170, yPosition);
          yPosition += 8;
          doc.line(20, yPosition - 2, 190, yPosition - 2);
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
      
      if (currentData.placements.length > 30) {
        yPosition += 10;
        doc.setFontSize(10);
        doc.text(`... and ${currentData.placements.length - 30} more records`, 20, yPosition);
      }

      doc.save('placement-statistics-report.pdf');

      doc.save('placement-statistics-report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    }
  };

  const generateExcelReport = () => {
    try {
      const currentData = filteredData || data;
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      ['Placement Statistics Report'],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [''],
      ['Summary Statistics'],
      ['Metric', 'Value'],
      ['Total Applications', currentData.statistics.totalApplications],
      ['Total Placements', currentData.statistics.totalPlacements],
      ['Pending Applications', currentData.statistics.pendingApplications],
      ['Rejected Applications', currentData.statistics.rejectedApplications],
      ['Placement Rate', `${currentData.statistics.placementRate}%`],
      ['Total Companies', currentData.statistics.totalCompanies],
      ['Average Salary', `₹${currentData.statistics.averageSalary}`]
    ];
    
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');
    
    // Detailed Records Sheet
    const detailHeaders = [
      'Student Name', 'Email', 'Faculty No', 'Enrollment No', 
      'Company', 'Job Title', 'Job Description', 'Status', 
      'Salary', 'Application Date'
    ];
    
    const detailData = [
      detailHeaders,
      ...currentData.placements.map(placement => [
        placement.studentName,
        placement.studentEmail,
        placement.facultyNo || 'N/A',
        placement.enrollmentNo || 'N/A',
        placement.companyName,
        placement.jobTitle,
        placement.jobDescription,
        placement.status,
        placement.salary || 'N/A',
        new Date(placement.applicationDate).toLocaleDateString()
      ])
    ];
    
    const detailWs = XLSX.utils.aoa_to_sheet(detailData);
    XLSX.utils.book_append_sheet(wb, detailWs, 'Detailed Records');
    
    // Company-wise Statistics Sheet
    const companyStats = {};
    currentData.placements.forEach(placement => {
      if (!companyStats[placement.companyName]) {
        companyStats[placement.companyName] = {
          total: 0,
          placed: 0,
          pending: 0,
          rejected: 0
        };
      }
      companyStats[placement.companyName].total++;
      companyStats[placement.companyName][placement.status.toLowerCase()]++;
    });
    
    const companyData = [
      ['Company-wise Statistics'],
      ['Company', 'Total Applications', 'Placed', 'Pending', 'Rejected', 'Success Rate'],
      ...Object.entries(companyStats).map(([company, stats]) => [
        company,
        stats.total,
        stats.placed,
        stats.pending,
        stats.rejected,
        `${((stats.placed / stats.total) * 100).toFixed(2)}%`
      ])
    ];
    
    const companyWs = XLSX.utils.aoa_to_sheet(companyData);
    XLSX.utils.book_append_sheet(wb, companyWs, 'Company Statistics');
    
      XLSX.writeFile(wb, 'placement-statistics-report.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Error generating Excel report. Please try again.');
    }
  };

  if (!data) {
    return <div>No data available</div>;
  }

  const currentData = filteredData || data;

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              placeholder="Search company..."
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="PLACED">Placed</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={() => {
              setFilters({ startDate: '', endDate: '', company: '', status: 'all' });
              setFilteredData(data);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800">Total Applications</h4>
          <p className="text-2xl font-bold text-blue-900">{currentData.statistics.totalApplications}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="text-sm font-medium text-green-800">Total Placements</h4>
          <p className="text-2xl font-bold text-green-900">{currentData.statistics.totalPlacements}</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-medium text-yellow-800">Placement Rate</h4>
          <p className="text-2xl font-bold text-yellow-900">{currentData.statistics.placementRate}%</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="text-sm font-medium text-purple-800">Avg Salary</h4>
          <p className="text-2xl font-bold text-purple-900">₹{currentData.statistics.averageSalary}</p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex gap-4">
        <button
          onClick={generatePDFReport}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export PDF
        </button>
        
        <button
          onClick={generateExcelReport}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export Excel
        </button>
        
        <button
          onClick={onRefresh}
          className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Detailed Placement Records</h3>
          <p className="text-sm text-gray-600">
            Showing {currentData.placements.length} records
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentData.placements.map((placement, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {placement.studentName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {placement.studentEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {placement.companyName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {placement.jobTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      placement.status === 'PLACED' 
                        ? 'bg-green-100 text-green-800'
                        : placement.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
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
        </div>
      </div>
    </div>
  );
}