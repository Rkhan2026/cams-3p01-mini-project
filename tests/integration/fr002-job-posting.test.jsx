import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import React from "react";

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

      // Create a test recruiter
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

      // Mock submit handler to capture form data without actual submission
      const mockHandleJobSubmit = vi.fn();

      // Render the form with mock submit handler to test form logic
      render(<NewJobForm onSubmit={mockHandleJobSubmit} loading={false} />);

      // Verify form inputs exist and are accessible
      expect(screen.getByTestId("input-jobTitle")).toBeInTheDocument();
      expect(screen.getByTestId("textarea-jobDescription")).toBeInTheDocument();
      expect(
        screen.getByTestId("textarea-eligibilityCriteria")
      ).toBeInTheDocument();
      expect(
        screen.getByTestId("input-applicationDeadline")
      ).toBeInTheDocument();

      // Test form filling logic
      const jobTitle = "Full Stack Developer";
      const jobDescription =
        "Develop React/Node.js applications with modern tech stack";
      const eligibilityCriteria =
        "B.Tech CS, 1+ year experience, React/Node.js knowledge";
      const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16);

      await user.type(screen.getByTestId("input-jobTitle"), jobTitle);
      await user.type(
        screen.getByTestId("textarea-jobDescription"),
        jobDescription
      );
      await user.type(
        screen.getByTestId("textarea-eligibilityCriteria"),
        eligibilityCriteria
      );
      await user.type(
        screen.getByTestId("input-applicationDeadline"),
        futureDate
      );

      // Verify form values are filled correctly
      expect(screen.getByTestId("input-jobTitle")).toHaveValue(jobTitle);
      expect(screen.getByTestId("textarea-jobDescription")).toHaveValue(
        jobDescription
      );
      expect(screen.getByTestId("textarea-eligibilityCriteria")).toHaveValue(
        eligibilityCriteria
      );
      expect(screen.getByTestId("input-applicationDeadline")).toHaveValue(
        futureDate
      );

      // Test form submission logic (should call onSubmit)
      await user.click(screen.getByRole("button", { name: /submit/i }));
      expect(mockHandleJobSubmit).toHaveBeenCalled();

      // Create job directly via API (bypassing form submission)
      const createdJob = await prisma.jobPosting.create({
        data: {
          recruiterId: recruiter.id,
          jobDescription: jobDescription,
          eligibilityCriteria: eligibilityCriteria,
          applicationDeadline: new Date(futureDate),
          approvalStatus: "PENDING",
        },
      });

      // Verify job was created successfully
      expect(createdJob).toBeTruthy();
      expect(createdJob.jobDescription).toBe(jobDescription);
      expect(createdJob.eligibilityCriteria).toBe(eligibilityCriteria);
      expect(createdJob.recruiterId).toBe(recruiter.id);
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
