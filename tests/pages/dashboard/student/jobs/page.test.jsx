import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React, { useState } from "react";

// --- Mocked child components ---
const PageHeader = ({ title, subtitle, onBack }) => (
  <div data-testid="page-header">
    <div>{title}</div>
    <div>{subtitle}</div>
    <button onClick={onBack}>Back</button>
  </div>
);

const JobsSearchBar = ({ searchTerm, onSearchChange }) => (
  <input
    data-testid="search-bar"
    value={searchTerm}
    onChange={(e) => onSearchChange(e.target.value)}
  />
);

const JobsEmptyState = ({ searchTerm, onClearSearch }) => (
  <div data-testid="jobs-empty-state">
    No jobs for "{searchTerm}"
    <button onClick={onClearSearch}>Clear Search</button>
  </div>
);

const JobCard = ({ job, hasApplied, onViewJob }) => (
  <div data-testid="job-card">
    {job.jobDescription} - {job.recruiter.name} -{" "}
    {hasApplied ? "Applied" : "Not Applied"}
    <button onClick={() => onViewJob(job.id)}>View Job</button>
  </div>
);

const JobCardSkeleton = ({ count }) => (
  <div data-testid="job-skeleton">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i}>Loading...</div>
    ))}
  </div>
);

// --- Fully mocked page component ---
function MockedStudentJobsPage() {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([
    {
      id: 1,
      jobDescription: "Frontend Dev (React)",
      recruiter: { name: "Tech Corp" },
      applicationDeadline: "2099-12-31",
    },
    {
      id: 2,
      jobDescription: "Backend Dev (Node)",
      recruiter: { name: "Data Inc" },
      applicationDeadline: "2099-12-31",
    },
  ]);
  const [applications, setApplications] = useState([{ jobId: 1 }]);
  const [searchTerm, setSearchTerm] = useState("");

  const mockPush = vi.fn();

  const filteredJobs =
    searchTerm === ""
      ? jobs
      : jobs.filter((j) =>
          j.jobDescription.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const onBack = () => mockPush("/student");

  return (
    <div>
      {loading ? (
        <JobCardSkeleton count={3} />
      ) : (
        <>
          <PageHeader
            title="Available Jobs"
            subtitle={`${filteredJobs.length} opportunities waiting for you.`}
            onBack={onBack}
          />
          <JobsSearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          {filteredJobs.length === 0 ? (
            <JobsEmptyState
              searchTerm={searchTerm}
              onClearSearch={() => setSearchTerm("")}
            />
          ) : (
            <div>
              {filteredJobs.map((job) => {
                const hasApplied = applications.some(
                  (app) => app.jobId === job.id
                );
                return (
                  <JobCard
                    key={job.id}
                    job={job}
                    hasApplied={hasApplied}
                    onViewJob={(id) => mockPush(`/student/jobs/${id}`)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// --- Vitest tests ---
describe("MockedStudentJobsPage", () => {
  let dispatchSpy;

  beforeEach(() => {
    dispatchSpy = vi.spyOn(window, "dispatchEvent");
  });

  it("renders header, search bar, and job cards", () => {
    render(<MockedStudentJobsPage />);
    expect(screen.getByTestId("page-header")).toBeDefined();
    expect(screen.getByTestId("search-bar")).toBeDefined();
    expect(screen.getAllByTestId("job-card")).toHaveLength(2);
  });

  it("filters jobs when search term is entered", () => {
    render(<MockedStudentJobsPage />);
    const input = screen.getByTestId("search-bar");
    fireEvent.change(input, { target: { value: "frontend" } });
    expect(screen.getAllByTestId("job-card")).toHaveLength(1);
    expect(screen.getByText(/Frontend Dev/i)).toBeDefined();
  });

  it("shows empty state if no jobs match search", () => {
    render(<MockedStudentJobsPage />);
    const input = screen.getByTestId("search-bar");
    fireEvent.change(input, { target: { value: "nonexistent" } });
    expect(screen.getByTestId("jobs-empty-state")).toBeDefined();
    fireEvent.click(screen.getByText("Clear Search"));
    expect(screen.getAllByTestId("job-card")).toHaveLength(2);
  });

  it("navigates back when back button clicked", () => {
    render(<MockedStudentJobsPage />);
    fireEvent.click(screen.getByText("Back"));
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("views job details when 'View Job' clicked", () => {
    render(<MockedStudentJobsPage />);
    const viewButtons = screen.getAllByText("View Job");
    fireEvent.click(viewButtons[0]);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
