"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function JobDetailsPage({ params }) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchJobDetails();
    checkApplicationStatus();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs?status=APPROVED`);
      const result = await response.json();
      
      if (result.success) {
        const jobDetails = result.jobs.find(j => j.id === params.id);
        if (jobDetails) {
          setJob(jobDetails);
        } else {
          router.push("/student/jobs");
        }
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const response = await fetch("/api/applications");
      const result = await response.json();
      
      if (result.success) {
        const existingApplication = result.applications.find(app => app.jobId === params.id);
        setHasApplied(!!existingApplication);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: params.id })
      });

      const result = await response.json();

      if (result.success) {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.message })
        );
        setHasApplied(true);
      } else {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.error.message })
        );
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Error submitting application" })
      );
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const isDeadlinePassed = (deadline) => {
    return new Date(deadline) <= new Date();
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading job details...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">Job not found</p>
          <Button onClick={() => router.push("/student/jobs")}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  const deadlinePassed = isDeadlinePassed(job.applicationDeadline);
  const daysLeft = getDaysUntilDeadline(job.applicationDeadline);

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => router.back()}
            className="bg-neutral-500 hover:bg-neutral-600"
          >
            ← Back
          </Button>
          <h1 className="text-2xl font-semibold">Job Details</h1>
        </div>

        {/* Job Information */}
        <div className="bg-white border rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">{job.recruiter.name}</h2>
              <div className="text-sm text-neutral-600 space-y-1">
                <p><strong>Application Deadline:</strong> {formatDate(job.applicationDeadline)}</p>
                {!deadlinePassed && (
                  <p className={`font-medium ${daysLeft <= 3 ? "text-red-600" : daysLeft <= 7 ? "text-orange-600" : "text-green-600"}`}>
                    {daysLeft === 1 ? "Deadline is today!" : `${daysLeft} days remaining`}
                  </p>
                )}
                {deadlinePassed && (
                  <p className="font-medium text-red-600">Application deadline has passed</p>
                )}
              </div>
            </div>
            
            {/* Application Status */}
            <div className="text-right">
              {hasApplied && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                  <p className="text-sm font-medium text-green-800">✓ Application Submitted</p>
                  <p className="text-xs text-green-600">You have already applied for this position</p>
                </div>
              )}
              
              {deadlinePassed && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm font-medium text-red-800">Application Closed</p>
                </div>
              )}
            </div>
          </div>

          {/* Company Profile */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">About the Company</h3>
            <div className="bg-neutral-50 rounded-md p-4">
              <p className="text-sm text-neutral-700">{job.recruiter.companyProfile}</p>
            </div>
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Job Description</h3>
            <div className="bg-neutral-50 rounded-md p-4">
              <p className="text-sm text-neutral-700 whitespace-pre-wrap">{job.jobDescription}</p>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Eligibility Criteria</h3>
            <div className="bg-neutral-50 rounded-md p-4">
              <p className="text-sm text-neutral-700 whitespace-pre-wrap">{job.eligibilityCriteria}</p>
            </div>
          </div>

          {/* Application Actions */}
          <div className="flex gap-4">
            {!hasApplied && !deadlinePassed && (
              <Button
                onClick={handleApply}
                disabled={applying}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {applying ? "Submitting Application..." : "Apply for this Job"}
              </Button>
            )}
            
            <Button
              onClick={() => router.push("/student/applications")}
              className="bg-neutral-500 hover:bg-neutral-600"
            >
              View My Applications
            </Button>
          </div>
        </div>

        {/* Application Instructions */}
        {!hasApplied && !deadlinePassed && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-900 mb-2">Application Process</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click "Apply for this Job" to submit your application</li>
              <li>• Your profile information and academic records will be shared with the recruiter</li>
              <li>• You can track your application status in the "My Applications" section</li>
              <li>• You will receive email notifications about status updates</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}