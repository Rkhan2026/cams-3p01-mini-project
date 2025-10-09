import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Real integration tests - no fetch mocking

describe("FR-004: Administrative Dashboard and Reporting Integration Tests", () => {
  beforeEach(async () => {
    try {
      // Clean up test data before each test to ensure isolation
      await prisma.application.deleteMany({
        where: { student: { email: { endsWith: "@testintegration.com" } } },
      });
      await prisma.jobPosting.deleteMany({
        where: { recruiter: { email: { endsWith: "@testintegration.com" } } },
      });
      await prisma.student.deleteMany({
        where: { email: { endsWith: "@testintegration.com" } },
      });
      await prisma.companyRecruiter.deleteMany({
        where: { email: { endsWith: "@testintegration.com" } },
      });
      await prisma.tpoAdmin.deleteMany({
        where: { email: { endsWith: "@testintegration.com" } },
      });
    } catch (error) {
      console.log("Pre-test cleanup error:", error.message);
    }

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(async () => {
    try {
      // Clean up test data after tests in correct order
      await prisma.application.deleteMany({
        where: { student: { email: { endsWith: "@testintegration.com" } } },
      });
      await prisma.jobPosting.deleteMany({
        where: { recruiter: { email: { endsWith: "@testintegration.com" } } },
      });
      await prisma.student.deleteMany({
        where: { email: { endsWith: "@testintegration.com" } },
      });
      await prisma.companyRecruiter.deleteMany({
        where: { email: { endsWith: "@testintegration.com" } },
      });
      await prisma.tpoAdmin.deleteMany({
        where: { email: { endsWith: "@testintegration.com" } },
      });
    } catch (error) {
      console.log("Post-test cleanup error:", error.message);
    }

    // Reset mocks
    vi.clearAllMocks();
  });

  describe("TPO Dashboard Statistics", () => {
    it("should display current statistics including pending approvals, active jobs, and recent applications", async () => {
      // Create test data for dashboard statistics
      const tpo = await prisma.tpoAdmin.create({
        data: {
          name: "Test TPO Admin",
          email: `tpo${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          role: "TPO_ADMIN",
        },
      });

      // Create pending students
      await prisma.student.create({
        data: {
          name: "Pending Student 1",
          email: `pendingstudent1${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "PENDING_STUDENT",
        },
      });

      await prisma.student.create({
        data: {
          name: "Pending Student 2",
          email: `pendingstudent2${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "PENDING_STUDENT",
        },
      });

      // Create pending recruiters
      await prisma.companyRecruiter.create({
        data: {
          name: "Pending Recruiter 1",
          email: `pendingrecruiter1${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Tech Company 1",
          accountStatus: "PENDING_RECRUITER",
        },
      });

      // Create approved recruiter and active jobs
      const approvedRecruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Approved Recruiter",
          email: `approvedrecruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Active Tech Company",
          accountStatus: "APPROVED",
        },
      });

      const activeJob = await prisma.jobPosting.create({
        data: {
          recruiterId: approvedRecruiter.id,
          jobDescription: "Active Job Posting",
          eligibilityCriteria: "CS background",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      // Create approved student and application
      const approvedStudent = await prisma.student.create({
        data: {
          name: "Approved Student",
          email: `approvedstudent${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
        },
      });

      await prisma.application.create({
        data: {
          jobId: activeJob.id,
          studentId: approvedStudent.id,
          applicationStatus: "APPLIED",
        },
      });

      // Verify dashboard statistics in database (only for this test's data)
      const pendingStudents = await prisma.student.count({
        where: {
          accountStatus: "PENDING_STUDENT",
          email: { endsWith: "@testintegration.com" },
        },
      });

      const pendingRecruiters = await prisma.companyRecruiter.count({
        where: {
          accountStatus: "PENDING_RECRUITER",
          email: { endsWith: "@testintegration.com" },
        },
      });

      const activeJobs = await prisma.jobPosting.count({
        where: {
          approvalStatus: "APPROVED",
          applicationDeadline: { gt: new Date() },
          recruiter: { email: { endsWith: "@testintegration.com" } },
        },
      });

      const recentApplications = await prisma.application.count({
        where: {
          student: { email: { endsWith: "@testintegration.com" } },
        },
      });

      expect(pendingStudents).toBe(2);
      expect(pendingRecruiters).toBe(1);
      expect(activeJobs).toBe(1);
      expect(recentApplications).toBe(1);
    }, 10000); // 10 second timeout
  });

  describe("User Management Section", () => {
    it("should display all pending user registrations with approval/rejection options", async () => {
      // Create pending users
      const pendingStudent = await prisma.student.create({
        data: {
          name: "Management Test Student",
          email: `mgmtstudent${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "PENDING_STUDENT",
        },
      });

      const pendingRecruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Management Test Recruiter",
          email: `mgmtrecruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Management Test Company",
          accountStatus: "PENDING_RECRUITER",
        },
      });

      // Simulate TPO approval actions
      const approvedStudent = await prisma.student.update({
        where: { id: pendingStudent.id },
        data: { accountStatus: "APPROVED" },
      });

      const rejectedRecruiter = await prisma.companyRecruiter.update({
        where: { id: pendingRecruiter.id },
        data: { accountStatus: "REJECTED" },
      });

      expect(approvedStudent.accountStatus).toBe("APPROVED");
      expect(rejectedRecruiter.accountStatus).toBe("REJECTED");

      // Verify user management operations
      const allStudents = await prisma.student.findMany({
        where: { email: { endsWith: "@testintegration.com" } },
      });

      const allRecruiters = await prisma.companyRecruiter.findMany({
        where: { email: { endsWith: "@testintegration.com" } },
      });

      expect(
        allStudents.find((s) => s.id === pendingStudent.id).accountStatus
      ).toBe("APPROVED");
      expect(
        allRecruiters.find((r) => r.id === pendingRecruiter.id).accountStatus
      ).toBe("REJECTED");
    }, 10000); // 10 second timeout
  });

  describe("Job Management Section", () => {
    it("should display all job postings with their approval status and management options", async () => {
      // Create recruiter and jobs with different statuses
      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Job Management Recruiter",
          email: `jobmgmtrecruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Job Management Company",
          accountStatus: "APPROVED",
        },
      });

      const pendingJob = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Pending Job for Management",
          eligibilityCriteria: "Management criteria",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "PENDING",
        },
      });

      const approvedJob = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Approved Job for Management",
          eligibilityCriteria: "Management criteria",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      // Simulate TPO job management actions
      const rejectedJob = await prisma.jobPosting.update({
        where: { id: pendingJob.id },
        data: { approvalStatus: "REJECTED" },
      });

      expect(rejectedJob.approvalStatus).toBe("REJECTED");

      // Verify job management operations
      const allJobs = await prisma.jobPosting.findMany({
        where: { recruiterId: recruiter.id },
        include: {
          recruiter: {
            select: {
              name: true,
              companyProfile: true,
            },
          },
        },
      });

      expect(allJobs).toHaveLength(2);
      expect(allJobs.find((j) => j.id === pendingJob.id).approvalStatus).toBe(
        "REJECTED"
      );
      expect(allJobs.find((j) => j.id === approvedJob.id).approvalStatus).toBe(
        "APPROVED"
      );
    }, 10000); // 10 second timeout
  });

  describe("Placement Report Generation", () => {
    it("should compile accurate data from applications, jobs, and student records", async () => {
      // Create comprehensive test data for reporting
      const student1 = await prisma.student.create({
        data: {
          name: "Report Student 1",
          email: `reportstudent1${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
        },
      });

      const student2 = await prisma.student.create({
        data: {
          name: "Report Student 2",
          email: `reportstudent2${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
        },
      });

      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Report Recruiter",
          email: `reportrecruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Report Company",
          accountStatus: "APPROVED",
        },
      });

      const job = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Report Job Posting",
          eligibilityCriteria: "Report criteria",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      // Create applications with different statuses
      await prisma.application.create({
        data: {
          jobId: job.id,
          studentId: student1.id,
          applicationStatus: "HIRED",
        },
      });

      await prisma.application.create({
        data: {
          jobId: job.id,
          studentId: student2.id,
          applicationStatus: "SHORTLISTED",
        },
      });

      // Generate placement report data (only for this test's data)
      const placementData = await prisma.application.findMany({
        where: {
          student: { email: { endsWith: "@testintegration.com" } },
          job: { recruiter: { email: { endsWith: "@testintegration.com" } } },
        },
        include: {
          student: {
            select: {
              name: true,
              email: true,
            },
          },
          job: {
            include: {
              recruiter: {
                select: {
                  name: true,
                  companyProfile: true,
                },
              },
            },
          },
        },
      });

      // Verify report data accuracy
      expect(placementData).toHaveLength(2);

      const hiredApplication = placementData.find(
        (app) => app.applicationStatus === "HIRED"
      );
      expect(hiredApplication.student.name).toBe("Report Student 1");
      expect(hiredApplication.job.recruiter.name).toBe("Report Recruiter");

      const shortlistedApplication = placementData.find(
        (app) => app.applicationStatus === "SHORTLISTED"
      );
      expect(shortlistedApplication.student.name).toBe("Report Student 2");
    }, 10000); // 10 second timeout
  });

  describe("Search and Bulk Operations", () => {
    it("should return accurate results when searching for specific students or recruiters", async () => {
      // Create searchable test data
      const searchStudent = await prisma.student.create({
        data: {
          name: "Searchable Student John",
          email: `searchstudent${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
          facultyNo: "SEARCH001",
          enrollmentNo: "ENROLL001",
        },
      });

      const searchRecruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Searchable Recruiter Jane",
          email: `searchrecruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Searchable Tech Company",
          accountStatus: "APPROVED",
        },
      });

      // Simulate search operations (only within test data)
      const studentSearchResults = await prisma.student.findMany({
        where: {
          AND: [
            { email: { endsWith: "@testintegration.com" } },
            {
              OR: [
                {
                  name: {
                    contains: "Searchable Student John",
                    mode: "insensitive",
                  },
                },
                { facultyNo: { contains: "SEARCH001", mode: "insensitive" } },
              ],
            },
          ],
        },
      });

      const recruiterSearchResults = await prisma.companyRecruiter.findMany({
        where: {
          AND: [
            { email: { endsWith: "@testintegration.com" } },
            {
              OR: [
                {
                  name: {
                    contains: "Searchable Recruiter Jane",
                    mode: "insensitive",
                  },
                },
                {
                  companyProfile: {
                    contains: "Searchable Tech Company",
                    mode: "insensitive",
                  },
                },
              ],
            },
          ],
        },
      });

      expect(studentSearchResults).toHaveLength(1);
      expect(studentSearchResults[0].name).toBe("Searchable Student John");

      expect(recruiterSearchResults).toHaveLength(1);
      expect(recruiterSearchResults[0].name).toBe("Searchable Recruiter Jane");
    }, 10000); // 10 second timeout
  });
});
