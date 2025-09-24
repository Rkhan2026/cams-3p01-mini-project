"use client";

import { useState } from "react";
// import { useRouter } from "next/navigation"; // <-- REMOVED: No longer needed for this logic
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Link from "next/link";

// Simple Eye icon component for the password toggle
const EyeIcon = ({ ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit(formData) {
    setLoading(true); // <-- This now has a chance to render
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const result = await res.json();

      if (result.success) {
        // --- MODIFIED SECTION ---
        // We use a short timeout to ensure the browser has time to render
        // the spinner state BEFORE navigating away.
        setTimeout(() => {
          const role = result.user.role;
          if (role === "STUDENT") window.location.href = "/student";
          else if (role === "RECRUITER") window.location.href = "/recruiter";
          else window.location.href = "/tpo";
        }, 500); // A 500ms delay ensures the spinner is visible
        // --- END MODIFIED SECTION ---

        // Note: We don't call setLoading(false) here because the page will navigate away.
        return; // Exit the function early
      } else {
        setError(
          result.error.message || "Invalid credentials. Please try again."
        );
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    }

    // This part will only be reached if there is an error
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        <form
          action={onSubmit}
          className="space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-gray-700">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="font-medium text-gray-700">
                Password
              </Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                <EyeIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-300 bg-red-50 p-3 text-center text-sm font-medium text-red-600">
              {error}
            </p>
          )}

          <Button
            className="w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-6 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-75"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="pt-4 text-center">
            <p className="text-gray-600">
              Dont have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
