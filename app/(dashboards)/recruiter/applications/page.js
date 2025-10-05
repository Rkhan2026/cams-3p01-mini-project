"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckIcon,
  XIcon,
  CalendarIcon,
  UserAddIcon,
  DownloadIcon,
  ArrowLeftIcon,
} from "../../../../components/ui/Icons.js";

// --- Reusable UI Components ---

const Button = ({ onClick, className, children, ...props }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-transform duration-200 hover:scale-105 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// --- Child Components ---

const StatPill = ({ label, value, color, isActive, onClick }) => {
  const baseStyle =
    "flex items-center justify-center text-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1";
  const activeStyle =
    color === "black"
      ? `bg-black text-white shadow-lg`
      : `bg-${color}-600 text-white shadow-lg`;
  const inactiveTextColor =
    color === "black" ? "text-black" : `text-${color}-600`;
  const inactiveStyle = `bg-white hover:shadow-md border`;

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
    >
      <div>
        <div
          className={`text-2xl font-bold ${
            isActive ? "text-white" : inactiveTextColor
          }`}
        >
          {value}
        </div>
        <div
          className={`text-xs font-medium ${
            isActive ? "text-white opacity-90" : "text-gray-500"
          }`}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

const ApplicationStatsHeader = ({
  stats,
  activeFilter,
  onFilterChange,
  onDownloadReport,
}) => (
  <div className="mb-6">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-gray-800">
        Applications Management
      </h1>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatPill
        label="Total"
        value={stats.total}
        color="black"
        isActive={activeFilter === "ALL"}
        onClick={() => onFilterChange("ALL")}
      />
      <StatPill
        label="New"
        value={stats.applied}
        color="blue"
        isActive={activeFilter === "APPLIED"}
        onClick={() => onFilterChange("APPLIED")}
      />
      <StatPill
        label="Shortlisted"
        value={stats.shortlisted}
        color="yellow"
        isActive={activeFilter === "SHORTLISTED"}
        onClick={() => onFilterChange("SHORTLISTED")}
      />
      <StatPill
        label="Interviews"
        value={stats.interviews}
        color="purple"
        isActive={activeFilter === "INTERVIEW_SCHEDULED"}
        onClick={() => onFilterChange("INTERVIEW_SCHEDULED")}
      />
      <StatPill
        label="Hired"
        value={stats.hired}
        color="green"
        isActive={activeFilter === "HIRED"}
        onClick={() => onFilterChange("HIRED")}
      />
      <StatPill
        label="Rejected"
        value={stats.rejected}
        color="red"
        isActive={activeFilter === "REJECTED"}
        onClick={() => onFilterChange("REJECTED")}
      />
    </div>
  </div>
);

const ApplicationFilters = ({ jobs, selectedJob, onJobChange }) => (
  <div className="mb-6 bg-white p-4 rounded-xl border">
    <label
      htmlFor="job-filter"
      className="block text-sm font-medium text-gray-700 mb-2"
    >
      Filter by Job Posting
    </label>
    <select
      id="job-filter"
      value={selectedJob}
      onChange={onJobChange}
      className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
    >
      <option value="ALL">All Jobs</option>
      {jobs.map((job) => (
        <option key={job.id} value={job.id}>
          {job.title || `Job #${job.id.slice(-6)}`} - {job.recruiter.name}
        </option>
      ))}
    </select>
  </div>
);

const ActionButtons = ({ application, onStatusUpdate }) => {
  const actionsMap = {
    APPLIED: [
      {
        label: "Shortlist",
        status: "SHORTLISTED",
        color: "bg-yellow-500 hover:bg-yellow-600",
        icon: <CheckIcon className="w-4 h-4 mr-1" />,
      },
      {
        label: "Reject",
        status: "REJECTED",
        color: "bg-red-500 hover:bg-red-600",
        icon: <XIcon className="w-4 h-4 mr-1" />,
      },
    ],
    SHORTLISTED: [
      {
        label: "Schedule Interview",
        status: "INTERVIEW_SCHEDULED",
        color: "bg-purple-500 hover:bg-purple-600",
        icon: <CalendarIcon className="w-4 h-4 mr-1" />,
      },
      {
        label: "Reject",
        status: "REJECTED",
        color: "bg-red-500 hover:bg-red-600",
        icon: <XIcon className="w-4 h-4 mr-1" />,
      },
    ],
    INTERVIEW_SCHEDULED: [
      {
        label: "Hire",
        status: "HIRED",
        color: "bg-green-500 hover:bg-green-600",
        icon: <UserAddIcon className="w-4 h-4 mr-1" />,
      },
      {
        label: "Reject",
        status: "REJECTED",
        color: "bg-red-500 hover:bg-red-600",
        icon: <XIcon className="w-4 h-4 mr-1" />,
      },
    ],
  };

  const availableActions = actionsMap[application.applicationStatus] || [];

  return (
    <div className="flex gap-2 flex-wrap items-center mt-4 pt-4 border-t">
      {availableActions.map((action) => (
        <Button
          key={action.status}
          onClick={() => onStatusUpdate(application.id, action.status)}
          className={action.color}
        >
          {action.icon} {action.label}
        </Button>
      ))}
    </div>
  );
};

const ApplicationCard = ({ application, onStatusUpdate }) => {
  const getStatusBadge = (status) => {
    const styles = {
      APPLIED: "bg-blue-100 text-blue-800 border-blue-200",
      SHORTLISTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
      INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-800 border-purple-200",
      HIRED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
          styles[status] || "bg-gray-100"
        }`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const student = application.student;
  const academics = student.academicRecords || {};

  return (
    <div className="bg-white border rounded-xl p-6 shadow-sm transition-shadow hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>
        {getStatusBadge(application.applicationStatus)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-gray-700 text-sm mb-2">
            Student Details
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            {student.facultyNo && (
              <p>
                <strong>Faculty No:</strong> {student.facultyNo}
              </p>
            )}
            {student.enrollmentNo && (
              <p>
                <strong>Enrollment No:</strong> {student.enrollmentNo}
              </p>
            )}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700 text-sm mb-2">
            Academic Snapshot
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong>CGPA:</strong> {academics.currentCGPA || "N/A"}
            </p>
            <p>
              <strong>Course:</strong> {academics.courseEnrolled || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {academics.resumeLink && (
        <div className="mt-4">
          <a
            href={academics.resumeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <DownloadIcon className="w-4 h-4 mr-1.5" /> View Full Resume
          </a>
        </div>
      )}

      <ActionButtons
        application={application}
        onStatusUpdate={onStatusUpdate}
      />
    </div>
  );
};

const EmptyState = () => (
  <div className="text-center py-16 bg-white rounded-xl border">
    <svg
      className="mx-auto h-12 w-12 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      No Applications Found
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      No applications match the current filters.
    </p>
  </div>
);

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
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Loading Applications...
          </p>
        </div>
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
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onStatusUpdate={updateApplicationStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
