import { useRouter } from "next/navigation";
import { CalendarIcon } from "../../icons/DashboardIcons.jsx";
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
      className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function NewJobForm({ onSubmit, loading }) {
  const router = useRouter();
  const minDateTime = new Date().toISOString().slice(0, 16);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const title = (formData.get("jobTitle") || "").toString().trim();
    const description = (formData.get("jobDescription") || "")
      .toString()
      .trim();
    const salary = (formData.get("salary") || "").toString().trim();

    // Validate salary client-side: allow empty or format like '6 LPA' or '6.5 LPA'
    if (salary) {
      const salaryRe = /^\d+(?:\.\d+)?\s+LPA$/i;
      if (!salaryRe.test(salary)) {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail:
              "Salary must be in the format 'X LPA' or 'X.Y LPA' (e.g. 6 LPA).",
          })
        );
        return;
      }
    }

    const degree = (formData.get("degree") || "").toString().trim();
    const minCgpa = (formData.get("minCgpa") || "").toString().trim();
    const classX = (formData.get("classXPercentage") || "").toString().trim();
    const classXII = (formData.get("classXIIPercentage") || "")
      .toString()
      .trim();

    const eligibilityParts = [];
    if (degree) eligibilityParts.push(`Degree: ${degree}`);
    if (minCgpa) eligibilityParts.push(`MinCGPA: ${minCgpa}`);
    if (classX) eligibilityParts.push(`ClassX: ${classX}`);
    if (classXII) eligibilityParts.push(`ClassXII: ${classXII}`);

    const eligibilityCriteria = eligibilityParts.length
      ? eligibilityParts.join("; ")
      : null;

    const salarySection = salary ? `\n\nSalary: ${salary}` : "";
    const combinedDescription = title
      ? `(${title})\n\n${description}${salarySection}`
      : `${description}${salarySection}`;

    const jobData = {
      jobDescription: combinedDescription,
      eligibilityCriteria,
      applicationDeadline: formData.get("applicationDeadline"),
    };

    if (onSubmit) onSubmit(jobData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 w-full pb-2 mb-2">
          Job Details
        </legend>

        <JobFormField id="jobTitle" label="Job Title" required>
          <FormInput
            data-testid="input-jobTitle"
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
            data-testid="textarea-jobDescription"
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <JobFormField id="degree" label="Degree / Course">
            <FormInput
              data-testid="input-degree"
              id="degree"
              name="degree"
              type="text"
              placeholder="e.g., B.Tech in CS/IT"
            />
          </JobFormField>

          <JobFormField id="minCgpa" label="Minimum CGPA">
            <FormInput
              data-testid="input-minCgpa"
              id="minCgpa"
              name="minCgpa"
              type="number"
              step="0.01"
              min="0"
              max="10"
              placeholder="e.g., 7.0"
            />
          </JobFormField>

          <JobFormField id="classXPercentage" label="Class X Percentage">
            <FormInput
              data-testid="input-classX"
              id="classXPercentage"
              name="classXPercentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g., 85"
            />
          </JobFormField>

          <JobFormField id="classXIIPercentage" label="Class XII Percentage">
            <FormInput
              data-testid="input-classXII"
              id="classXIIPercentage"
              name="classXIIPercentage"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g., 85"
            />
          </JobFormField>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <legend className="text-lg font-semibold text-gray-900 border-b border-gray-200 w-full pb-2 mb-2">
          Timeline
        </legend>

        <JobFormField
          id="salary"
          label="Salary / Package"
          helpText={
            "Only the format 'X LPA' or 'X.Y LPA' is accepted in the form. Examples: '6 LPA', '6.5 LPA'."
          }
        >
          <FormInput
            data-testid="input-salary"
            id="salary"
            name="salary"
            type="text"
            placeholder="e.g., 6 LPA or 6.5 LPA"
            aria-describedby="salary-help"
            pattern="^\\d+(?:\\.\\d+)?\\s+LPA$"
            title="Enter salary like '6 LPA' or '6.5 LPA'"
          />
          <p id="salary-help" className="mt-1 text-sm text-gray-500">
            Please enter salary in the form "X LPA" (for example: 6 LPA or 6.5
            LPA).
          </p>
        </JobFormField>

        <JobFormField
          id="applicationDeadline"
          label="Application Deadline"
          helpText="Select the final date and time for receiving applications."
          required
        >
          <div className="relative">
            <FormInput
              data-testid="input-deadline"
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
          {loading ? "Submitting..." : "Submit for Approval"}
        </Button>
      </div>
    </form>
  );
}
