"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

// Import extracted components
import PageHeader from "../../../../../components/dashboard/shared/PageHeader.jsx";
import JobInfoBlock from "../../../../../components/dashboard/student/JobInfoBlock.jsx";
import JobApplicationStatus from "../../../../../components/dashboard/student/JobApplicationStatus.jsx";
import JobDetailsSkeleton from "../../../../../components/dashboard/student/JobDetailsSkeleton.jsx";
import JobDeadlineInfo from "../../../../../components/dashboard/student/JobDeadlineInfo.jsx";
import JobApplicationActions from "../../../../../components/dashboard/student/JobApplicationActions.jsx";
import JobNotFoundState from "../../../../../components/dashboard/student/JobNotFoundState.jsx";
import ApplicationProcessInfo from "../../../../../components/dashboard/student/ApplicationProcessInfo.jsx";

// --- Main Component ---
export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id;
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // --- Logic and Functions (Unchanged) ---
  const fetchJobDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs?status=APPROVED`);
      const result = await response.json();
      if (result.success) {
        const jobDetails = result.jobs.find((j) => j.id === jobId);
        if (jobDetails) setJob(jobDetails);
        else router.push("/student/jobs");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  }, [jobId, router]);
  const checkApplicationStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/applications");
      const result = await response.json();
      if (result.success) {
        const existing = result.applications.find((app) => app.jobId === jobId);
        setHasApplied(!!existing);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  }, [jobId]);
  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      checkApplicationStatus();
    }
  }, [jobId, fetchJobDetails, checkApplicationStatus]);
  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const result = await response.json();
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: result.message || result.error?.message,
        })
      );
      if (result.success) setHasApplied(true);
    } catch (error) {
      console.error("Error applying for job:", error);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Error submitting application" })
      );
    } finally {
      setApplying(false);
    }
  };


  if (loading) return <JobDetailsSkeleton />;

  if (!job) {
    return (
      <JobNotFoundState onBackToJobs={() => router.push("/student/jobs")} />
    );
  }

  const deadlinePassed = new Date(job.applicationDeadline) <= new Date();

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title={job.title || `Opportunity at ${job.recruiter.name}`}
          subtitle={job.recruiter.name}
          onBack={() => router.push("/student/jobs")}
          buttonText="Back to Jobs"
        />

        <div className="bg-white rounded-xl shadow-sm p-8">
          <JobDeadlineInfo deadline={job.applicationDeadline} />

          <div className="mb-8">
            <JobApplicationStatus
              hasApplied={hasApplied}
              deadlinePassed={deadlinePassed}
            />
          </div>

          <JobInfoBlock title="About the Company">
            {job.recruiter.companyProfile}
          </JobInfoBlock>
          <JobInfoBlock title="Job Description">{job.jobDescription}</JobInfoBlock>
          <JobInfoBlock title="Eligibility Criteria">
            {job.eligibilityCriteria}
          </JobInfoBlock>

          <JobApplicationActions
            hasApplied={hasApplied}
            deadlinePassed={deadlinePassed}
            applying={applying}
            onApply={handleApply}
            onViewApplications={() => router.push("/student/applications")}
          />
        </div>

        <ApplicationProcessInfo showInfo={!hasApplied && !deadlinePassed} />
      </div>
    </div>
  );
}
