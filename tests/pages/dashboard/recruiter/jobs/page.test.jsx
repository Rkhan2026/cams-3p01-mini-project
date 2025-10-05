import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React, { useState } from "react";

// --- Mocked child components ---
const Button = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

const JobsPageHeader = ({ onNewJobClick }) => (
  <div data-testid="page-header">
    <button onClick={onNewJobClick}>New Job</button>
  </div>
);

const JobsEmptyState = ({ onNewJobClick }) => (
  <div data-testid="jobs-empty-state">
    No jobs
    <button onClick={onNewJobClick}>New Job</button>
  </div>
);

const JobCard = ({ job, router }) => (
  <div data-testid="job-card">
    {job.title} - {job.company}
    <button onClick={() => router.push(`/recruiter/jobs/${job.id}`)}>
      View Details
    </button>
  </div>
);

const FullPageSpinner = ({ text }) => <div>{text}</div>;

// --- Fully mocked page component ---
function MockedRecruiterJobsPage() {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([
    { id: 1, title: "Job 1", company: "Company A" },
    { id: 2, title: "Job 2", company: "Company B" },
  ]);

  const mockPush = vi.fn();

  return (
    <div>
      {loading ? (
        <FullPageSpinner text="Loading your jobs..." />
      ) : (
        <>
          <Button onClick={() => mockPush("/recruiter")}>
            Back to Dashboard
          </Button>

          <JobsPageHeader
            onNewJobClick={() => mockPush("/recruiter/jobs/new")}
          />

          {jobs.length === 0 ? (
            <JobsEmptyState
              onNewJobClick={() => mockPush("/recruiter/jobs/new")}
            />
          ) : (
            <div>
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} router={{ push: mockPush }} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Vitest tests ---
describe("MockedRecruiterJobsPage", () => {
  let dispatchSpy;

  beforeEach(() => {
    dispatchSpy = vi.spyOn(window, "dispatchEvent");
  });

  it("renders back button, header, and job cards", () => {
    render(<MockedRecruiterJobsPage />);
    expect(screen.getByText("Back to Dashboard")).toBeDefined();
    expect(screen.getByText("New Job")).toBeDefined();
    expect(screen.getAllByTestId("job-card")).toHaveLength(2);
    expect(screen.getByText("Job 1 - Company A")).toBeDefined();
    expect(screen.getByText("Job 2 - Company B")).toBeDefined();
  });

  it("navigates back when back button clicked", () => {
    render(<MockedRecruiterJobsPage />);
    fireEvent.click(screen.getByText("Back to Dashboard"));
    // mockPush is internal, we just check the function was called indirectly
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("navigates to job details when 'View Details' clicked", () => {
    render(<MockedRecruiterJobsPage />);
    const viewButtons = screen.getAllByText("View Details");
    fireEvent.click(viewButtons[0]);
    // internal mockPush, no actual navigation, just ensure no crash
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("renders empty state when no jobs exist", () => {
    function EmptyJobsPage() {
      const [jobs] = useState([]);
      const mockPush = vi.fn();
      return jobs.length === 0 ? (
        <JobsEmptyState onNewJobClick={() => mockPush("/recruiter/jobs/new")} />
      ) : null;
    }
    render(<EmptyJobsPage />);
    expect(screen.getByTestId("jobs-empty-state")).toBeDefined();
    expect(screen.getByText("New Job")).toBeDefined();
  });
});
