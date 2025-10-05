import { render, screen, fireEvent } from "@testing-library/react";
import React, { useState } from "react";

// --- Mocked child components ---
const LoadingState = ({ message }) => (
  <div data-testid="loading-state">{message}</div>
);
const ErrorState = ({ message, onRetry }) => (
  <div data-testid="error-state">
    {message}
    <button onClick={onRetry}>Retry</button>
  </div>
);
const PageHeader = ({ title }) => <div data-testid="page-header">{title}</div>;
const PlacementReportGenerator = ({ data, onRefresh }) => (
  <div data-testid="placement-generator">
    Students: {data?.stats?.totalStudents || 0}
    <button onClick={onRefresh}>Refresh</button>
  </div>
);

// --- Fully mocked ReportsPage ---
function MockedReportsPage({
  data = null,
  initialLoading = false,
  initialError = null,
}) {
  const [placementData, setPlacementData] = useState(data);
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState(initialError);

  const fetchData = () => setPlacementData(data);

  if (loading)
    return <LoadingState message="Loading placement statistics..." />;
  if (error)
    return <ErrorState message={error} onRetry={() => setError(null)} />;

  return (
    <div>
      <PageHeader title="Placement Statistics Report" />
      <PlacementReportGenerator data={placementData} onRefresh={fetchData} />
    </div>
  );
}

// --- Vitest tests ---
import { describe, it, expect } from "vitest";

describe("MockedReportsPage", () => {
  const mockReportsData = {
    stats: { totalStudents: 150 },
  };

  it("renders loading state initially", () => {
    render(<MockedReportsPage initialLoading={true} />);
    const loadingEl = screen.getByTestId("loading-state");
    expect(loadingEl).not.toBeNull();
    expect(loadingEl.textContent).toContain("Loading placement statistics...");
  });

  it("renders error state and retry button", () => {
    render(<MockedReportsPage initialError="API Error" />);
    const errorEl = screen.getByTestId("error-state");
    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain("API Error");

    const retryBtn = screen.getByText("Retry");
    fireEvent.click(retryBtn);
    // After click, error should be cleared (textContent should no longer contain "API Error")
    expect(screen.queryByText("API Error")).toBeNull();
  });

  it("renders page header and report generator", () => {
    render(<MockedReportsPage data={mockReportsData} />);
    const header = screen.getByTestId("page-header");
    expect(header).not.toBeNull();
    expect(header.textContent).toContain("Placement Statistics Report");

    const generator = screen.getByTestId("placement-generator");
    expect(generator).not.toBeNull();
    expect(generator.textContent).toContain("Students: 150");
  });

  it("refreshes data on Refresh button click", () => {
    render(<MockedReportsPage data={mockReportsData} />);
    const generator = screen.getByTestId("placement-generator");
    const refreshBtn = screen.getByText("Refresh");
    fireEvent.click(refreshBtn);
    expect(generator.textContent).toContain("Students: 150");
  });
});
