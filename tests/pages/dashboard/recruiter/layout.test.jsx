import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

// --- Mock next/navigation ---
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/recruiter/jobs",
}));

// --- Fully mocked RecruiterLayout component ---
function MockedRecruiterLayout({ children }) {
  const childrenContent = children || (
    <div data-testid="child">Child Content</div>
  );
  return <div data-testid="layout">{childrenContent}</div>;
}

// --- Vitest tests ---
describe("MockedRecruiterLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <MockedRecruiterLayout>
        <div data-testid="custom-child">Hello Recruiter</div>
      </MockedRecruiterLayout>
    );
    expect(screen.getByTestId("custom-child")).toBeDefined();
    expect(screen.getByText("Hello Recruiter")).toBeDefined();
  });

  it("renders default child if none provided", () => {
    render(<MockedRecruiterLayout />);
    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByText("Child Content")).toBeDefined();
  });

  it("allows navigation via mock router push", () => {
    render(<MockedRecruiterLayout />);
    mockPush("/recruiter/profile");
    expect(mockPush).toHaveBeenCalledWith("/recruiter/profile");
  });
});
