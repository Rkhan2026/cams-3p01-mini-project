"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function TPOJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`/api/jobs?status=${filter}`);
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

  const handleApproval = async (jobId, approved) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved })
      });

      const result = await response.json();
      if (result.success) {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.message })
        );
        fetchJobs(); // Refresh the list
      } else {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.error.message })
        );
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Error processing approval" })
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Job Postings Management</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Job Postings Management</h1>
      
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["PENDING", "APPROVED", "REJECTED"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {status} ({jobs.filter(job => job.approvalStatus === status).length})
          </button>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500">No {filter.toLowerCase()} job postings</p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium">Job Posting</h3>
                    {getStatusBadge(job.approvalStatus)}
                  </div>
                  <p className="text-sm text-neutral-600 mb-1">
                    <strong>Company:</strong> {job.recruiter.name}
                  </p>
                  <p className="text-sm text-neutral-600 mb-1">
                    <strong>Deadline:</strong> {formatDate(job.applicationDeadline)}
                  </p>
                  <p className="text-sm text-neutral-600">
                    <strong>Applications:</strong> {job._count.applications}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Company Profile:</h4>
                  <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded">
                    {job.recruiter.companyProfile}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Job Description:</h4>
                  <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded">
                    {job.jobDescription}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Eligibility Criteria:</h4>
                  <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded">
                    {job.eligibilityCriteria}
                  </p>
                </div>
              </div>

              {job.approvalStatus === "PENDING" && (
                <div className="flex gap-2 mt-6">
                  <Button
                    onClick={() => handleApproval(job.id, true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve Job Posting
                  </Button>
                  <Button
                    onClick={() => handleApproval(job.id, false)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject Job Posting
                  </Button>
                </div>
              )}

              {job.approvalStatus === "APPROVED" && (
                <div className="mt-6">
                  <p className="text-sm text-green-700 bg-green-50 p-3 rounded">
                    ✓ This job posting has been approved and is visible to students
                  </p>
                </div>
              )}

              {job.approvalStatus === "REJECTED" && (
                <div className="mt-6">
                  <p className="text-sm text-red-700 bg-red-50 p-3 rounded">
                    ✗ This job posting has been rejected and is not visible to students
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}