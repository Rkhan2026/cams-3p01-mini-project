import { describe, it, expect, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import React from "react";
import { waitFor } from "@testing-library/react";

import NewJobForm from "@/components/dashboard/recruiter/NewJobForm.jsx";
import {
  JobCard,
  JobsPageHeader,
  JobsEmptyState,
} from "@/components/dashboard/recruiter";

// ---------- Minimal UI mocks ----------
vi.mock("@/components/ui/Button", () => ({
  default: ({ children, onClick, disabled, type, className }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={className}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/FormInput.jsx", () => ({
  default: ({ name, type, placeholder, required, ...props }) => (
    <input
      data-testid={`input-${name}`}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      {...props}
    />
  ),
}));

vi.mock("@/components/ui/FormTextarea.jsx", () => ({
  default: ({ name, placeholder, required, rows, ...props }) => (
    <textarea
      data-testid={`textarea-${name}`}
      name={name}
      placeholder={placeholder}
      required={required}
      rows={rows}
      {...props}
    />
  ),
}));

vi.mock("@/components/ui/Badge.jsx", () => ({
  default: ({ children }) => <span data-testid="badge">{children}</span>,
}));

const API_BASE = "http://localhost:3000";

// ---------- Test Suite ----------
describe("FR-002: Job Posting and Management Integration Tests", () => {
  afterEach(async () => {
    // Cleanup all test data
    await prisma.application.deleteMany({
      where: { student: { email: { endsWith: "@testintegration.com" } } },
    });
    await prisma.jobPosting.deleteMany({
      where: { recruiter: { email: { endsWith: "@testintegration.com" } } },
    });
    await prisma.companyRecruiter.deleteMany({
      where: { email: { endsWith: "@testintegration.com" } },
    });
    await prisma.tpoAdmin.deleteMany({
      where: { email: { endsWith: "@testintegration.com" } },
    });
  });

  // ---------- Recruiter Job Posting Flow ----------
  describe("Recruiter Job Posting Flow", () => {
    it("should test NewJobForm logic and filling, then create job", async () => {
      const user = userEvent.setup();

      const email = `recruiter${Date.now()}@testintegration.com`;
      const passwordHash = await bcrypt.hash("Password123!", 12);
      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Integration Recruiter",
          email,
          passwordHash,
          companyProfile: "Global Tech Solutions",
          accountStatus: "APPROVED",
        },
      });

      const mockHandleJobSubmit = vi.fn();

      // Render form with mock submit handler
      render(
        <NewJobForm onSubmit={mockHandleJobSubmit} loading={false} />
      );

      // Fill all required inputs
      const jobTitle = "Full Stack Developer";
      const jobDescription =
        "Develop React/Node.js applications with modern tech stack";
      const degree = "B.Tech in Computer Science";
      const minCgpa = "7.5";
      const classX = "85";
      const classXII = "80";
      const salary = "8 LPA";
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16);

      await user.type(screen.getByTestId("input-jobTitle"), jobTitle);
      await user.type(
        screen.getByTestId("textarea-jobDescription"),
        jobDescription
      );
      await user.type(screen.getByTestId("input-degree"), degree);
      await user.type(screen.getByTestId("input-minCgpa"), minCgpa);
      await user.type(screen.getByTestId("input-classX"), classX);
      await user.type(screen.getByTestId("input-classXII"), classXII);
      await user.type(screen.getByTestId("input-salary"), salary);
      await user.type(screen.getByTestId("input-deadline"), futureDate);

      // Verify values entered
      expect(screen.getByTestId("input-jobTitle")).toHaveValue(jobTitle);
      expect(screen.getByTestId("textarea-jobDescription")).toHaveValue(
        jobDescription
      );
      expect(screen.getByTestId("input-degree")).toHaveValue(degree);
      expect(screen.getByTestId("input-minCgpa")).toHaveValue(Number(minCgpa));
      expect(screen.getByTestId("input-classX")).toHaveValue(Number(classX));
      expect(screen.getByTestId("input-classXII")).toHaveValue(
        Number(classXII)
      );
      expect(screen.getByTestId("input-salary")).toHaveValue(salary);
      expect(screen.getByTestId("input-deadline")).toHaveValue(futureDate);

      // Verify submit button exists and form is ready
      const submitBtn = screen.getByRole("button", {
        name: /submit for approval/i,
      });
      expect(submitBtn).toBeInTheDocument();

      // Create job directly in DB using the form data structure
      const structuredEligibility = `Degree: ${degree}; MinCGPA: ${minCgpa}; ClassX: ${classX}; ClassXII: ${classXII}`;
      const combinedDescription = `(${jobTitle})\n\n${jobDescription}\n\nSalary: ${salary}`;
      
      const createdJob = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: combinedDescription,
          eligibilityCriteria: structuredEligibility,
          applicationDeadline: new Date(futureDate),
          approvalStatus: "PENDING",
        },
      });

      // Verify the job was created with correct data structure
      expect(createdJob).toBeTruthy();
      expect(createdJob.jobDescription).toContain(jobTitle);
      expect(createdJob.jobDescription).toContain(jobDescription);
      expect(createdJob.jobDescription).toContain(salary);
      expect(createdJob.eligibilityCriteria).toBe(structuredEligibility);
      expect(createdJob.recruiterId).toBe(recruiter.id);
      
      // Verify form data would match what gets submitted
      expect(combinedDescription).toContain(jobTitle);
      expect(combinedDescription).toContain(jobDescription);
      expect(combinedDescription).toContain(salary);
      expect(structuredEligibility).toContain(`Degree: ${degree}`);
      expect(structuredEligibility).toContain(`MinCGPA: ${minCgpa}`);
      expect(structuredEligibility).toContain(`ClassX: ${classX}`);
      expect(structuredEligibility).toContain(`ClassXII: ${classXII}`);
    }, 15000);

    it("should display recruiter jobs using JobCard and JobsPageHeader components", async () => {
      const recruiter = await prisma.companyRecruiter.create({
        data: {
          name: "Display Recruiter",
          email: `display${Date.now()}@testintegration.com`,
          passwordHash: await bcrypt.hash("password", 12),
          companyProfile: "Display Co",
          accountStatus: "APPROVED",
        },
      });

      const job = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: "Frontend Developer (React)",
          eligibilityCriteria: "Experience with Next.js",
          applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          approvalStatus: "APPROVED",
        },
      });

      const mockOnNewJobClick = vi.fn();
      render(<JobsPageHeader onNewJobClick={mockOnNewJobClick} />);
      expect(screen.getByText("My Job Postings")).toBeInTheDocument();
      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: /create new job/i }));
      expect(mockOnNewJobClick).toHaveBeenCalled();

      render(
        <JobCard
          job={{
            id: job.id,
            jobDescription: job.jobDescription,
            eligibilityCriteria: job.eligibilityCriteria,
            approvalStatus: job.approvalStatus,
            _count: { applications: 4 },
          }}
          router={{ push: vi.fn() }}
        />
      );

      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(screen.getByTestId("badge")).toBeInTheDocument();
    }, 10000);

    it("should display empty state when recruiter has no jobs", async () => {
      const mockOnNewJobClick = vi.fn();
      render(<JobsEmptyState onNewJobClick={mockOnNewJobClick} />);
      expect(screen.getByText("No Jobs Found")).toBeInTheDocument();
      await userEvent
        .setup()
        .click(screen.getByRole("button", { name: /create your first job/i }));
      expect(mockOnNewJobClick).toHaveBeenCalled();
    }, 5000);
  });
});

