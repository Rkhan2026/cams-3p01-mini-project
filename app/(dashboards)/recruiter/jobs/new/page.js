"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// --- SVG Icons ---
const BackArrowIcon = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);
const CalendarIcon = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18"
    />
  </svg>
);
const SpinnerIcon = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
);

// --- Self-Contained UI Components ---
const Label = ({ children, ...props }) => (
  <label className="block text-sm font-medium text-gray-800" {...props}>
    {children}
  </label>
);
const Input = ({ className, ...props }) => (
  <input
    className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 ${className}`}
    {...props}
  />
);
const Textarea = ({ className, ...props }) => (
  <textarea
    className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 ${className}`}
    {...props}
  />
);
const Button = ({ children, variant = "primary", className, ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg border border-transparent px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
  };
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Child Components ---
const PageHeader = ({ title, subtitle, onBack }) => (
  <div className="mb-8">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all mb-4"
    >
      <BackArrowIcon className="h-5 w-5" />
      Back to All Jobs
    </button>
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    <p className="text-gray-500 mt-1">{subtitle}</p>
  </div>
);
const FormField = ({ id, label, helpText, children, required }) => (
  <div>
    <Label htmlFor={id}>
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <div className="mt-1">{children}</div>
    {helpText && <p className="mt-2 text-sm text-gray-500">{helpText}</p>}
  </div>
);
const TpoApprovalNote = () => (
  <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-blue-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-blue-800">For TPO Approval</h3>
        <div className="mt-2 text-sm text-blue-700">
          <p>
            Your job posting will be submitted for approval before it becomes
            visible to students.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const NewJobForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const minDateTime = new Date().toISOString().slice(0, 16);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const title = formData.get("jobTitle");
    const description = formData.get("jobDescription");
    const combinedDescription = `(${title})\n\n${description}`;

    const jobData = {
      jobDescription: combinedDescription,
      eligibilityCriteria: formData.get("eligibilityCriteria"),
      applicationDeadline: formData.get("applicationDeadline"),
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      const result = await response.json();

      // ✅ Dispatch only a string, not an object
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: result.message || result.error?.message || "Unknown response",
        })
      );

      if (result.success) {
        router.push("/recruiter/jobs");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      // ✅ Dispatch only a string here too
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: "An unexpected error occurred.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 w-full pb-2 mb-2">
          Job Details
        </legend>
        <FormField id="jobTitle" label="Job Title" required>
          <Input
            id="jobTitle"
            name="jobTitle"
            type="text"
            required
            placeholder="e.g., Software Engineer Intern"
          />
        </FormField>
        <FormField
          id="jobDescription"
          label="Job Description"
          helpText="Provide details on responsibilities, requirements, and benefits."
          required
        >
          <Textarea
            id="jobDescription"
            name="jobDescription"
            required
            rows={6}
            placeholder="We are looking for a motivated intern to join our dynamic team..."
          />
        </FormField>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 w-full pb-2 mb-2">
          Requirements
        </legend>
        <FormField
          id="eligibilityCriteria"
          label="Eligibility Criteria"
          helpText="Specify required education, skills, graduation year, etc."
          required
        >
          <Textarea
            id="eligibilityCriteria"
            name="eligibilityCriteria"
            required
            rows={4}
            placeholder="- B.Tech in CS/IT (2025 Batch)&#10;- Minimum 7.0 CGPA&#10;- Proficient in JavaScript and React"
          />
        </FormField>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 w-full pb-2 mb-2">
          Timeline
        </legend>
        <FormField
          id="applicationDeadline"
          label="Application Deadline"
          helpText="Select the final date and time for receiving applications."
          required
        >
          <div className="relative">
            <Input
              id="applicationDeadline"
              name="applicationDeadline"
              type="datetime-local"
              required
              min={minDateTime}
              className="pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </FormField>
      </fieldset>

      <TpoApprovalNote />

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          className="w-full sm:w-auto min-w-[180px]"
        >
          {loading && <SpinnerIcon />}
          {loading ? "Submitting..." : "Submit for Approval"}
        </Button>
      </div>
    </form>
  );
};

// --- Main Page Component ---
export default function NewJobPage() {
  const router = useRouter();

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Create a New Job Posting"
          subtitle="Fill in the details below. The posting will be sent for approval."
          onBack={() => router.push("/recruiter/jobs")}
        />

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
          <NewJobForm />
        </div>
      </div>
    </div>
  );
}
