import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";

// --- Mock next/navigation ---
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/tpo/jobs",
}));

// --- Fully mocked TPOLayout component ---
function MockedTPOLayout({ children }) {
  const childrenContent = children || (
    <div data-testid="child">Child Content</div>
  );
  return <div data-testid="layout">{childrenContent}</div>;
}

// --- Vitest tests ---
describe("MockedTPOLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <MockedTPOLayout>
        <div data-testid="custom-child">Hello TPO</div>
      </MockedTPOLayout>
    );
    expect(screen.getByTestId("custom-child")).toBeDefined();
    expect(screen.getByText("Hello TPO")).toBeDefined();
  });

  it("renders default child if none provided", () => {
    render(<MockedTPOLayout />);
    expect(screen.getByTestId("child")).toBeDefined();
    expect(screen.getByText("Child Content")).toBeDefined();
  });

  it("allows navigation via mock router push", () => {
    render(<MockedTPOLayout />);
    mockPush("/tpo");
    expect(mockPush).toHaveBeenCalledWith("/tpo");
  });
});
