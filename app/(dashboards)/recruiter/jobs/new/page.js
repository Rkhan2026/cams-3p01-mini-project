"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Import extracted components
import PageHeader from "../../../../../components/dashboard/shared/PageHeader.jsx";
import NewJobForm from "../../../../../components/dashboard/recruiter/NewJobForm.jsx";

// --- Main Page Component ---
export default function NewJobPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJobSubmit = async (jobData) => {
    setLoading(true);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      const result = await response.json();

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
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title="Create a New Job Posting"
          subtitle="Fill in the details below. The posting will be sent for approval."
          onBack={() => router.push("/recruiter/jobs")}
          buttonText="Back to All Jobs"
        />

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
          <NewJobForm onSubmit={handleJobSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}