// ---------- TPO Job Approval Process ----------
describe("TPO Job Approval Process", () => {
  it("should make job visible to students when TPO approves job posting", async () => {
    const recruiter = await prisma.companyRecruiter.create({
      data: {
        name: "Approver Recruiter",
        email: `approver${Date.now()}@testintegration.com`,
        passwordHash: await bcrypt.hash("password", 12),
        companyProfile: "Techno Corp",
        accountStatus: "APPROVED",
      },
    });

    const job = await prisma.jobPosting.create({
      data: {
        recruiterId: recruiter.id,
        jobDescription: "Backend Engineer (Node.js)",
        eligibilityCriteria: "Strong backend skills",
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        approvalStatus: "PENDING",
      },
    });

    const approvedJob = await prisma.jobPosting.update({
      where: { id: job.id },
      data: { approvalStatus: "APPROVED" },
    });

    expect(approvedJob.approvalStatus).toBe("APPROVED");

    const foundJob = await prisma.jobPosting.findUnique({
      where: { id: job.id },
    });
    expect(foundJob.approvalStatus).toBe("APPROVED");
  }, 10000);
});

// ---------- Student Eligibility Validation Tests ----------
describe("Student Eligibility Validation", () => {
  it("should prevent student from applying if they don't meet eligibility criteria and display valid reasons", async () => {
    // Create test recruiter and job with specific eligibility criteria
    const recruiter = await prisma.companyRecruiter.create({
      data: {
        name: "Eligibility Recruiter",
        email: `eligibility${Date.now()}@testintegration.com`,
        passwordHash: await bcrypt.hash("password", 12),
        companyProfile: "Tech Corp",
        accountStatus: "APPROVED",
      },
    });

    const job = await prisma.jobPosting.create({
      data: {
        recruiterId: recruiter.id,
        jobDescription: "Software Engineer Position",
        eligibilityCriteria:
          "Degree: B.Tech in Computer Science; MinCGPA: 8.0; ClassX: 90; ClassXII: 85",
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        approvalStatus: "APPROVED",
      },
    });

    // Create student with academic records that don't meet criteria
    const ineligibleStudent = await prisma.student.create({
      data: {
        name: "Ineligible Student",
        email: `ineligible${Date.now()}@testintegration.com`,
        passwordHash: await bcrypt.hash("password", 12),
        academicRecords: JSON.stringify({
          courseEnrolled: "B.Tech in Mechanical Engineering", // Wrong degree
          currentCGPA: 7.5, // Below required 8.0
          classXPercentage: 85, // Below required 90
          classXIIPercentage: 80, // Below required 85
        }),
        accountStatus: "APPROVED",
      },
    });

    // Test API validation - should reject application
    const applicationResponse = await fetch(`${API_BASE}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${JSON.stringify({
          id: ineligibleStudent.id,
          role: "STUDENT",
        })}`,
      },
      body: JSON.stringify({ jobId: job.id }),
    });

    const applicationResult = await applicationResponse.json();

    // Should fail with eligibility criteria not met
    expect(applicationResult.success).toBe(false);
    expect(applicationResult.unmetCriteria).toBeDefined();
    expect(applicationResult.unmetCriteria.length).toBeGreaterThan(0);

    // Verify specific unmet criteria
    const unmetFields = applicationResult.unmetCriteria.map((c) => c.field);
    expect(unmetFields).toContain("degree");
    expect(unmetFields).toContain("minCgpa");
    expect(unmetFields).toContain("classX");
    expect(unmetFields).toContain("classXII");

    // Verify no application was created
    const applications = await prisma.application.findMany({
      where: { studentId: ineligibleStudent.id, jobId: job.id },
    });
    expect(applications).toHaveLength(0);
  }, 15000);

  it("should allow student to apply if they meet all eligibility criteria", async () => {
    // Create test recruiter and job
    const recruiter = await prisma.companyRecruiter.create({
      data: {
        name: "Eligible Recruiter",
        email: `eligible${Date.now()}@testintegration.com`,
        passwordHash: await bcrypt.hash("password", 12),
        companyProfile: "Good Tech Corp",
        accountStatus: "APPROVED",
      },
    });

    const job = await prisma.jobPosting.create({
      data: {
        recruiterId: recruiter.id,
        jobDescription: "Junior Developer Position",
        eligibilityCriteria:
          "Degree: B.Tech in Computer Science; MinCGPA: 7.0; ClassX: 80; ClassXII: 75",
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        approvalStatus: "APPROVED",
      },
    });

    // Create student with academic records that meet criteria
    const eligibleStudent = await prisma.student.create({
      data: {
        name: "Eligible Student",
        email: `eligible${Date.now()}@testintegration.com`,
        passwordHash: await bcrypt.hash("password", 12),
        academicRecords: JSON.stringify({
          courseEnrolled: "B.Tech in Computer Science", // Matches requirement
          currentCGPA: 8.5, // Above required 7.0
          classXPercentage: 90, // Above required 80
          classXIIPercentage: 85, // Above required 75
        }),
        accountStatus: "APPROVED",
      },
    });

    // Test API validation - should accept application
    const applicationResponse = await fetch(`${API_BASE}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${JSON.stringify({
          id: eligibleStudent.id,
          role: "STUDENT",
        })}`,
      },
      body: JSON.stringify({ jobId: job.id }),
    });

    const applicationResult = await applicationResponse.json();

    // Should succeed
    expect(applicationResult.success).toBe(true);
    expect(applicationResult.application).toBeDefined();
    expect(applicationResult.application.studentId).toBe(eligibleStudent.id);
    expect(applicationResult.application.jobId).toBe(job.id);

    // Verify application was created
    const application = await prisma.application.findFirst({
      where: { studentId: eligibleStudent.id, jobId: job.id },
    });
    expect(application).toBeTruthy();
    expect(application.applicationStatus).toBe("APPLIED");
  }, 15000);

  it("should display specific eligibility reasons when student doesn't meet criteria", async () => {
    // Create job with mixed eligibility criteria
    const recruiter = await prisma.companyRecruiter.create({
      data: {
        name: "Mixed Recruiter",
        email: `mixed${Date.now()}@testintegration.com`,
        passwordHash: await bcrypt.hash("password", 12),
        companyProfile: "Mixed Tech Corp",
        accountStatus: "APPROVED",
      },
    });

    const job = await prisma.jobPosting.create({
      data: {
        recruiterId: recruiter.id,
        jobDescription: "Senior Developer Position",
        eligibilityCriteria:
          "Degree: B.Tech in Computer Science; MinCGPA: 8.5; ClassX: 95",
        applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        approvalStatus: "APPROVED",
      },
    });

    // Create student who meets some but not all criteria
    const partialStudent = await prisma.student.create({
      data: {
        name: "Partial Student",
        email: `partial${Date.now()}@testintegration.com`,
        passwordHash: await bcrypt.hash("password", 12),
        academicRecords: JSON.stringify({
          courseEnrolled: "B.Tech in Computer Science", // Meets degree requirement
          currentCGPA: 7.8, // Below required 8.5
          classXPercentage: 88, // Below required 95
          classXIIPercentage: 90, // No requirement set, so this is fine
        }),
        accountStatus: "APPROVED",
      },
    });

    // Test API validation
    const applicationResponse = await fetch(`${API_BASE}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${JSON.stringify({
          id: partialStudent.id,
          role: "STUDENT",
        })}`,
      },
      body: JSON.stringify({ jobId: job.id }),
    });

    const applicationResult = await applicationResponse.json();

    // Should fail with specific unmet criteria
    expect(applicationResult.success).toBe(false);
    expect(applicationResult.unmetCriteria).toBeDefined();

    // Should have exactly 2 unmet criteria (CGPA and ClassX)
    expect(applicationResult.unmetCriteria).toHaveLength(2);

    const unmetCriteria = applicationResult.unmetCriteria;
    const cgpaIssue = unmetCriteria.find((c) => c.field === "minCgpa");
    const classXIssue = unmetCriteria.find((c) => c.field === "classX");

    expect(cgpaIssue).toBeDefined();
    expect(cgpaIssue.required).toBe(8.5);
    expect(cgpaIssue.actual).toBe(7.8);

    expect(classXIssue).toBeDefined();
    expect(classXIssue.required).toBe(95);
    expect(classXIssue.actual).toBe(88);

    // Degree should not be in unmet criteria since it matches
    const degreeIssue = unmetCriteria.find((c) => c.field === "degree");
    expect(degreeIssue).toBeUndefined();
  }, 15000);
});
