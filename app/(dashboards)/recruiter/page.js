"use client";

import { useState, useEffect } from "react";
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

// --- SVG Icon Components (for clarity and reusability) ---

const BriefcaseIcon = () => (
  <svg
    className="w-8 h-8 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
    />
  </svg>
);
const UsersIcon = () => (
  <svg
    className="w-8 h-8 text-white"
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
const PlusCircleIcon = () => (
  <svg
    className="w-10 h-10 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
const DocumentTextIcon = () => (
  <svg
    className="w-10 h-10 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const CollectionIcon = () => (
  <svg
    className="w-10 h-10 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
    />
  </svg>
);
const ArrowRightIcon = () => (
  <svg
    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

// --- Child Components ---

const DashboardHeader = () => (
  <div className="mb-8">
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-lg">
      <h1 className="text-3xl font-bold mb-2">Welcome, Recruiter! 👋</h1>
      <p className="text-gray-300 text-lg">
        Manage your job postings and review candidate applications.
      </p>
    </div>
  </div>
);

const StatCard = ({ value, label, icon, iconBgColor }) => (
  <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div
      className={`w-16 h-16 ${iconBgColor} rounded-xl flex items-center justify-center`}
    >
      {icon}
    </div>
    <div>
      <div className="text-3xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </div>
);

const QuickActionCard = ({ title, description, icon, onClick, className }) => (
  <div
    onClick={onClick}
    className={`group rounded-2xl p-6 text-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform ${className}`}
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-1">{title}</h3>
    <p className="text-sm opacity-90 mb-4">{description}</p>
    <div className="flex items-center font-semibold">
      Proceed <ArrowRightIcon />
    </div>
  </div>
);

const RecentJobsList = ({ jobs, onNavigate }) => {
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  const getStatusBadge = (status) => {
    const styles = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      APPROVED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Job Postings
        </h2>
        <Button
          onClick={() => onNavigate("/recruiter/jobs")}
          className="bg-gray-700 hover:bg-gray-800 text-xs px-3 py-1.5"
        >
          View All
        </Button>
      </div>
      {jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No job postings yet.</p>
          <Button
            onClick={() => onNavigate("/recruiter/jobs/new")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create First Job
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">
                  {job.title || `Job #${job.id.slice(-6)}`}
                </h3>
                {getStatusBadge(job.approvalStatus)}
              </div>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {job.jobDescription}
              </p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Deadline: {formatDate(job.applicationDeadline)}</span>
                <span className="font-medium text-blue-600">
                  {job._count.applications} Applications
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RecentApplicationsList = ({ applications, onNavigate }) => {
  const getStatusBadge = (status) => {
    const styles = {
      APPLIED: "bg-blue-100 text-blue-800 border-blue-200",
      SHORTLISTED: "bg-yellow-100 text-yellow-800 border-yellow-200",
      HIRED: "bg-green-100 text-green-800 border-green-200",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium border ${
          styles[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Recent Applications
        </h2>
        <Button
          onClick={() => onNavigate("/recruiter/applications")}
          className="bg-gray-700 hover:bg-gray-800 text-xs px-3 py-1.5"
        >
          View All
        </Button>
      </div>
      {applications.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No new applications received.
        </p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {app.student.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Applied for:{" "}
                    {app.job.title || `Job #${app.job.id.slice(-6)}`}
                  </p>
                </div>
                {getStatusBadge(app.applicationStatus)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Alerts = ({ newApplications, pendingJobs }) => (
  <div className="mt-8 space-y-4">
    {newApplications > 0 && (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-4">
        <span className="text-2xl">📬</span>
        <div>
          <h3 className="font-semibold text-blue-800">
            New Applications Received
          </h3>
          <p className="text-sm text-blue-700">
            You have {newApplications} new application
            {newApplications > 1 ? "s" : ""} to review.
          </p>
        </div>
      </div>
    )}
    {pendingJobs > 0 && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-4">
        <span className="text-2xl">⏳</span>
        <div>
          <h3 className="font-semibold text-yellow-800">
            Jobs Pending Approval
          </h3>
          <p className="text-sm text-yellow-700">
            You have {pendingJobs} job posting{pendingJobs > 1 ? "s" : ""}{" "}
            awaiting TPO approval.
          </p>
        </div>
      </div>
    )}
  </div>
);

// --- Skeleton Loading Components ---

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex items-center gap-4">
    <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
    <div className="flex-1">
      <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
    </div>
  </div>
);

const QuickActionCardSkeleton = () => (
  <div className="rounded-2xl p-6 bg-gray-200 animate-pulse h-48"></div>
);

const RecentListSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
    </div>
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-3"></div>
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
    {/* Header Skeleton */}
    <div className="mb-8 bg-gray-300 h-36 rounded-2xl p-8 animate-pulse"></div>

    {/* Stat Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
      <StatCardSkeleton />
    </div>

    {/* Quick Actions Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <QuickActionCardSkeleton />
      <QuickActionCardSkeleton />
      <QuickActionCardSkeleton />
    </div>

    {/* Recent Lists Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RecentListSkeleton />
      <RecentListSkeleton />
    </div>
  </div>
);

// --- Main Parent Component ---

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    approvedJobs: 0,
    rejectedJobs: 0,
    totalApplications: 0,
    newApplications: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsResponse, applicationsResponse] = await Promise.all([
          fetch("/api/jobs?recruiterId=current"),
          fetch("/api/applications"),
        ]);

        const jobsResult = await jobsResponse.json();
        const applicationsResult = await applicationsResponse.json();

        if (jobsResult.success) {
          const jobs = jobsResult.jobs;
          setStats((prev) => ({
            ...prev,
            totalJobs: jobs.length,
            pendingJobs: jobs.filter((j) => j.approvalStatus === "PENDING")
              .length,
            approvedJobs: jobs.filter((j) => j.approvalStatus === "APPROVED")
              .length,
            rejectedJobs: jobs.filter((j) => j.approvalStatus === "REJECTED")
              .length,
          }));
          setRecentJobs(jobs.slice(0, 3));
        }

        if (applicationsResult.success) {
          const applications = applicationsResult.applications;
          setStats((prev) => ({
            ...prev,
            totalApplications: applications.length,
            newApplications: applications.filter(
              (app) => app.applicationStatus === "APPLIED"
            ).length,
          }));
          setRecentApplications(applications.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNavigate = (path) => router.push(path);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          value={stats.totalJobs}
          label="Total Jobs Posted"
          icon={<BriefcaseIcon />}
          iconBgColor="bg-blue-500"
        />
        <StatCard
          value={stats.totalApplications}
          label="Total Applications"
          icon={<UsersIcon />}
          iconBgColor="bg-green-500"
        />
        <StatCard
          value={stats.pendingJobs}
          label="Pending Approval"
          icon={<BriefcaseIcon />}
          iconBgColor="bg-yellow-500"
        />
        <StatCard
          value={stats.newApplications}
          label="New Applications"
          icon={<UsersIcon />}
          iconBgColor="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickActionCard
          title="Post a New Job"
          description="Create a new job listing for students to apply."
          icon={<PlusCircleIcon />}
          onClick={() => handleNavigate("/recruiter/jobs/new")}
          className="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <QuickActionCard
          title="Review Applications"
          description="Manage and review all incoming candidate applications."
          icon={<DocumentTextIcon />}
          onClick={() => handleNavigate("/recruiter/applications")}
          className="bg-gradient-to-br from-green-500 to-green-600"
        />
        <QuickActionCard
          title="Manage All Jobs"
          description="View, edit, or update your existing job postings."
          icon={<CollectionIcon />}
          onClick={() => handleNavigate("/recruiter/jobs")}
          className="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentJobsList jobs={recentJobs} onNavigate={handleNavigate} />
        <RecentApplicationsList
          applications={recentApplications}
          onNavigate={handleNavigate}
        />
      </div>

      <Alerts
        newApplications={stats.newApplications}
        pendingJobs={stats.pendingJobs}
      />
    </div>
  );
}
