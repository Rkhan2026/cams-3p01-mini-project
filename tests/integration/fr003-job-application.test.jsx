import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import React from "react";
import ApplicationCard from "@/components/dashboard/student/ApplicationCard.jsx";
import JobApplicationActions from "@/components/dashboard/student/JobApplicationActions.jsx";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

// Mock UI components that are simple
vi.mock("@/components/ui/Badge.jsx", () => ({
  default: ({ children, status }) => (
    <span data-testid="badge" data-status={status}>
      {children}
    </span>
  ),
}));

// Setup global fetch interceptor for relative URLs
const originalFetch = global.fetch;
global.fetch = vi.fn((url, options) => {
  if (typeof url === "string" && url.startsWith("/")) {
    url = `http://localhost:3000${url}`;
  }
  return originalFetch(url, options);
});

describe("FR-003: Job Application and Tracking Integration Tests", () => {
  const mockPush = vi.fn();

  // Setup mocks and clean data before each test
  beforeEach(async () => {
    vi.clearAllMocks();
    useRouter.mockReturnValue({
      push: mockPush,
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    });
    global.fetch.mockClear();

    // Clean up test data before each test to ensure isolation
    try {
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
      console.log('Pre-test cleanup error:', error.message);
    }
  });

  afterEach(async () => {
    // Cleanup all test data after each test as well
    try {
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
      console.log('Post-test cleanup error:', error.message);
    }
  });

  describe("Job Application Submission", () => {
    it("should test JobApplicationActions component and create application", async () => {
      const user = userEvent.setup();

      // Create approved student, recruiter, and job
      const student = await prisma.student.create({
        data: {
          name: "Test Student",
          email: `student${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
        },
      });

      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Test Recruiter",
          email: `recruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Test Company",
          accountStatus: "APPROVED",
        },
      });

      const job = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Software Developer (Full Stack) - Great opportunity",
          eligibilityCriteria: "Computer Science background required",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      // Test JobApplicationActions component
      const mockOnApply = vi.fn();
      const mockOnViewApplications = vi.fn();

      render(
        <JobApplicationActions
          hasApplied={false}
          deadlinePassed={false}
          applying={false}
          onApply={mockOnApply}
          onViewApplications={mockOnViewApplications}
        />
      );

      // Verify "Apply for this Job" button exists and is enabled
      const applyButton = screen.getByRole("button", {
        name: /apply for this job/i,
      });
      expect(applyButton).not.toBeDisabled();

      // Test button click
      await user.click(applyButton);
      expect(mockOnApply).toHaveBeenCalled();

      // Create application directly via API (real integration)
      const applicationData = {
        jobId: job.id,
      };

      // Note: In real scenario, this would need proper session/auth
      // For test, we create the application directly via Prisma
      const createdApplication = await prisma.application.create({
        data: {
          jobId: job.id,
          studentId: student.id,
          applicationStatus: "APPLIED",
        },
        include: {
          job: {
            include: {
              recruiter: true,
            },
          },
          student: true,
        },
      });

      // Verify application was created successfully
      expect(createdApplication).toBeTruthy();
      expect(createdApplication.applicationStatus).toBe("APPLIED");
      expect(createdApplication.jobId).toBe(job.id);
      expect(createdApplication.studentId).toBe(student.id);
    });

    it("should display application status using ApplicationCard component", async () => {
      // Create student, recruiter, job, and existing application
      const student = await prisma.student.create({
        data: {
          name: "Test Student",
          email: `student${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
        },
      });

      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Test Recruiter",
          email: `recruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Test Company",
          accountStatus: "APPROVED",
        },
      });

      const job = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Application Status Test Job (Software Engineer)",
          eligibilityCriteria: "CS background",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      // Create existing application
      const application = await prisma.application.create({
        data: {
          jobId: job.id,
          studentId: student.id,
          applicationStatus: "APPLIED",
        },
      });

      const mockOnViewDetails = vi.fn();
      const mockOnWithdraw = vi.fn();

      // Test ApplicationCard component with real application data
      render(
        <ApplicationCard
          application={{
            id: application.id,
            applicationStatus: "APPLIED",
            appliedAt: new Date().toISOString(),
            job: {
              id: job.id,
              jobDescription: job.jobDescription,
              applicationDeadline: job.applicationDeadline.toISOString(),
              recruiter: {
                name: recruiter.name,
                companyProfile: recruiter.companyProfile,
              },
            },
          }}
          onViewDetails={mockOnViewDetails}
          onWithdraw={mockOnWithdraw}
        />
      );

      // Verify application status is displayed
      expect(screen.getByText("Applied")).toBeInTheDocument();
      expect(screen.getByText("Software Engineer")).toBeInTheDocument();
      expect(screen.getByText(recruiter.name)).toBeInTheDocument();

      // Test view details button
      const viewDetailsButton = screen.getByRole("button", {
        name: /view job details/i,
      });
      expect(viewDetailsButton).toBeInTheDocument();

      const user = userEvent.setup();
      await user.click(viewDetailsButton);
      expect(mockOnViewDetails).toHaveBeenCalled();
    });

    it("should handle expired job deadline using JobApplicationActions", async () => {
      // Test JobApplicationActions component with expired deadline
      const mockOnApply = vi.fn();
      const mockOnViewApplications = vi.fn();

      render(
        <JobApplicationActions
          hasApplied={false}
          deadlinePassed={true} // Deadline has passed
          applying={false}
          onApply={mockOnApply}
          onViewApplications={mockOnViewApplications}
        />
      );

      // Verify that apply button is not shown when deadline has passed
      const applyButton = screen.queryByRole("button", { name: /apply for this job/i });
      expect(applyButton).toBeNull();

      // Verify that "View My Applications" button is still available
      const viewApplicationsButton = screen.getByRole("button", {
        name: /view my applications/i,
      });
      expect(viewApplicationsButton).toBeInTheDocument();

      const user = userEvent.setup();
      await user.click(viewApplicationsButton);
      expect(mockOnViewApplications).toHaveBeenCalled();
    });
  });

  describe("Application Status Tracking", () => {
    it("should display SHORTLISTED status using ApplicationCard component", async () => {
      // Create application
      const student = await prisma.student.create({
        data: {
          name: "Test Student",
          email: `student${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
        },
      });

      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Test Recruiter",
          email: `recruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Test Company",
          accountStatus: "APPROVED",
        },
      });

      const job = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Status Update Test Job (Backend Developer)",
          eligibilityCriteria: "Test criteria",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      const application = await prisma.application.create({
        data: {
          jobId: job.id,
          studentId: student.id,
          applicationStatus: "APPLIED",
        },
      });

      // Simulate recruiter updating status to SHORTLISTED
      const updatedApplication = await prisma.application.update({
        where: { id: application.id },
        data: { applicationStatus: "SHORTLISTED" },
      });

      expect(updatedApplication.applicationStatus).toBe("SHORTLISTED");

      // Test ApplicationCard with SHORTLISTED status
      const mockOnViewDetails = vi.fn();

      render(
        <ApplicationCard
          application={{
            id: updatedApplication.id,
            applicationStatus: "SHORTLISTED",
            appliedAt: new Date().toISOString(),
            job: {
              id: job.id,
              jobDescription: job.jobDescription,
              applicationDeadline: job.applicationDeadline.toISOString(),
              recruiter: {
                name: recruiter.name,
                companyProfile: recruiter.companyProfile,
              },
            },
          }}
          onViewDetails={mockOnViewDetails}
          onWithdraw={vi.fn()}
        />
      );

      // Verify SHORTLISTED status is displayed
      expect(screen.getByText("Shortlisted")).toBeInTheDocument();
      expect(screen.getByText("Backend Developer")).toBeInTheDocument();
      expect(
        screen.getByText(
          "You're on the shortlist! The recruiter may reach out soon."
        )
      ).toBeInTheDocument();
    });

    it("should display INTERVIEW_SCHEDULED status using ApplicationCard component", async () => {
      // Create application
      const student = await prisma.student.create({
        data: {
          name: "Interview Student",
          email: `student${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
        },
      });

      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Interview Recruiter",
          email: `recruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Interview Company",
          accountStatus: "APPROVED",
        },
      });

      const job = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Interview Test Job (Frontend Developer)",
          eligibilityCriteria: "Interview criteria",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      const application = await prisma.application.create({
        data: {
          jobId: job.id,
          studentId: student.id,
          applicationStatus: "SHORTLISTED",
        },
      });

      // Simulate recruiter scheduling interview
      const interviewApplication = await prisma.application.update({
        where: { id: application.id },
        data: { applicationStatus: "INTERVIEW_SCHEDULED" },
      });

      expect(interviewApplication.applicationStatus).toBe(
        "INTERVIEW_SCHEDULED"
      );

      // Test ApplicationCard with INTERVIEW_SCHEDULED status
      const mockOnViewDetails = vi.fn();

      render(
        <ApplicationCard
          application={{
            id: interviewApplication.id,
            applicationStatus: "INTERVIEW_SCHEDULED",
            appliedAt: new Date().toISOString(),
            job: {
              id: job.id,
              jobDescription: job.jobDescription,
              applicationDeadline: job.applicationDeadline.toISOString(),
              recruiter: {
                name: recruiter.name,
                companyProfile: recruiter.companyProfile,
              },
            },
          }}
          onViewDetails={mockOnViewDetails}
          onWithdraw={vi.fn()}
        />
      );

      // Verify INTERVIEW_SCHEDULED status is displayed
      expect(screen.getByText("Interview")).toBeInTheDocument();
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(
        screen.getByText("Interview scheduled! Check your email for details.")
      ).toBeInTheDocument();
    });

    it("should display HIRED status using ApplicationCard component", async () => {
      // Create application
      const student = await prisma.student.create({
        data: {
          name: "Hired Student",
          email: `student${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
        },
      });

      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Hiring Recruiter",
          email: `recruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Hiring Company",
          accountStatus: "APPROVED",
        },
      });

      const job = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Hiring Test Job (Full Stack Developer)",
          eligibilityCriteria: "Hiring criteria",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      const application = await prisma.application.create({
        data: {
          jobId: job.id,
          studentId: student.id,
          applicationStatus: "INTERVIEW_SCHEDULED",
        },
      });

      // Simulate recruiter hiring the student
      const hiredApplication = await prisma.application.update({
        where: { id: application.id },
        data: { applicationStatus: "HIRED" },
      });

      expect(hiredApplication.applicationStatus).toBe("HIRED");

      // Verify placement workflow data integrity
      const finalApplication = await prisma.application.findUnique({
        where: { id: application.id },
        include: {
          student: true,
          job: {
            include: {
              recruiter: true,
            },
          },
        },
      });

      expect(finalApplication.applicationStatus).toBe("HIRED");
      expect(finalApplication.student.name).toBe("Hired Student");
      expect(finalApplication.job.recruiter.name).toBe("Hiring Recruiter");

      // Test ApplicationCard with HIRED status
      const mockOnViewDetails = vi.fn();

      render(
        <ApplicationCard
          application={{
            id: hiredApplication.id,
            applicationStatus: "HIRED",
            appliedAt: new Date().toISOString(),
            job: {
              id: job.id,
              jobDescription: job.jobDescription,
              applicationDeadline: job.applicationDeadline.toISOString(),
              recruiter: {
                name: recruiter.name,
                companyProfile: recruiter.companyProfile,
              },
            },
          }}
          onViewDetails={mockOnViewDetails}
          onWithdraw={vi.fn()}
        />
      );

      // Verify HIRED status is displayed
      expect(screen.getByText("Hired")).toBeInTheDocument();
      expect(screen.getByText("Full Stack Developer")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Congratulations, you got the job! The recruiter will be in touch."
        )
      ).toBeInTheDocument();
    });
  });

  describe("Student Application Dashboard", () => {
    it("should display multiple applications using ApplicationCard components", async () => {
      // Create student with multiple applications
      const student = await prisma.student.create({
        data: {
          name: "Dashboard Student",
          email: `student${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          accountStatus: "APPROVED",
        },
      });

      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Dashboard Recruiter",
          email: `recruiter${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Dashboard Company",
          accountStatus: "APPROVED",
        },
      });

      // Create multiple jobs and applications
      const job1 = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Dashboard Job 1 (Frontend Developer)",
          eligibilityCriteria: "Frontend skills",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      const job2 = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Dashboard Job 2 (Backend Developer)",
          eligibilityCriteria: "Backend skills",
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      const app1 = await prisma.application.create({
        data: {
          jobId: job1.id,
          studentId: student.id,
          applicationStatus: "APPLIED",
        },
      });

      const app2 = await prisma.application.create({
        data: {
          jobId: job2.id,
          studentId: student.id,
          applicationStatus: "SHORTLISTED",
        },
      });

      // Verify applications were created with correct statuses
      const applications = await prisma.application.findMany({
        where: { studentId: student.id },
        include: {
          job: {
            include: {
              recruiter: true,
            },
          },
        },
      });

      expect(applications).toHaveLength(2);
      expect(
        applications.find((app) => app.job.jobDescription.includes("Frontend"))
          .applicationStatus
      ).toBe("APPLIED");
      expect(
        applications.find((app) => app.job.jobDescription.includes("Backend"))
          .applicationStatus
      ).toBe("SHORTLISTED");

      // Test rendering multiple ApplicationCard components
      const mockOnViewDetails = vi.fn();

      const { container } = render(
        <div>
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={{
                id: application.id,
                applicationStatus: application.applicationStatus,
                appliedAt: new Date().toISOString(),
                job: {
                  id: application.job.id,
                  jobDescription: application.job.jobDescription,
                  applicationDeadline:
                    application.job.applicationDeadline.toISOString(),
                  recruiter: {
                    name: application.job.recruiter.name,
                    companyProfile: application.job.recruiter.companyProfile,
                  },
                },
              }}
              onViewDetails={mockOnViewDetails}
              onWithdraw={vi.fn()}
            />
          ))}
        </div>
      );

      // Verify both applications are displayed
      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.getByText("Backend Developer")).toBeInTheDocument();
      expect(screen.getByText("Applied")).toBeInTheDocument();
      expect(screen.getByText("Shortlisted")).toBeInTheDocument();

      // Verify both have view details buttons
      const viewDetailsButtons = screen.getAllByRole("button", {
        name: /view job details/i,
      });
      expect(viewDetailsButtons).toHaveLength(2);
    });
  });
});
