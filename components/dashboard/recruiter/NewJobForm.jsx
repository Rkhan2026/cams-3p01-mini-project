/**
 * NewJobForm Component
 * 
 * Handles job creation form with validation and submission logic.
 * Maintains existing fieldset organization and styling with all form fields.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "../../icons/DashboardIcons.jsx";
import { SpinnerIcon } from "../../icons/UIIcons.jsx";
import JobFormField from "./JobFormField.jsx";
import TpoApprovalNote from "./TpoApprovalNote.jsx";
import FormInput from "../../ui/FormInput.jsx";
import FormTextarea from "../../ui/FormTextarea.jsx";

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
      className={`${baseStyles} ${variantStyles[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

const NewJobForm = ({ onSubmit, loading }) => {
  const router = useRouter();
  const minDateTime = new Date().toISOString().slice(0, 16);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get("jobTitle");
    const description = formData.get("jobDescription");
    const combinedDescription = `(${title})\n\n${description}`;

    const jobData = {
      jobDescription: combinedDescription,
      eligibilityCriteria: formData.get("eligibilityCriteria"),
      applicationDeadline: formData.get("applicationDeadline"),
    };

    if (onSubmit) {
      onSubmit(jobData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 w-full pb-2 mb-2">
          Job Details
        </legend>
        <JobFormField id="jobTitle" label="Job Title" required>
          <FormInput
            id="jobTitle"
            name="jobTitle"
            type="text"
            required
            placeholder="e.g., Software Engineer Intern"
          />
        </JobFormField>
        <JobFormField
          id="jobDescription"
          label="Job Description"
          helpText="Provide details on responsibilities, requirements, and benefits."
          required
        >
          <FormTextarea
            id="jobDescription"
            name="jobDescription"
            required
            rows={6}
            placeholder="We are looking for a motivated intern to join our dynamic team..."
          />
        </JobFormField>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 w-full pb-2 mb-2">
          Requirements
        </legend>
        <JobFormField
          id="eligibilityCriteria"
          label="Eligibility Criteria"
          helpText="Specify required education, skills, graduation year, etc."
          required
        >
          <FormTextarea
            id="eligibilityCriteria"
            name="eligibilityCriteria"
            required
            rows={4}
            placeholder="- B.Tech in CS/IT (2025 Batch)&#10;- Minimum 7.0 CGPA&#10;- Proficient in JavaScript and React"
          />
        </JobFormField>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 w-full pb-2 mb-2">
          Timeline
        </legend>
        <JobFormField
          id="applicationDeadline"
          label="Application Deadline"
          helpText="Select the final date and time for receiving applications."
          required
        >
          <div className="relative">
            <FormInput
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
        </JobFormField>
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

export default NewJobForm;