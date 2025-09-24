"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// --- Helper Components ---

// New ArrowLeftIcon for the header
const ArrowLeftIcon = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

// The new header component you requested
const PageHeader = ({ title, subtitle, onBack }) => (
  <div>
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all mb-4"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      Back to Dashboard
    </button>
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    <p className="text-gray-500 mt-1">{subtitle}</p>
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const StatisticCard = ({ icon, label, value, color }) => (
  <div
    className={`bg-white border-l-4 ${color} rounded-lg p-4 shadow-sm flex items-center space-x-4`}
  >
    <div className="text-2xl">{icon}</div>
    <div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

const FilterTab = ({ label, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
      isActive
        ? "bg-indigo-600 text-white shadow-md"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {label}
    <span
      className={`text-xs font-semibold rounded-full px-2 py-0.5 ${
        isActive ? "bg-indigo-400 text-white" : "bg-gray-300 text-gray-600"
      }`}
    >
      {count}
    </span>
  </button>
);

const EmptyState = ({ filter, onBrowseJobs }) => (
  <div className="text-center py-16 px-6 bg-gray-50 rounded-lg border-2 border-dashed">
    <div className="mx-auto h-12 w-12 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="12" y1="18" x2="12" y2="12"></line>
        <line x1="9" y1="15" x2="15" y2="15"></line>
      </svg>
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-800">
      {filter === "ALL"
        ? "You haven't applied for any jobs yet"
        : `No applications found for "${filter
            .replace("_", " ")
            .toLowerCase()}"`}
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      {filter === "ALL"
        ? "Get started by browsing available opportunities."
        : "Try selecting another category or browse for new jobs."}
    </p>
    <div className="mt-6">
      <button
        onClick={onBrowseJobs}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Browse Jobs
      </button>
    </div>
  </div>
);

const ApplicationCard = ({ application, onViewDetails, onWithdraw }) => {
  // ... ApplicationCard logic remains the same
  const { job, applicationStatus, appliedAt } = application;

  const statusConfig = useMemo(
    () => ({
      APPLIED: {
        label: "Applied",
        icon: "📝",
        badgeClasses: "bg-blue-100 text-blue-800",
        infoClasses: "bg-blue-50 border-blue-200 text-blue-800",
        infoText: null,
      },
      SHORTLISTED: {
        label: "Shortlisted",
        icon: "⭐",
        badgeClasses: "bg-yellow-100 text-yellow-800",
        infoClasses: "bg-yellow-50 border-yellow-200 text-yellow-800",
        infoText: "You're on the shortlist! The recruiter may reach out soon.",
      },
      INTERVIEW_SCHEDULED: {
        label: "Interview",
        icon: "📅",
        badgeClasses: "bg-purple-100 text-purple-800",
        infoClasses: "bg-purple-50 border-purple-200 text-purple-700",
        infoText: "Interview scheduled! Check your email for details.",
      },
      HIRED: {
        label: "Hired",
        icon: "🎉",
        badgeClasses: "bg-green-100 text-green-800",
        infoClasses: "bg-green-50 border-green-200 text-green-700",
        infoText:
          "Congratulations, you got the job! The recruiter will be in touch.",
      },
      REJECTED: {
        label: "Rejected",
        icon: "❌",
        badgeClasses: "bg-red-100 text-red-800",
        infoClasses: "bg-red-50 border-red-200 text-red-700",
        infoText:
          "Application not selected. Don't give up, more opportunities await!",
      },
      DEFAULT: {
        label: applicationStatus,
        icon: "📋",
        badgeClasses: "bg-gray-100 text-gray-800",
        infoClasses: "",
        infoText: null,
      },
    }),
    [applicationStatus]
  );

  const currentStatus = statusConfig[applicationStatus] || statusConfig.DEFAULT;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
      {/* ... ApplicationCard JSX remains the same */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl">{currentStatus.icon}</span>
            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.badgeClasses}`}
            >
              {currentStatus.label}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Applied on: {formatDate(appliedAt)}
          </p>
        </div>
        <div className="text-sm text-gray-500 mt-2 sm:mt-0">
          Deadline: {formatDate(job.applicationDeadline)}
        </div>
      </div>
      <div className="border-t border-gray-100 pt-4 mb-4">
        <h4 className="font-semibold text-sm mb-2 text-gray-800">
          Company & Recruiter
        </h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Name:</span> {job.recruiter.name}
          </p>
          <p className="line-clamp-2">
            <span className="font-medium">Profile:</span>{" "}
            {job.recruiter.companyProfile}
          </p>
        </div>
      </div>
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2 text-gray-800">
          Job Description
        </h4>
        <p className="text-sm text-gray-700 line-clamp-2">
          {job.jobDescription}
        </p>
      </div>
      {currentStatus.infoText && (
        <div
          className={`mt-4 rounded-lg p-3 text-sm border ${currentStatus.infoClasses}`}
        >
          <p>{currentStatus.infoText}</p>
        </div>
      )}
      <div className="flex gap-3 mt-6 border-t border-gray-100 pt-4">
        <button
          onClick={onViewDetails}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          View Job Details
        </button>
        <button
          onClick={onWithdraw}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Withdraw Application
        </button>
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const router = useRouter();

  // ... All functions (fetchApplications, handleWithdrawApplication) remain the same
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/applications");
      const result = await response.json();
      if (result.success) {
        setApplications(result.applications || []);
      } else {
        console.error("API call was not successful:", result.error);
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplications();
  }, []);
  const handleWithdrawApplication = async (applicationId) => {
    console.log(`Withdrawing application ${applicationId}`);
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
  };

  const applicationStats = useMemo(() => {
    // ... applicationStats logic remains the same
    return applications.reduce(
      (stats, app) => {
        stats[app.applicationStatus] = (stats[app.applicationStatus] || 0) + 1;
        stats.TOTAL = (stats.TOTAL || 0) + 1;
        return stats;
      },
      {
        TOTAL: 0,
        APPLIED: 0,
        SHORTLISTED: 0,
        INTERVIEW_SCHEDULED: 0,
        HIRED: 0,
        REJECTED: 0,
      }
    );
  }, [applications]);

  const filteredApplications = useMemo(() => {
    // ... filteredApplications logic remains the same
    if (filter === "ALL") return applications;
    return applications.filter((app) => app.applicationStatus === filter);
  }, [applications, filter]);

  const filterStatuses = [
    "ALL",
    "APPLIED",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "HIRED",
    "REJECTED",
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* --- MODIFIED HEADER SECTION --- */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-8">
          <PageHeader
            title="My Applications"
            subtitle="Track your job applications and manage your next steps."
            onBack={() => router.push("/student")}
          />
          <div className="mt-4 sm:mt-8 flex-shrink-0">
            <button
              onClick={() => router.push("/student/jobs")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Browse & Apply
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <StatisticCard
            icon="📁"
            label="Total"
            value={applicationStats.TOTAL}
            color="border-gray-500"
          />
          <StatisticCard
            icon="📝"
            label="Applied"
            value={applicationStats.APPLIED}
            color="border-blue-500"
          />
          <StatisticCard
            icon="⭐"
            label="Shortlisted"
            value={applicationStats.SHORTLISTED}
            color="border-yellow-500"
          />
          <StatisticCard
            icon="📅"
            label="Interviews"
            value={applicationStats.INTERVIEW_SCHEDULED}
            color="border-purple-500"
          />
          <StatisticCard
            icon="🎉"
            label="Hired"
            value={applicationStats.HIRED}
            color="border-green-500"
          />
          <StatisticCard
            icon="❌"
            label="Rejected"
            value={applicationStats.REJECTED}
            color="border-red-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 pb-2 overflow-x-auto">
          {filterStatuses.map((status) => (
            <FilterTab
              key={status}
              label={status === "ALL" ? "All" : status.replace("_", " ")}
              count={
                status === "ALL"
                  ? applicationStats.TOTAL
                  : applicationStats[status] || 0
              }
              isActive={filter === status}
              onClick={() => setFilter(status)}
            />
          ))}
        </div>

        {/* Main Content */}
        <main>
          {loading ? (
            <LoadingSpinner />
          ) : filteredApplications.length === 0 ? (
            <EmptyState
              filter={filter}
              onBrowseJobs={() => router.push("/student/jobs")}
            />
          ) : (
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={() =>
                    router.push(`/student/jobs/${application.job.id}`)
                  }
                  onWithdraw={() => handleWithdrawApplication(application.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
