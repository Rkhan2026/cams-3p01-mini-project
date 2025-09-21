import { render, screen } from "@testing-library/react";
import JobsListPage from "../../app/jobs/page";
import RecruiterJobsPage from "../../app/recruiter/jobs/page";

describe("Jobs pages", () => {
  it("renders jobs list", () => {
    render(<JobsListPage />);
    expect(screen.getByText("Jobs")).toBeInTheDocument();
  });
  it("renders recruiter jobs page", () => {
    render(<RecruiterJobsPage />);
    expect(screen.getByText("Your Job Postings")).toBeInTheDocument();
  });
});




