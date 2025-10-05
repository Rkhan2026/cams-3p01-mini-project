import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React, { useState } from "react";

// Mock child components
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
const StudentCard = ({ name }) => <div>StudentCard: {name}</div>;
const RecruiterCard = ({ name }) => <div>RecruiterCard: {name}</div>;
const ApprovalListSection = ({ title, users, CardComponent }) => (
  <div>
    <h2>{title}</h2>
    {users.length === 0 ? (
      <div>No users</div>
    ) : (
      users.map((u) => <CardComponent key={u.id} {...u} />)
    )}
  </div>
);

// A fully mocked version of ApprovalsPage for testing
function MockedApprovalsPage({ pending, approved, rejected }) {
  const [activeFilter, setActiveFilter] = useState("PENDING");

  const counts = {
    PENDING: pending.students.length + pending.recruiters.length,
    APPROVED: approved.students.length + approved.recruiters.length,
    REJECTED: rejected.students.length + rejected.recruiters.length,
  };

  const filteredUsers =
    activeFilter === "PENDING"
      ? pending
      : activeFilter === "APPROVED"
      ? approved
      : rejected;

  const filterOptions = [
    { key: "PENDING", label: "Pending", count: counts.PENDING },
    { key: "APPROVED", label: "Approved", count: counts.APPROVED },
    { key: "REJECTED", label: "Rejected", count: counts.REJECTED },
  ];

  return (
    <div>
      <PageHeader title="User Registration Management" />
      <FilterTabs
        filters={filterOptions}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />
      <ApprovalListSection
        title="Students"
        users={filteredUsers.students}
        CardComponent={StudentCard}
      />
      <ApprovalListSection
        title="Recruiters"
        users={filteredUsers.recruiters}
        CardComponent={RecruiterCard}
      />
    </div>
  );
}

describe("ApprovalsPage mocked render", () => {
  const pending = { students: [{ id: 1, name: "Alice" }], recruiters: [] };
  const approved = { students: [], recruiters: [{ id: 2, name: "Bob" }] };
  const rejected = { students: [], recruiters: [] };

  it("renders all sections with pending data", () => {
    render(
      <MockedApprovalsPage
        pending={pending}
        approved={approved}
        rejected={rejected}
      />
    );

    expect(screen.getByText("User Registration Management")).toBeDefined();
    expect(screen.getByText("Students")).toBeDefined();
    expect(screen.getByText("Recruiters")).toBeDefined();
    expect(screen.getByText("StudentCard: Alice")).toBeDefined();
  });

  it("switches filter to approved", () => {
    render(
      <MockedApprovalsPage
        pending={pending}
        approved={approved}
        rejected={rejected}
      />
    );
    fireEvent.click(screen.getByText("Approved (1)"));
    expect(screen.getByText("RecruiterCard: Bob")).toBeDefined();
  });
});
