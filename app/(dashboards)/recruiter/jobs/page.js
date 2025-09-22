"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function RecruiterJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      // Get current user's jobs
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

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
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
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-black font-semibold mb-6">My Job Postings</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black font-semibold">My Job Postings</h1>
        <Button onClick={() => router.push("/recruiter/jobs/new")}>
          Create New Job
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-black-500 mb-4">No job postings yet</p>
          <Button onClick={() => router.push("/recruiter/jobs/new")}>
            Create Your First Job Posting
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-black font-medium">Job Posting</h3>
                    {getStatusBadge(job.approvalStatus)}
                  </div>
                  <p className="text-sm text-neutral-600 mb-2">
                    <strong>Deadline:</strong>{" "}
                    {formatDate(job.applicationDeadline)}
                  </p>
                  <p className="text-sm text-neutral-600">
                    <strong>Applications:</strong> {job._count.applications}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-black mb-1">
                    Job Description:
                  </h4>
                  <p className="text-sm text-neutral-700 line-clamp-3">
                    {job.jobDescription}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-black mb-1">
                    Eligibility Criteria:
                  </h4>
                  <p className="text-sm text-neutral-700 line-clamp-2">
                    {job.eligibilityCriteria}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => router.push(`/recruiter/jobs/${job.id}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Details
                </Button>
                {job.approvalStatus === "APPROVED" && (
                  <Button
                    onClick={() =>
                      router.push(`/recruiter/jobs/${job.id}/applications`)
                    }
                    className="bg-green-600 hover:bg-green-700"
                  >
                    View Applications ({job._count.applications})
                  </Button>
                )}
                {job.approvalStatus === "PENDING" && (
                  <Button
                    onClick={() =>
                      router.push(`/recruiter/jobs/${job.id}/edit`)
                    }
                    className="bg-neutral-600 hover:bg-neutral-700"
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
