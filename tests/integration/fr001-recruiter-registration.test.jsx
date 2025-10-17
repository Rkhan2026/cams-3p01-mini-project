import { describe, it, expect, afterAll, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import LoginForm from "@/components/auth/login/LoginForm.jsx";
import RecruiterFormFields from "@/components/auth/register/RecruiterFormFields.jsx";
import RecruiterCard from "@/components/dashboard/tpo/RecruiterCard.jsx";
import { ApprovalListSection } from "@/components/dashboard/tpo";
import React from "react";

const API_BASE = "http://localhost:3000";

let testRecruiterEmail;
const testRecruiterPassword = "TestPassword123!";
let tpoAdminEmail;
let tpoAdminPassword;

// --- Mock Next.js router for redirect ---
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("FR-001: Recruiter Registration Integration Tests", () => {
  afterAll(async () => {
    // Cleanup test data
    await prisma.jobPosting.deleteMany({
      where: { recruiter: { email: { endsWith: "@testintegration.com" } } },
    });
    await prisma.companyRecruiter.deleteMany({
      where: { email: { endsWith: "@testintegration.com" } },
    });
    await prisma.tpoAdmin.deleteMany({
      where: { email: { endsWith: "@testintegration.com" } },
    });
    vi.clearAllMocks();
  });

  describe("Recruiter Registration Flow - Step by Step", () => {
    it("Step 1: Should register recruiter using RecruiterFormFields component", async () => {
      const user = userEvent.setup();
      testRecruiterEmail = `recruiter${Date.now()}@testintegration.com`;

      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = Object.fromEntries(
          new FormData(e.currentTarget).entries()
        );
        await fetch(`${API_BASE}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      };

      render(
        React.createElement(
          "form",
          { onSubmit: handleSubmit },
          React.createElement("input", {
            type: "hidden",
            name: "role",
            value: "RECRUITER",
          }),
          React.createElement(RecruiterFormFields)
        )
      );

      await user.type(screen.getByLabelText(/your name/i), "Test Recruiter");
      await user.type(
        screen.getByLabelText(/work email address/i),
        testRecruiterEmail
      );
      await user.type(screen.getByLabelText("Password"), testRecruiterPassword);
      await user.type(
        screen.getByLabelText(/company name/i),
        "TechCorp Solutions"
      );

      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(
        async () => {
          const createdRecruiter = await prisma.companyRecruiter.findUnique({
            where: { email: testRecruiterEmail },
          });
          expect(createdRecruiter).toBeTruthy();
          expect(createdRecruiter.accountStatus).toBe("PENDING_RECRUITER");
          expect(createdRecruiter.companyProfile).toBe("TechCorp Solutions");
        },
        { timeout: 10000 }
      );
    }, 15000);

    it("Step 2a: Should create TPO admin account", async () => {
      tpoAdminEmail = `tpo${Date.now()}@testintegration.com`;
      tpoAdminPassword = "TpoPassword123!";
      const hashedTpoPassword = await bcrypt.hash(tpoAdminPassword, 12);

      await prisma.tpoAdmin.create({
        data: {
          name: "Test TPO Admin",
          email: tpoAdminEmail,
          passwordHash: hashedTpoPassword,
          role: "TPO_ADMIN",
        },
      });

      const createdTpo = await prisma.tpoAdmin.findUnique({
        where: { email: tpoAdminEmail },
      });
      expect(createdTpo).toBeTruthy();
    }, 10000);

    it("Step 2b: Should approve the registered recruiter using ApprovalListSection (real API call)", async () => {
      const user = userEvent.setup();

      const createdRecruiter = await prisma.companyRecruiter.findUnique({
        where: { email: testRecruiterEmail },
      });
      expect(createdRecruiter).toBeTruthy();
      expect(createdRecruiter.accountStatus).toBe("PENDING_RECRUITER");

      // --- Log in TPO admin to get real session ---
      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: tpoAdminEmail,
          password: tpoAdminPassword,
          role: "TPO",
        }),
      });
      expect(loginRes.ok).toBe(true);
      const loginData = await loginRes.json();
      expect(loginData.success).toBe(true);

      const cookieHeader = loginRes.headers.get("set-cookie");

      const handleApproval = async (userId, userType, approved) => {
        const res = await fetch(`${API_BASE}/api/auth/approve`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: cookieHeader,
          },
          body: JSON.stringify({ userId, userType, approved }),
        });
        const result = await res.json();
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: result.message || "Action completed.",
          })
        );
        return result;
      };

      const mockRecruiters = [
        {
          id: createdRecruiter.id,
          name: createdRecruiter.name,
          email: createdRecruiter.email,
          companyProfile: createdRecruiter.companyProfile,
        },
      ];

      render(
        React.createElement(ApprovalListSection, {
          title: "Recruiters",
          users: mockRecruiters,
          CardComponent: RecruiterCard,
          onApprove: handleApproval,
          emptyMessage: "No pending recruiters found.",
          status: "PENDING",
        })
      );

      await waitFor(
        () => {
          expect(screen.getByText("Test Recruiter")).toBeInTheDocument();
          expect(screen.getByText(testRecruiterEmail)).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const approveButton = screen.getByRole("button", { name: /approve/i });
      await user.click(approveButton);

      await waitFor(
        async () => {
          const approvedRecruiter = await prisma.companyRecruiter.findUnique({
            where: { email: testRecruiterEmail },
          });
          expect(approvedRecruiter.accountStatus).toBe("APPROVED");
        },
        { timeout: 10000 }
      );
    }, 20000);

    describe("Recruiter Login - Step by Step", () => {
      it("Step 3a: Should allow approved recruiter to login (real API like student)", async () => {
        const user = userEvent.setup();

        // Render the login form
        render(React.createElement(LoginForm));

        expect(
          screen.getByPlaceholderText("you@example.com")
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /sign in/i })
        ).toBeInTheDocument();

        // Perform real API login for approved recruiter
        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: testRecruiterEmail,
            password: testRecruiterPassword,
            role: "RECRUITER",
          }),
        });

        expect(loginRes.ok).toBe(true);
        const loginData = await loginRes.json();

        // Assert login success
        expect(loginData.success).toBe(true);
        expect(loginData.user.email).toBe(testRecruiterEmail);
      });

      it("Step 3b: Should fail login with invalid recruiter credentials (real API)", async () => {
        // Render the login form
        render(React.createElement(LoginForm));

        const invalidEmail = `nonexistent${Date.now()}@testintegration.com`;
        const invalidPassword = "WrongPassword123!";

        const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: invalidEmail,
            password: invalidPassword,
            role: "RECRUITER",
          }),
        });

        // Do not assert loginRes.ok because API may return 401/403
        const loginData = await loginRes.json();

        // Assert login failure from API payload
        expect(loginData.success).toBe(false);
        expect(loginData.error?.message).toMatch(/invalid credentials/i);
      });
    });
  }, 40000);
});
