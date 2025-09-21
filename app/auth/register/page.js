"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const params = useSearchParams();
  const router = useRouter();

  // Read role from URL; default to STUDENT if not provided
  const role = params.get("role") === "RECRUITER" ? "RECRUITER" : "STUDENT";
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    );

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.message })
        );
        router.push("/auth/login");
      } else {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: result.error?.message || "Registration failed",
          })
        );
      }
    } catch (err) {
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Registration failed" })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <Logo width={120} height={57} />
            </div>
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join PlacementConnect and start your journey
          </p>
        </div>
        {/* Registration Form */}
        <form
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
            <p
              className="text-sm text-blue-700 flex items-center"
              aria-hidden="true"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              All accounts require TPO approval before activation
            </p>
          </div>
          {/* Hidden input to include role in form submission */}
          <input type="hidden" name="role" value={role} />
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Email Address</Label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                className="text-black w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="Create a password"
                className="text-black w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                required
              />
            </div>
          </div>
          {/* Student Section */}{" "}
          {role === "STUDENT" && (
            <div className="space-y-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
              {" "}
              <h3 className="text-lg font-semibold text-blue-900 flex items-center">
                {" "}
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />{" "}
                </svg>{" "}
                Student Information{" "}
              </h3>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                <Input name="name" placeholder="Full Name" required />{" "}
                <Input
                  name="enrollmentNo"
                  placeholder="Enrollment Number"
                  required
                />{" "}
              </div>{" "}
              <Input name="facultyNo" placeholder="Faculty Number" />{" "}
              <div className="space-y-4">
                {" "}
                <h4 className="text-gray-700 font-medium">
                  Academic Records
                </h4>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {" "}
                  <Input
                    name="classXPercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Class X %"
                  />{" "}
                  <Input
                    name="classXIIPercentage"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    placeholder="Class XII %"
                  />{" "}
                </div>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {" "}
                  <Input
                    name="courseEnrolled"
                    placeholder="Course Enrolled"
                  />{" "}
                  <Input name="college" placeholder="College/University" />{" "}
                </div>{" "}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {" "}
                  <Input
                    name="currentCGPA"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    placeholder="Current CGPA"
                  />{" "}
                  <Input
                    name="currentYearSemester"
                    placeholder="Current Year/Semester"
                  />{" "}
                </div>{" "}
                <Input
                  name="resumeLink"
                  type="url"
                  placeholder="Resume Link (Google Drive, Dropbox...)"
                />{" "}
              </div>{" "}
            </div>
          )}{" "}
          {/* Recruiter Section */}{" "}
          {role === "RECRUITER" && (
            <div className="space-y-6 bg-green-50 rounded-xl p-6 border border-green-200">
              {" "}
              <h3 className="text-lg font-semibold text-green-900 flex items-center">
                {" "}
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />{" "}
                </svg>{" "}
                Recruiter Information{" "}
              </h3>{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {" "}
                <Input name="name" placeholder="Your Name" required />{" "}
                <Input name="companyName" placeholder="Company Name" required />{" "}
              </div>{" "}
              <textarea
                name="companyProfile"
                placeholder="Describe your company..."
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-200"
                required
              />{" "}
            </div>
          )}{" "}
          {/* Submit Button */}{" "}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {" "}
            {loading ? "Creating Account..." : "Create Account"}{" "}
          </Button>{" "}
          {/* Sign In Link */}{" "}
          <div className="text-center pt-4">
            {" "}
            <p className="text-gray-600">
              {" "}
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200"
              >
                {" "}
                Sign In{" "}
              </a>{" "}
            </p>{" "}
          </div>{" "}
        </form>{" "}
        {/* Additional Info */}{" "}
        <div className="text-center mt-8">
          {" "}
          <p className="text-sm text-gray-500">
            {" "}
            By creating an account, you agree to our Terms of Service and
            Privacy Policy{" "}
          </p>{" "}
        </div>{" "}
      </div>{" "}
    </main>
  );
}
