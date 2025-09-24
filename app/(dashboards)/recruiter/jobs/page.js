"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// --- Reusable UI Components (can be moved to separate files) ---

const Button = ({
  onClick,
  className,
  children,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    tertiary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- SVG Icon Components ---

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

const PlusIcon = () => (
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
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500"
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

const UsersIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 016-6h6a6 6 0 016 6v1h-3"
    />
  </svg>
);

// --- Child Components ---

const PageHeader = ({ onNewJobClick }) => (
  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
    <div>
      <h1 className="text-3xl font-bold text-gray-800">My Job Postings</h1>
      <p className="text-gray-500 mt-1">
        Manage, view, and create new job opportunities.
      </p>
    </div>
    <Button onClick={onNewJobClick}>
      <PlusIcon />
      Create New Job
    </Button>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusStyles = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    APPROVED: "bg-green-100 text-green-800 border-green-200",
    REJECTED: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        statusStyles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

const JobCard = ({ job, router }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-300">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4 gap-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {job.title || `Job Posting #${job.id.slice(-6)}`}
          </h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <CalendarIcon />
              <span>Deadline: {formatDate(job.applicationDeadline)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <UsersIcon />
              <span>{job._count.applications} Applications</span>
            </div>
          </div>
        </div>
        <StatusBadge status={job.approvalStatus} />
      </div>

      {/* Card Body */}
      <div className="space-y-4 mb-5 pt-4 border-t border-gray-100">
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Description
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {job.jobDescription}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Eligibility
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {job.eligibilityCriteria}
          </p>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
          variant="tertiary"
        >
          View Details
        </Button>
        {job.approvalStatus === "APPROVED" && (
          <Button
            onClick={() =>
              router.push(`/recruiter/jobs/${job.id}/applications`)
            }
          >
            {`View Applications (${job._count.applications})`}
          </Button>
        )}
        {job.approvalStatus === "PENDING" && (
          <Button
            onClick={() => router.push(`/recruiter/jobs/${job.id}/edit`)}
            variant="secondary"
          >
            Edit Posting
          </Button>
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ onNewJobClick }) => (
  <div className="text-center py-16 px-6 bg-white border-2 border-dashed rounded-xl">
    <h3 className="text-xl font-semibold text-gray-800">No Jobs Found</h3>
    <p className="text-gray-500 mt-2 mb-6">
      It looks like you have not posted any jobs yet. Get started now!
    </p>
    <Button onClick={onNewJobClick}>
      <PlusIcon />
      Create Your First Job
    </Button>
  </div>
);

const JobsPageSkeleton = () => (
  <div className="p-6 md:p-8 bg-gray-50 min-h-screen animate-pulse">
    {/* Header Skeleton */}
    <div className="flex justify-between items-center mb-8">
      <div>
        <div className="h-5 w-48 bg-gray-300 rounded mb-3"></div>
        <div className="h-9 w-64 bg-gray-300 rounded"></div>
      </div>
      <div className="h-10 w-40 bg-gray-300 rounded-lg"></div>
    </div>
    {/* Card Skeletons */}
    <div className="space-y-4">
      <div className="h-60 bg-gray-200 rounded-xl"></div>
      <div className="h-60 bg-gray-200 rounded-xl"></div>
      <div className="h-60 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

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
    return <JobsPageSkeleton />;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <Button
        onClick={() => router.push("/recruiter")}
        variant="tertiary"
        className="mb-4"
      >
        <ArrowLeftIcon />
        Back to Dashboard
      </Button>

      <PageHeader onNewJobClick={() => router.push("/recruiter/jobs/new")} />

      {jobs.length === 0 ? (
        <EmptyState onNewJobClick={() => router.push("/recruiter/jobs/new")} />
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
