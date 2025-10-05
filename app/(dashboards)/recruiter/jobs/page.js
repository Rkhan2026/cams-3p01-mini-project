"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import our extracted components
import { JobCard, JobsPageHeader, JobsEmptyState } from "../../../../components/dashboard/recruiter";
import Button from "../../../../components/ui/Button.jsx";
import { FullPageSpinner } from "../../../../components/ui/LoadingSpinner.jsx";
import { ArrowLeftIcon } from "../../../../components/ui/Icons.js";

// --- Main Parent Component ---

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs?recruiterId=current");
      const result = await response.json();
      if (result.success) {
        setJobs(result.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <FullPageSpinner text="Loading your jobs..." />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <Button
        onClick={() => router.push("/recruiter")}
        variant="tertiary"
        className="mb-4"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Dashboard
      </Button>

      <JobsPageHeader onNewJobClick={() => router.push("/recruiter/jobs/new")} />

      {jobs.length === 0 ? (
        <JobsEmptyState onNewJobClick={() => router.push("/recruiter/jobs/new")} />
      ) : (
        <div className="space-y-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} router={router} />
          ))}
        </div>
      )}
    </div>
  );
}
