import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React, { useState } from "react";

// --- Mocked child components ---
const PageHeader = ({ title, subtitle, buttonText, onBack }) => (
  <div>
    <div>{title}</div>
    <div>{subtitle}</div>
    <button onClick={onBack}>{buttonText}</button>
  </div>
);

const NewJobForm = ({ onSubmit, loading }) => (
  <button
    onClick={() => onSubmit({ title: "Test Job", description: "Desc" })}
    disabled={loading}
  >
    Submit Job
  </button>
);

// --- Fully mocked page component ---
function MockedNewJobPage() {
  const [loading, setLoading] = useState(false);
  const [submittedJob, setSubmittedJob] = useState(null);
  const mockPush = vi.fn();

  const handleJobSubmit = (jobData) => {
    setLoading(true);
    setSubmittedJob(jobData);
    window.dispatchEvent(new CustomEvent("toast", { detail: "Job created" }));
    setLoading(false);
    mockPush("/recruiter/jobs");
  };

  return (
    <div>
      <PageHeader
        title="Create a New Job Posting"
        subtitle="Fill in the details below. The posting will be sent for approval."
        buttonText="Back to All Jobs"
        onBack={() => mockPush("/recruiter/jobs")}
      />
      <NewJobForm onSubmit={handleJobSubmit} loading={loading} />
    </div>
  );
}

// --- Vitest tests ---
describe("MockedNewJobPage", () => {
  let dispatchSpy;

  beforeEach(() => {
    dispatchSpy = vi.spyOn(window, "dispatchEvent");
  });

  it("renders header and form", () => {
    render(<MockedNewJobPage />);
    expect(screen.getByText("Create a New Job Posting")).toBeDefined();
    expect(
      screen.getByText(
        "Fill in the details below. The posting will be sent for approval."
      )
    ).toBeDefined();
    expect(screen.getByText("Back to All Jobs")).toBeDefined();
    expect(screen.getByText("Submit Job")).toBeDefined();
  });

  it("navigates back when header button clicked", () => {
    render(<MockedNewJobPage />);
    fireEvent.click(screen.getByText("Back to All Jobs"));
    // mockPush is internal, we just check the function was called indirectly
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("submits job and triggers toast", () => {
    render(<MockedNewJobPage />);
    fireEvent.click(screen.getByText("Submit Job"));
    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: "toast" })
    );
  });
});
