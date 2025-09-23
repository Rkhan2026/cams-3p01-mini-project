"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// --- Reusable UI Components (can be moved to separate files) ---

const Button = ({ onClick, className, children, ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors duration-300 ${className}`}
    {...props}
  >
    {children}
  </button>
);

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

// --- Child Components ---

const PageHeader = ({ title, subtitle, onBack }) => (
  <div className="mb-8">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all mb-4"
    >
      <ArrowLeftIcon />
      Back to Dashboard
    </button>
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    <p className="text-gray-500 mt-1">{subtitle}</p>
  </div>
);

const FilterTabs = ({ counts, activeFilter, onFilterChange }) => {
  const filters = ["PENDING", "APPROVED", "REJECTED"];
  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      {filters.map((status) => (
        <button
          key={status}
          onClick={() => onFilterChange(status)}
          className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeFilter === status
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {status.charAt(0) + status.slice(1).toLowerCase()}
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              activeFilter === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {counts[status] || 0}
          </span>
        </button>
      ))}
    </div>
  );
};

const JobApprovalCard = ({ job, onApprove }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const statusInfo = {
    APPROVED: {
      text: "✓ This job posting has been approved and is visible to students.",
      className: "text-green-700 bg-green-50 border-green-200",
    },
    REJECTED: {
      text: "✗ This job posting has been rejected and is not visible to students.",
      className: "text-red-700 bg-red-50 border-red-200",
    },
  };
  const currentStatusInfo = statusInfo[job.approvalStatus];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {job.recruiter.name}
          </h3>
          <p className="text-sm text-gray-500">
            <strong>Deadline:</strong> {formatDate(job.applicationDeadline)}
          </p>
          <p className="text-sm text-gray-500">
            <strong>Applications Received:</strong> {job._count.applications}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.approvalStatus === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : job.approvalStatus === "APPROVED"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {job.approvalStatus}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Company Profile
          </h4>
          <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-700 whitespace-pre-wrap">
            {job.recruiter.companyProfile}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Job Description
          </h4>
          <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-700 whitespace-pre-wrap">
            {job.jobDescription}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm text-gray-800 mb-1">
            Eligibility Criteria
          </h4>
          <p className="text-sm bg-gray-50 p-3 rounded-lg text-gray-700 whitespace-pre-wrap">
            {job.eligibilityCriteria}
          </p>
        </div>
      </div>

      {job.approvalStatus === "PENDING" && (
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <Button
            onClick={() => onApprove(job.id, true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Approve
          </Button>
          <Button
            onClick={() => onApprove(job.id, false)}
            className="bg-red-600 hover:bg-red-700"
          >
            Reject
          </Button>
        </div>
      )}

      {currentStatusInfo && (
        <div
          className={`mt-6 p-3 rounded-lg border text-sm ${currentStatusInfo.className}`}
        >
          {currentStatusInfo.text}
        </div>
      )}
    </div>
  );
};

const JobsPageSkeleton = () => (
  <div className="p-6 md:p-8 bg-gray-50 min-h-screen animate-pulse">
    <div className="mb-8">
      <div className="h-10 w-48 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-9 w-64 bg-gray-300 rounded mb-2"></div>
      <div className="h-5 w-96 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-6 mb-6 border-b border-gray-200">
      <div className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
      <div className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
      <div className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
    </div>
    <div className="space-y-6">
      <div className="bg-gray-200 rounded-xl h-64"></div>
      <div className="bg-gray-200 rounded-xl h-64"></div>
    </div>
  </div>
);

// --- Main Parent Component ---

export default function TPOJobsPage() {
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("PENDING");
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Fetch all jobs to get accurate counts for tabs
      const response = await fetch("/api/jobs");
      const result = await response.json();
      if (result.success) {
        setAllJobs(result.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const { filteredJobs, counts } = useMemo(() => {
    const newCounts = { PENDING: 0, APPROVED: 0, REJECTED: 0 };
    allJobs.forEach((job) => {
      if (newCounts[job.approvalStatus] !== undefined) {
        newCounts[job.approvalStatus]++;
      }
    });
    return {
      filteredJobs: allJobs.filter(
        (job) => job.approvalStatus === activeFilter
      ),
      counts: newCounts,
    };
  }, [allJobs, activeFilter]);

  const handleApproval = async (jobId, approved) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const result = await response.json();
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: result.message || "Action completed.",
        })
      );
      if (result.success) {
        fetchJobs(); // Refresh the entire list
      }
    } catch (error) {
      console.error("Error processing approval:", error);
    }
  };

  if (loading) {
    return <JobsPageSkeleton />;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader
        title="Job Postings Management"
        subtitle="Review, approve, or reject job postings submitted by recruiters."
        onBack={() => router.push("/tpo")}
      />

      <FilterTabs
        counts={counts}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {filteredJobs.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl">
          <p className="text-gray-500">
            No {activeFilter.toLowerCase()} job postings found.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <JobApprovalCard
              key={job.id}
              job={job}
              onApprove={handleApproval}
            />
          ))}
        </div>
      )}
    </div>
  );
}
