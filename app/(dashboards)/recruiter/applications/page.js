"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "../../../../components/icons/ArrowIcons.jsx";
import LoadingState from "../../../../components/ui/LoadingState.jsx";

// Import extracted components
import ApplicationCard from "../../../../components/dashboard/recruiter/ApplicationCard.jsx";
import ApplicationStatsHeader from "../../../../components/dashboard/recruiter/ApplicationStatsHeader.jsx";
import ApplicationFilters from "../../../../components/dashboard/recruiter/ApplicationFilters.jsx";
import ApplicationsEmptyState from "../../../../components/dashboard/recruiter/ApplicationsEmptyState.jsx";

// --- Main Parent Component ---

export default function RecruiterApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState("ALL");
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const [appsResponse, jobsResponse] = await Promise.all([
        fetch("/api/applications"),
        fetch("/api/jobs?recruiterId=current"),
      ]);
      const appsResult = await appsResponse.json();
      const jobsResult = await jobsResponse.json();

      if (appsResult.success) setApplications(appsResult.applications);
      if (jobsResult.success) setJobs(jobsResult.jobs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(
        `/api/applications/${applicationId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const result = await response.json();
      const toastDetail = result.success
        ? result.message
        : result.error?.message || "An error occurred";

      window.dispatchEvent(new CustomEvent("toast", { detail: toastDetail }));

      if (result.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === applicationId
              ? { ...app, applicationStatus: newStatus }
              : app
          )
        );
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Failed to update status" })
      );
    }
  };

  const filteredApplications = useMemo(
    () =>
      applications.filter((app) => {
        const statusMatch =
          filter === "ALL" || app.applicationStatus === filter;
        const jobMatch = selectedJob === "ALL" || app.jobId === selectedJob;
        return statusMatch && jobMatch;
      }),
    [applications, filter, selectedJob]
  );

  const handleDownloadCsv = useCallback(() => {
    const jobMap = new Map(jobs.map((job) => [job.id, job.title]));
    const headers = [
      "Student Name",
      "Email",
      "Faculty No",
      "Course",
      "CGPA",
      "Status",
      "Applied For Job",
      "Resume Link",
    ];
    const rows = filteredApplications.map((app) =>
      [
        `"${app.student.name}"`,
        `"${app.student.email}"`,
        `"${app.student.facultyNo || "N/A"}"`,
        `"${app.student.academicRecords?.courseEnrolled || "N/A"}"`,
        `"${app.student.academicRecords?.currentCGPA || "N/A"}"`,
        `"${app.applicationStatus}"`,
        `"${jobMap.get(app.jobId) || "N/A"}"`,
        `"${app.student.academicRecords?.resumeLink || "N/A"}"`,
      ].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "applications-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredApplications, jobs]);

  const applicationStats = useMemo(
    () => ({
      total: applications.length,
      applied: applications.filter((app) => app.applicationStatus === "APPLIED")
        .length,
      shortlisted: applications.filter(
        (app) => app.applicationStatus === "SHORTLISTED"
      ).length,
      interviews: applications.filter(
        (app) => app.applicationStatus === "INTERVIEW_SCHEDULED"
      ).length,
      hired: applications.filter((app) => app.applicationStatus === "HIRED")
        .length,
      rejected: applications.filter(
        (app) => app.applicationStatus === "REJECTED"
      ).length,
    }),
    [applications]
  );

  if (loading) {
    return (
      <div className="h-screen bg-gray-50">
        <LoadingState
          message="Loading Applications..."
          size="lg"
          fullScreen={true}
        />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <button
        onClick={() => router.push("/recruiter")}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 transition-all mb-4"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        Back to Dashboard
      </button>

      <ApplicationStatsHeader
        stats={applicationStats}
        activeFilter={filter}
        onFilterChange={setFilter}
        onDownloadReport={handleDownloadCsv}
      />
      <ApplicationFilters
        jobs={jobs}
        selectedJob={selectedJob}
        onJobChange={(e) => setSelectedJob(e.target.value)}
      />

      {filteredApplications.length === 0 ? (
        <ApplicationsEmptyState />
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const jobForApp =
              jobs.find((j) => j.id === application.jobId) || null;
            return (
              <ApplicationCard
                key={application.id}
                application={application}
                job={jobForApp}
                onStatusUpdate={updateApplicationStatus}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
