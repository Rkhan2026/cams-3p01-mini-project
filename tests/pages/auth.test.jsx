import { render, screen } from "@testing-library/react";
import LoginPage from "../../app/auth/login/page";
import RegisterPage from "../../app/auth/register/page";

describe("Auth pages", () => {
  it("shows login form", () => {
    render(<LoginPage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("shows register form", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Create account")).toBeInTheDocument();
  });
});




