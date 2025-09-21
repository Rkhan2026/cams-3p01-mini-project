import { render, screen } from "@testing-library/react";
import StudentDashboardPage from "../../app/(dashboards)/student/page";
import RecruiterDashboardPage from "../../app/(dashboards)/recruiter/page";
import TPODashboardPage from "../../app/(dashboards)/tpo/page";

describe("Dashboards", () => {
  it("renders student dashboard", () => {
    render(<StudentDashboardPage />);
    expect(screen.getByText("Student Dashboard")).toBeInTheDocument();
  });
  it("renders recruiter dashboard", () => {
    render(<RecruiterDashboardPage />);
    expect(screen.getByText("Recruiter Dashboard")).toBeInTheDocument();
  });
  it("renders TPO dashboard", () => {
    render(<TPODashboardPage />);
    expect(screen.getByText("TPO Dashboard")).toBeInTheDocument();
  });
});




