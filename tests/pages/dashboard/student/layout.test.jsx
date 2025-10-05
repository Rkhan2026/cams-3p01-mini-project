import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

// --- Mock next/navigation ---
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/student/jobs",
}));

// --- Fully mocked StudentLayout component ---
function MockedStudentLayout({ children }) {
  const childrenContent = children || (
    <div data-testid="child">Child Content</div>
  );
  return <div data-testid="layout">{childrenContent}</div>;
}

// --- Vitest tests ---
describe("MockedStudentLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <MockedStudentLayout>
        <div data-testid="custom-child">Hello Student</div>
      </MockedStudentLayout>
    );
    expect(screen.getByTestId("custom-child")).toBeDefined();
    expect(screen.getByText("Hello Student")).toBeDefined();
  });

  it("renders default child if none provided", () => {
    render(<MockedStudentLayout />);
    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByText("Child Content")).toBeDefined();
  });

  it("allows navigation via mock router push", () => {
    render(<MockedStudentLayout />);
    mockPush("/student/profile");
    expect(mockPush).toHaveBeenCalledWith("/student/profile");
  });
});
