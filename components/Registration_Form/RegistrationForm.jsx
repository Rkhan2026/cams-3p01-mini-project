"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import StudentFormFields from "./StudentFormFields";
import RecruiterFormFields from "./RecruiterFormFields";
import Button from "@/components/ui/Button";

export default function RegistrationForm() {
  const params = useSearchParams();
  const router = useRouter();
  const role =
    params.get("role")?.toUpperCase() === "RECRUITER" ? "RECRUITER" : "STUDENT";

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
        new CustomEvent("toast", { detail: "An unexpected error occurred." })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 text-sm flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        All accounts require TPO approval before activation.
      </div>

      <input type="hidden" name="role" value={role} />

      {role === "STUDENT" ? <StudentFormFields /> : <RecruiterFormFields />}

      <div className="text-center pt-4">
        <p className="text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
}
