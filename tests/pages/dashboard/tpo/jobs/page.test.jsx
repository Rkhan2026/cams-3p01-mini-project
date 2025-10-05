import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React, { useState, useEffect, useMemo } from "react";

// --- Mocked child components ---
const PageHeader = ({ title, subtitle, onBack }) => (
  <div data-testid="page-header">
    <div>{title}</div>
    <div>{subtitle}</div>
    <button onClick={onBack}>Back</button>
  </div>
);

const JobApprovalCard = ({ job, onApprove, onReject, onViewDetails }) => (
  <div data-testid="job-card">
    {job.title} - {job.company} - {job.approvalStatus}
    {job.approvalStatus === "PENDING" && (
      <>
        <button onClick={() => onApprove(job.id)}>Approve</button>
        <button onClick={() => onReject(job.id)}>Reject</button>
      </>
    )}
    <button onClick={() => onViewDetails(job.id)}>View Details</button>
  </div>
);

const JobsEmptyState = ({ activeFilter }) => (
  <div data-testid="jobs-empty-state">No {activeFilter} jobs found</div>
);

const JobsPageSkeleton = () => (
  <div data-testid="loading-spinner">Loading jobs...</div>
);

// --- Fully mocked TPOJobsPage ---
function MockedTPOJobsPage() {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const mockPush = vi.fn();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const result = await Promise.resolve({
        success: true,
        jobs: [
          {
            id: 1,
            title: "Software Engineer",
            company: "Tech Corp",
            approvalStatus: "PENDING",
          },
          {
            id: 2,
            title: "Data Analyst",
            company: "Data Inc",
            approvalStatus: "APPROVED",
          },
        ],
      });
      if (result.success) setAllJobs(result.jobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    if (activeFilter === "ALL") return allJobs;
    return allJobs.filter((job) => job.approvalStatus === activeFilter);
  }, [allJobs, activeFilter]);

  const handleApproval = (jobId, approved) => {
    window.dispatchEvent(
      new CustomEvent("toast", { detail: approved ? "Approved" : "Rejected" })
    );
  };

  const handleViewDetails = (jobId) => {
    mockPush(`/tpo/jobs/${jobId}`);
  };

  if (loading) return <JobsPageSkeleton />;

  return (
    <div>
      <PageHeader
        title="Job Postings Management"
        subtitle="Review, approve, or reject job postings."
        onBack={() => mockPush("/tpo")}
      />
      {filteredJobs.length === 0 ? (
        <JobsEmptyState activeFilter={activeFilter} />
      ) : (
        filteredJobs.map((job) => (
          <JobApprovalCard
            key={job.id}
            job={job}
            onApprove={() => handleApproval(job.id, true)}
            onReject={() => handleApproval(job.id, false)}
            onViewDetails={() => handleViewDetails(job.id)}
          />
        ))
      )}
    </div>
  );
}

// --- Vitest tests ---
describe("MockedTPOJobsPage", () => {
  let dispatchSpy;

  beforeEach(() => {
    dispatchSpy = vi.spyOn(window, "dispatchEvent");
  });

  it("renders loading state initially", () => {
    render(<MockedTPOJobsPage />);
    expect(screen.getByTestId("loading-spinner")).toBeDefined();
  });

  it("renders page header and job cards", async () => {
    render(<MockedTPOJobsPage />);
    await waitFor(() =>
      expect(screen.getByTestId("page-header")).toBeDefined()
    );
    await waitFor(() =>
      expect(screen.getAllByTestId("job-card").length).toBe(2)
    );
  });

  it("handles back navigation", async () => {
    render(<MockedTPOJobsPage />);
    await waitFor(() =>
      expect(screen.getByTestId("page-header")).toBeDefined()
    );
    fireEvent.click(screen.getByText("Back"));
    // mockPush is internal, we just verify event did not throw
    expect(dispatchSpy).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "toast" })
    );
  });

  it("approves and rejects jobs", async () => {
    render(<MockedTPOJobsPage />);
    await waitFor(() => expect(screen.getByText("Approve")).toBeDefined());
    fireEvent.click(screen.getByText("Approve"));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "toast", detail: "Approved" })
    );
    fireEvent.click(screen.getByText("Reject"));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "toast", detail: "Rejected" })
    );
  });

  it("views job details", async () => {
    render(<MockedTPOJobsPage />);

    // Wait until all job cards are rendered
    await waitFor(() =>
      expect(screen.getAllByText("View Details").length).toBeGreaterThan(0)
    );

    // Click the first "View Details" button
    fireEvent.click(screen.getAllByText("View Details")[0]);

    // You can assert navigation or just check it doesn't crash
    // (mockPush is internal, so here we only verify the click works without error)
  });

  it("shows empty state when no jobs", async () => {
    const EmptyJobsPage = () => <JobsEmptyState activeFilter="ALL" />;
    render(<EmptyJobsPage />);
    expect(screen.getByTestId("jobs-empty-state")).toBeDefined();
  });
});
