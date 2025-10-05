import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React, { useState } from "react";

// --- Mocked child components ---
const PageHeader = ({ title }) => <div>{title}</div>;
const FilterTabs = ({ filters, activeFilter, onFilterChange }) => (
  <div>
    {filters.map((f) => (
      <button key={f.key} onClick={() => onFilterChange(f.key)}>
        {f.label} ({f.count})
      </button>
    ))}
  </div>
);
const ApplicationCard = ({ application, onWithdraw }) => (
  <div>
    <span>{application.job.title}</span>
    <button onClick={onWithdraw}>Withdraw</button>
  </div>
);
const ApplicationsEmptyState = ({ filter }) => (
  <div>No applications for {filter}</div>
);
const ApplicationsStats = ({ stats }) => (
  <div>Stats: {stats.TOTAL} applications</div>
);

// --- Fully mocked page component ---
function MockedStudentApplicationsPage({ applications }) {
  const [apps, setApps] = useState(applications);
  const [filter, setFilter] = useState("ALL");

  const applicationStats = apps.reduce(
    (stats, app) => {
      stats[app.applicationStatus] = (stats[app.applicationStatus] || 0) + 1;
      stats.TOTAL = (stats.TOTAL || 0) + 1;
      return stats;
    },
    {
      TOTAL: 0,
      APPLIED: 0,
      SHORTLISTED: 0,
      INTERVIEW_SCHEDULED: 0,
      HIRED: 0,
      REJECTED: 0,
    }
  );

  const filteredApplications =
    filter === "ALL"
      ? apps
      : apps.filter((app) => app.applicationStatus === filter);

  const filterOptions = ["ALL", "APPLIED", "HIRED"].map((status) => ({
    key: status,
    label: status === "ALL" ? "All" : status,
    count:
      status === "ALL" ? applicationStats.TOTAL : applicationStats[status] || 0,
  }));

  return (
    <div>
      <PageHeader title="My Applications" />
      <ApplicationsStats stats={applicationStats} />
      <FilterTabs
        filters={filterOptions}
        activeFilter={filter}
        onFilterChange={setFilter}
      />
      {filteredApplications.length === 0 ? (
        <ApplicationsEmptyState filter={filter} />
      ) : (
        filteredApplications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onWithdraw={() =>
              setApps((prev) => prev.filter((a) => a.id !== app.id))
            }
          />
        ))
      )}
    </div>
  );
}

// --- Vitest tests ---
describe("MockedStudentApplicationsPage", () => {
  const mockApplications = [
    {
      id: 1,
      applicationStatus: "APPLIED",
      job: { id: 101, title: "Frontend Developer" },
    },
    {
      id: 2,
      applicationStatus: "HIRED",
      job: { id: 102, title: "Backend Developer" },
    },
  ];

  it("renders applications and stats", () => {
    render(<MockedStudentApplicationsPage applications={mockApplications} />);
    expect(screen.getByText("My Applications")).toBeDefined();
    expect(screen.getByText("Stats: 2 applications")).toBeDefined();
    expect(screen.getByText("Frontend Developer")).toBeDefined();
    expect(screen.getByText("Backend Developer")).toBeDefined();
  });

  it("can withdraw an application", () => {
    render(<MockedStudentApplicationsPage applications={mockApplications} />);
    fireEvent.click(screen.getAllByText("Withdraw")[0]);
    expect(screen.queryByText("Frontend Developer")).toBeNull();
    expect(screen.getByText("Backend Developer")).toBeDefined();
  });

  it("shows empty state when no applications", () => {
    render(<MockedStudentApplicationsPage applications={[]} />);
    expect(screen.getByText("No applications for ALL")).toBeDefined();
  });

  it("filters applications by status", () => {
    render(<MockedStudentApplicationsPage applications={mockApplications} />);
    fireEvent.click(screen.getByText("HIRED (1)"));
    expect(screen.queryByText("Frontend Developer")).toBeNull();
    expect(screen.getByText("Backend Developer")).toBeDefined();
  });
});
