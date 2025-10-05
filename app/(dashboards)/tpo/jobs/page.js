"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// Import extracted components
import PageHeader from "../../../../components/dashboard/shared/PageHeader.jsx";
import JobApprovalCard from "../../../../components/dashboard/tpo/JobApprovalCard.jsx";
import JobApprovalFilters from "../../../../components/dashboard/tpo/JobApprovalFilters.jsx";
import JobsPageSkeleton from "../../../../components/dashboard/tpo/JobsPageSkeleton.jsx";
import JobsEmptyState from "../../../../components/dashboard/tpo/JobsEmptyState.jsx";

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

      <JobApprovalFilters
        counts={counts}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      {filteredJobs.length === 0 ? (
        <JobsEmptyState activeFilter={activeFilter} />
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
