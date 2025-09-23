"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

// --- Reusable UI Components ---
const Button = ({ onClick, className, children, ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

// --- SVG Components ---
const ArrowLeftIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-5 h-5 mr-2 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    className="w-6 h-6 mr-3 text-green-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const XCircleIcon = () => (
  <svg
    className="w-6 h-6 mr-3 text-red-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// --- Child Components ---
const PageHeader = ({ onBack }) => (
  <div className="mb-6">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
    >
      <ArrowLeftIcon />
      Back to Jobs
    </button>
  </div>
);

const InfoBlock = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">
      {title}
    </h3>
    <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
      {children}
    </div>
  </div>
);

const ApplicationStatus = ({ hasApplied, deadlinePassed }) => {
  if (hasApplied) {
    return (
      <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4 flex items-center">
        <CheckCircleIcon />
        <div>
          <p className="font-semibold text-green-800">Application Submitted</p>
          <p className="text-sm text-green-700">
            You have already applied for this position.
          </p>
        </div>
      </div>
    );
  }
  if (deadlinePassed) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 flex items-center">
        <XCircleIcon />
        <div>
          <p className="font-semibold text-red-800">Applications Closed</p>
          <p className="text-sm text-red-700">
            The deadline for this job has passed.
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const JobDetailsSkeleton = () => (
  <div className="p-6 md:p-8 bg-gray-50 min-h-screen animate-pulse">
    <div className="max-w-4xl mx-auto">
      <div className="h-8 w-40 bg-gray-300 rounded-lg mb-8"></div>
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="h-10 w-3/4 bg-gray-300 rounded mb-4"></div>
        <div className="h-6 w-1/2 bg-gray-200 rounded mb-8"></div>
        <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-2 mb-8">
          <div className="h-5 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="h-8 w-48 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded"></div>
          <div className="h-5 bg-gray-200 rounded w-5/6"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---
export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id;
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  // --- useCallback functions ---
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

  // --- useEffect ---
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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getDaysUntilDeadline = (deadline) => {
    const diffTime = new Date(deadline) - new Date();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) return <JobDetailsSkeleton />;

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg mb-4">Job not found or invalid.</p>
        <Button
          onClick={() => router.push("/student/jobs")}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Back to Jobs
        </Button>
      </div>
    );
  }

  const deadlinePassed = new Date(job.applicationDeadline) <= new Date();
  const daysLeft = getDaysUntilDeadline(job.applicationDeadline);

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <PageHeader onBack={() => router.back()} />

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {job.title || `Opportunity at ${job.recruiter.name}`}
            </h1>
            <p className="text-lg text-gray-600 mt-1">{job.recruiter.name}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-8">
            <div className="flex items-center text-base">
              <CalendarIcon />
              <strong className="text-gray-700">Deadline:</strong>
              <span className="ml-2 font-medium text-gray-900">
                {formatDate(job.applicationDeadline)}
              </span>
              {!deadlinePassed && (
                <span
                  className={`ml-4 font-semibold text-sm px-3 py-1 rounded-full ${
                    daysLeft <= 3
                      ? "bg-red-100 text-red-700"
                      : daysLeft <= 7
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {daysLeft <= 1 ? "Ends Today!" : `${daysLeft} days left`}
                </span>
              )}
            </div>
          </div>

          <div className="mb-8">
            <ApplicationStatus
              hasApplied={hasApplied}
              deadlinePassed={deadlinePassed}
            />
          </div>

          <InfoBlock title="About the Company">
            {job.recruiter.companyProfile}
          </InfoBlock>
          <InfoBlock title="Job Description">{job.jobDescription}</InfoBlock>
          <InfoBlock title="Eligibility Criteria">
            {job.eligibilityCriteria}
          </InfoBlock>

          <div className="border-t pt-6 flex items-center gap-4">
            {!hasApplied && !deadlinePassed && (
              <Button
                onClick={handleApply}
                disabled={applying}
                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 min-w-[180px]"
              >
                {applying ? "Submitting..." : "Apply for this Job"}
              </Button>
            )}

            <Button
              onClick={() => router.push("/student/applications")}
              className="bg-gray-600 hover:bg-gray-700 focus:ring-gray-500"
            >
              View My Applications
            </Button>
          </div>
        </div>

        {!hasApplied && !deadlinePassed && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">
              Application Process
            </h4>
            <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
              <li>
                Click &quot;Apply for this Job&quot; to submit your application.
              </li>
              <li>
                Your profile and academic records will be shared with the
                recruiter.
              </li>
              <li>
                You can track your status in the &quot;My Applications&quot;
                section.
              </li>
              <li>
                You will receive email notifications about any status updates.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
