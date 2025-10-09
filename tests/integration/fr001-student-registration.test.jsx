import { describe, it, expect, afterAll, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import LoginForm from "@/components/auth/login/LoginForm.jsx";
import StudentFormFields from "@/components/auth/register/StudentFormFields.jsx";
import StudentCard from "@/components/dashboard/tpo/StudentCard.jsx";
import { ApprovalListSection } from "@/components/dashboard/tpo";
import React from "react";

const API_BASE = "http://localhost:3000";

let testStudentEmail;
const testStudentPassword = "TestPassword123!";
let tpoAdminEmail;
let tpoAdminPassword;

// --- Mock Next.js router for redirect ---
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("FR-001: Student Registration Integration Tests", () => {
  afterAll(async () => {
    // Clean up test data
    await prisma.application.deleteMany({
      where: { student: { email: { endsWith: "@testintegration.com" } } },
    });
    await prisma.student.deleteMany({
      where: { email: { endsWith: "@testintegration.com" } },
    });
    await prisma.tpoAdmin.deleteMany({
      where: { email: { endsWith: "@testintegration.com" } },
    });
    vi.clearAllMocks();
  });

  describe("Student Registration Flow - Step by Step", () => {
    it("Step 1: Should register student using StudentFormFields component", async () => {
      const user = userEvent.setup();
      testStudentEmail = `student${Date.now()}@testintegration.com`;

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
            value: "STUDENT",
          }),
          React.createElement(StudentFormFields)
        )
      );

      await user.type(screen.getByLabelText(/full name/i), "Test Student");
      await user.type(
        screen.getByLabelText(/email address/i),
        testStudentEmail
      );
      await user.type(screen.getByLabelText("Password"), testStudentPassword);
      await user.type(screen.getByLabelText(/enrollment number/i), "GI1234");
      await user.type(screen.getByLabelText(/class x %/i), "85.5");
      await user.type(screen.getByLabelText(/class xii %/i), "88.2");
      await user.type(
        screen.getByLabelText(/course enrolled/i),
        "Computer Science"
      );
      await user.type(
        screen.getByLabelText(/college\/university/i),
        "Test College"
      );
      await user.type(screen.getByLabelText(/current cgpa/i), "8.5");

      await user.click(screen.getByRole("button", { name: /create account/i }));

      await waitFor(
        async () => {
          const createdStudent = await prisma.student.findUnique({
            where: { email: testStudentEmail },
          });
          expect(createdStudent).toBeTruthy();
          expect(createdStudent.accountStatus).toBe("PENDING_STUDENT");
          expect(createdStudent.academicRecords.classXPercentage).toBe(85.5);
          expect(createdStudent.academicRecords.currentCGPA).toBe(8.5);
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

    it("Step 2b: Should approve the registered student using ApprovalListSection (real API call)", async () => {
      const user = userEvent.setup();

      const createdStudent = await prisma.student.findUnique({
        where: { email: testStudentEmail },
      });
      expect(createdStudent).toBeTruthy();
      expect(createdStudent.accountStatus).toBe("PENDING_STUDENT");

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

      const mockStudents = [
        {
          id: createdStudent.id,
          name: createdStudent.name,
          email: createdStudent.email,
          enrollmentNo: createdStudent.enrollmentNo,
          facultyNo: createdStudent.facultyNo,
          academicRecords: createdStudent.academicRecords,
        },
      ];

      render(
        React.createElement(ApprovalListSection, {
          title: "Students",
          users: mockStudents,
          CardComponent: StudentCard,
          onApprove: handleApproval,
          emptyMessage: "No pending students found.",
          status: "PENDING",
        })
      );

      await waitFor(
        () => {
          expect(screen.getByText("Test Student")).toBeInTheDocument();
          expect(screen.getByText(testStudentEmail)).toBeInTheDocument();
        },
        { timeout: 5000 }
      );

      const approveButton = screen.getByRole("button", { name: /approve/i });
      await user.click(approveButton);

      await waitFor(
        async () => {
          const approvedStudent = await prisma.student.findUnique({
            where: { email: testStudentEmail },
          });
          expect(approvedStudent.accountStatus).toBe("APPROVED");
        },
        { timeout: 10000 }
      );
    }, 20000);

    it("Step 3a: Should allow approved student to login (API like admin)", async () => {
      // Verify the login form renders
      render(React.createElement(LoginForm));
      expect(
        screen.getByPlaceholderText("you@example.com")
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /sign in/i })
      ).toBeInTheDocument();

      // Perform real API login like admin
      const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testStudentEmail,
          password: testStudentPassword,
          role: "STUDENT",
        }),
      });

      expect(loginRes.ok).toBe(true);
      const loginData = await loginRes.json();

      // Assert login success
      expect(loginData.success).toBe(true);
      expect(loginData.user.email).toBe(testStudentEmail);
    });

    it("Step 3b: Should fail login with invalid credentials (API like admin)", async () => {
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
          role: "STUDENT",
        }),
      });

      // Don’t assert loginRes.ok, because it may be 401/403
      const loginData = await loginRes.json();

      // Assert login failure from API payload
      expect(loginData.success).toBe(false);
      expect(loginData.error?.message).toMatch(/invalid credentials/i);
    });
  }, 40000);
});
