import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import React, { useState } from "react";

// --- Mock child components ---
const PageHeader = ({ title }) => <div>{title}</div>;
const JobInfoBlock = ({ title, children }) => (
  <div>
    <strong>{title}</strong>: {children}
  </div>
);
const JobApplicationStatus = ({ hasApplied }) => (
  <div>{hasApplied ? "Already Applied" : "Not Applied"}</div>
);
const JobDetailsSkeleton = () => <div>Loading...</div>;
const JobDeadlineInfo = ({ deadline }) => <div>Deadline: {deadline}</div>;
const JobApplicationActions = ({ hasApplied, onApply }) => (
  <button onClick={onApply}>{hasApplied ? "Applied" : "Apply Now"}</button>
);
const JobNotFoundState = ({ onBackToJobs }) => (
  <div>
    Job Not Found
    <button onClick={onBackToJobs}>Back</button>
  </div>
);
const ApplicationProcessInfo = ({ showInfo }) =>
  showInfo ? <div>Application process info</div> : null;

// --- Mocked JobDetailsPage ---
function MockedJobDetailsPage({ jobData, initiallyApplied = false }) {
  const [job] = useState(jobData);
  const [hasApplied, setHasApplied] = useState(initiallyApplied);

  const deadlinePassed = job
    ? new Date(job.applicationDeadline) <= new Date()
    : false;

  const handleApply = () => setHasApplied(true);

  if (!job) return <JobNotFoundState onBackToJobs={() => {}} />;

  return (
    <div>
      <PageHeader title={job.title} />
      <JobDeadlineInfo deadline={job.applicationDeadline} />
      <JobApplicationStatus hasApplied={hasApplied} />
      <JobInfoBlock title="About the Company">
        {job.recruiter.companyProfile}
      </JobInfoBlock>
      <JobInfoBlock title="Job Description">{job.jobDescription}</JobInfoBlock>
      <JobInfoBlock title="Eligibility Criteria">
        {job.eligibilityCriteria}
      </JobInfoBlock>
      <JobApplicationActions hasApplied={hasApplied} onApply={handleApply} />
      <ApplicationProcessInfo showInfo={!hasApplied && !deadlinePassed} />
    </div>
  );
}

// --- Vitest tests ---
describe("MockedJobDetailsPage", () => {
  const mockJob = {
    id: "101",
    title: "Frontend Developer",
    applicationDeadline: new Date(Date.now() + 1000 * 60 * 60).toISOString(), // deadline in future
    jobDescription: "Build UIs",
    eligibilityCriteria: "CS degree",
    recruiter: { name: "ACME Corp", companyProfile: "Tech Company" },
  };

  it("renders job details", () => {
    render(<MockedJobDetailsPage jobData={mockJob} />);
    expect(screen.getByText("Frontend Developer")).toBeDefined();
    expect(
      screen.getByText((content) => content.includes("Build UIs"))
    ).toBeDefined();
    expect(
      screen.getByText((content) => content.includes("CS degree"))
    ).toBeDefined();
    expect(
      screen.getByText((content) => content.includes("Tech Company"))
    ).toBeDefined();
    expect(screen.getByText("Not Applied")).toBeDefined();
    expect(screen.getByText("Application process info")).toBeDefined();
  });

  it("shows applied state after clicking apply", () => {
    render(<MockedJobDetailsPage jobData={mockJob} />);
    fireEvent.click(screen.getByText("Apply Now"));
    expect(screen.getByText("Already Applied")).toBeDefined();
    expect(screen.queryByText("Application process info")).toBeNull();
  });

  it("renders JobNotFoundState if job is null", () => {
    render(<MockedJobDetailsPage jobData={null} />);
    expect(screen.getByText("Job Not Found")).toBeDefined();
    expect(screen.getByText("Back")).toBeDefined();
  });

  it("hides application process info if deadline passed", () => {
    const pastDeadlineJob = {
      ...mockJob,
      applicationDeadline: new Date(Date.now() - 1000).toISOString(),
    };
    render(<MockedJobDetailsPage jobData={pastDeadlineJob} />);
    expect(screen.queryByText("Application process info")).toBeNull();
  });
});
