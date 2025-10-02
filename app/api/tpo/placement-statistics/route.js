import { NextResponse } from 'next/server';
import { PrismaClient } from '../../../generated/prisma/index.js';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all applications with related data
    const applications = await prisma.application.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            facultyNo: true,
            enrollmentNo: true,
            academicRecords: true
          }
        },
        job: {
          include: {
            recruiter: {
              select: {
                id: true,
                name: true,
                companyProfile: true
              }
            }
          }
        }
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Transform data for the report
    const placements = applications.map(app => {
      // Parse company profile to get company name and other details
      let companyProfile = {};
      try {
        if (app.job.recruiter.companyProfile) {
          if (typeof app.job.recruiter.companyProfile === 'string') {
            companyProfile = JSON.parse(app.job.recruiter.companyProfile);
          } else {
            companyProfile = app.job.recruiter.companyProfile;
          }
        }
      } catch (e) {
        // If JSON parsing fails, treat as plain text company name
        companyProfile = { companyName: app.job.recruiter.companyProfile };
      }

      // Parse job description to extract position and salary
      let jobDetails = {};
      let extractedPosition = 'Not Specified';
      
      try {
        if (typeof app.job.jobDescription === 'string') {
          // First try to parse as JSON
          try {
            jobDetails = JSON.parse(app.job.jobDescription);
          } catch (jsonError) {
            // Extract position from parentheses in the text
            const positionMatch = app.job.jobDescription.match(/\(([^)]+)\)/);
            if (positionMatch) {
              extractedPosition = positionMatch[1].trim();
            } else {
              // If no parentheses, check if the whole description is a position
              const cleanDescription = app.job.jobDescription.trim();
              if (cleanDescription && cleanDescription !== 'Job Apply' && cleanDescription.length < 100) {
                extractedPosition = cleanDescription;
              }
            }
            jobDetails = { description: app.job.jobDescription };
          }
        } else {
          jobDetails = app.job.jobDescription || {};
        }
      } catch (e) {
        jobDetails = { description: app.job.jobDescription };
      }

      return {
        applicationId: app.id,
        studentId: app.student.id,
        studentName: app.student.name,
        studentEmail: app.student.email,
        facultyNo: app.student.facultyNo,
        enrollmentNo: app.student.enrollmentNo,
        academicRecords: app.student.academicRecords,
        companyName: companyProfile.companyName || 
                     companyProfile.name || 
                     companyProfile.company || 
                     companyProfile.organizationName ||
                     (typeof app.job.recruiter.companyProfile === 'string' ? app.job.recruiter.companyProfile : null) ||
                     app.job.recruiter.name || 
                     'Unknown Company',
        companyProfile: companyProfile,
        jobId: app.job.id,
        jobTitle: jobDetails.title || jobDetails.position || extractedPosition,
        jobDescription: jobDetails.description || app.job.jobDescription,
        salary: jobDetails.salary || jobDetails.package || null,
        status: app.applicationStatus,
        applicationDate: app.job.applicationDeadline,
        eligibilityCriteria: app.job.eligibilityCriteria,
        approvalStatus: app.job.approvalStatus
      };
    });

    // Calculate statistics
    const totalApplications = placements.length;
    const totalPlacements = placements.filter(p => p.status === 'PLACED').length;
    const pendingApplications = placements.filter(p => p.status === 'PENDING').length;
    const rejectedApplications = placements.filter(p => p.status === 'REJECTED').length;
    
    const placementRate = totalApplications > 0 
      ? ((totalPlacements / totalApplications) * 100).toFixed(2)
      : 0;

    const companies = [...new Set(placements.map(p => p.companyName))];
    const totalCompanies = companies.length;

    // Calculate average salary for placed students
    const placedWithSalary = placements.filter(p => 
      p.status === 'PLACED' && p.salary && !isNaN(parseFloat(p.salary))
    );
    
    const averageSalary = placedWithSalary.length > 0
      ? (placedWithSalary.reduce((sum, p) => sum + parseFloat(p.salary), 0) / placedWithSalary.length).toFixed(2)
      : 0;

    // Company-wise statistics
    const companyStats = {};
    placements.forEach(placement => {
      const company = placement.companyName;
      if (!companyStats[company]) {
        companyStats[company] = {
          totalApplications: 0,
          placed: 0,
          pending: 0,
          rejected: 0,
          jobs: new Set()
        };
      }
      companyStats[company].totalApplications++;
      companyStats[company][placement.status.toLowerCase()]++;
      companyStats[company].jobs.add(placement.jobTitle);
    });

    // Convert Set to Array for jobs
    Object.keys(companyStats).forEach(company => {
      companyStats[company].jobs = Array.from(companyStats[company].jobs);
      companyStats[company].successRate = companyStats[company].totalApplications > 0
        ? ((companyStats[company].placed / companyStats[company].totalApplications) * 100).toFixed(2)
        : 0;
    });

    // Department-wise statistics (if academic records contain department info)
    const departmentStats = {};
    placements.forEach(placement => {
      let department = 'Unknown';
      try {
        if (placement.academicRecords) {
          const records = typeof placement.academicRecords === 'string'
            ? JSON.parse(placement.academicRecords)
            : placement.academicRecords;
          department = records.department || records.branch || 'Unknown';
        }
      } catch (e) {
        department = 'Unknown';
      }

      if (!departmentStats[department]) {
        departmentStats[department] = {
          totalStudents: 0,
          placed: 0,
          pending: 0,
          rejected: 0
        };
      }
      departmentStats[department].totalStudents++;
      departmentStats[department][placement.status.toLowerCase()]++;
    });

    // Add success rate for departments
    Object.keys(departmentStats).forEach(dept => {
      departmentStats[dept].placementRate = departmentStats[dept].totalStudents > 0
        ? ((departmentStats[dept].placed / departmentStats[dept].totalStudents) * 100).toFixed(2)
        : 0;
    });

    const responseData = {
      placements,
      statistics: {
        totalApplications,
        totalPlacements,
        pendingApplications,
        rejectedApplications,
        placementRate,
        totalCompanies,
        averageSalary
      },
      companyStats,
      departmentStats,
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Error fetching placement statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch placement statistics', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Optional: Add POST method for updating placement status
export async function POST(request) {
  try {
    const { applicationId, status, salary } = await request.json();

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      );
    }

    // Update application status
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { applicationStatus: status }
    });

    // If salary is provided and status is PLACED, you might want to store it
    // This would require extending the schema to include salary in Application model
    
    return NextResponse.json({
      success: true,
      application: updatedApplication
    });

  } catch (error) {
    console.error('Error updating placement status:', error);
    return NextResponse.json(
      { error: 'Failed to update placement status', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}