"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";

export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const jobData = {
      jobDescription: formData.get("jobDescription"),
      eligibilityCriteria: formData.get("eligibilityCriteria"),
      applicationDeadline: formData.get("applicationDeadline")
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData)
      });

      const result = await response.json();

      if (result.success) {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.message })
        );
        router.push("/recruiter/jobs");
      } else {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.error.message })
        );
      }
    } catch (error) {
      console.error("Error creating job:", error);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Error creating job posting" })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Create New Job Posting</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description *</Label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              required
              className="w-full border rounded-md p-3 min-h-[150px]"
              placeholder="Provide a detailed job description including responsibilities, requirements, and benefits..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eligibilityCriteria">Eligibility Criteria *</Label>
            <textarea
              id="eligibilityCriteria"
              name="eligibilityCriteria"
              required
              className="w-full border rounded-md p-3 min-h-[100px]"
              placeholder="Specify the eligibility criteria such as education, experience, skills, etc..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicationDeadline">Application Deadline *</Label>
            <Input
              id="applicationDeadline"
              name="applicationDeadline"
              type="datetime-local"
              required
              min={new Date().toISOString().slice(0, 16)}
            />
            <p className="text-xs text-neutral-500">
              Select the last date and time for applications
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h3 className="font-medium text-blue-900 mb-2">Important Note</h3>
            <p className="text-sm text-blue-800">
              Your job posting will be submitted for TPO approval before it becomes visible to students. 
              You will be notified once the approval decision is made.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? "Creating..." : "Create Job Posting"}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-neutral-500 hover:bg-neutral-600"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}