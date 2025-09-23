"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Assuming you have a reusable Button component, otherwise, the one provided below works.
// import Button from "@/components/ui/Button";

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

const UserGroupIcon = () => (
  <svg
    className="w-8 h-8 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);
const BriefcaseIcon = () => (
  <svg
    className="w-8 h-8 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
    />
  </svg>
);
const DocumentCheckIcon = () => (
  <svg
    className="w-8 h-8 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);
const ChartBarIcon = () => (
  <svg
    className="w-8 h-8 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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
      <h1 className="text-3xl font-bold mb-2">TPO Admin Dashboard</h1>
      <p className="text-gray-300 text-lg">
        Oversee registrations, manage job postings, and track placements.
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
      Manage <ArrowRightIcon />
    </div>
  </div>
);

const PendingRegistrationsList = ({ registrations, onApprove, onNavigate }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Pending Registrations
      </h2>
      <Button
        onClick={() => onNavigate("/tpo/approvals")}
        className="bg-gray-700 hover:bg-gray-800 text-xs px-3 py-1.5"
      >
        View All
      </Button>
    </div>
    {registrations.length === 0 ? (
      <p className="text-gray-500 text-center py-8">
        No pending registrations.
      </p>
    ) : (
      <div className="space-y-3">
        {registrations.map((user) => (
          <div key={user.id} className="border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  user.type === "Student"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {user.type}
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() =>
                  onApprove(user.id, user.type.toUpperCase(), true)
                }
                className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1"
              >
                Approve
              </Button>
              <Button
                onClick={() =>
                  onApprove(user.id, user.type.toUpperCase(), false)
                }
                className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1"
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const PendingJobsList = ({ jobs, onApprove, onNavigate }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800">
        Pending Job Approvals
      </h2>
      <Button
        onClick={() => onNavigate("/tpo/jobs")}
        className="bg-gray-700 hover:bg-gray-800 text-xs px-3 py-1.5"
      >
        View All
      </Button>
    </div>
    {jobs.length === 0 ? (
      <p className="text-gray-500 text-center py-8">
        No pending job approvals.
      </p>
    ) : (
      <div className="space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-gray-900">
              {job.recruiter.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {job.jobDescription}
            </p>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => onApprove(job.id, true)}
                className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1"
              >
                Approve
              </Button>
              <Button
                onClick={() => onApprove(job.id, false)}
                className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1"
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const SystemAlerts = ({ pendingUsers, pendingJobs, hiredStudents }) => (
  <div className="mt-8 space-y-4">
    {pendingUsers > 0 || pendingJobs > 0 ? (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-4">
        <span className="text-2xl">⏳</span>
        <div>
          <h3 className="font-semibold text-yellow-800">Action Required</h3>
          <p className="text-sm text-yellow-700">
            {pendingUsers} user registration{pendingUsers !== 1 && "s"} and{" "}
            {pendingJobs} job posting{pendingJobs !== 1 && "s"} are awaiting
            approval.
          </p>
        </div>
      </div>
    ) : null}

    {hiredStudents > 0 && (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
        <span className="text-2xl">🎉</span>
        <div>
          <h3 className="font-semibold text-green-800">Placement Success!</h3>
          <p className="text-sm text-green-700">
            Congratulations! {hiredStudents} student
            {hiredStudents > 1 ? "s have" : " has"} been successfully placed.
          </p>
        </div>
      </div>
    )}
  </div>
);

const DashboardSkeleton = () => (
  <div className="p-6 md:p-8 bg-gray-50 min-h-screen animate-pulse">
    {/* Header Skeleton */}
    <div className="mb-8 bg-gray-300 rounded-2xl h-36"></div>

    {/* Stat Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-gray-200 rounded-2xl h-24"></div>
      <div className="bg-gray-200 rounded-2xl h-24"></div>
      <div className="bg-gray-200 rounded-2xl h-24"></div>
      <div className="bg-gray-200 rounded-2xl h-24"></div>
    </div>

    {/* Quick Action Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gray-300 rounded-2xl h-48"></div>
      <div className="bg-gray-300 rounded-2xl h-48"></div>
      <div className="bg-gray-300 rounded-2xl h-48"></div>
    </div>

    {/* Lists Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-200 rounded-2xl h-72"></div>
      <div className="bg-gray-200 rounded-2xl h-72"></div>
    </div>
  </div>
);

// --- Main Parent Component ---

export default function TPODashboard() {
  const [stats, setStats] = useState({
    pendingStudents: 0,
    pendingRecruiters: 0,
    pendingJobs: 0,
    hiredStudents: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [pendingResponse, jobsResponse, applicationsResponse] =
        await Promise.all([
          fetch("/api/auth/pending"),
          fetch("/api/jobs"),
          fetch("/api/applications"),
        ]);

      const pendingResult = await pendingResponse.json();
      const jobsResult = await jobsResponse.json();
      const applicationsResult = await applicationsResponse.json();

      let pendingStudents = [],
        pendingRecruiters = [],
        pendingJobs = [],
        hiredStudents = 0;

      if (pendingResult.success) {
        pendingStudents = pendingResult.data.students || [];
        pendingRecruiters = pendingResult.data.recruiters || [];
        const allPending = [
          ...pendingStudents.map((s) => ({ ...s, type: "Student" })),
          ...pendingRecruiters.map((r) => ({ ...r, type: "Recruiter" })),
        ];
        setRecentRegistrations(allPending.slice(0, 5));
      }

      if (jobsResult.success) {
        const jobs = jobsResult.jobs || [];
        pendingJobs = jobs.filter((job) => job.approvalStatus === "PENDING");
        setRecentJobs(pendingJobs.slice(0, 5));
      }

      if (applicationsResult.success) {
        const applications = applicationsResult.applications || [];
        hiredStudents = applications.filter(
          (app) => app.applicationStatus === "HIRED"
        ).length;
      }

      setStats({
        pendingStudents: pendingStudents.length,
        pendingRecruiters: pendingRecruiters.length,
        pendingJobs: pendingJobs.length,
        hiredStudents: hiredStudents,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserApproval = async (userId, userType, approved) => {
    try {
      const response = await fetch("/api/auth/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userType, approved }),
      });
      const result = await response.json();
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: result.message || "Action completed",
        })
      );
      if (result.success) fetchDashboardData();
    } catch (error) {
      console.error("Error processing user approval:", error);
    }
  };

  const handleJobApproval = async (jobId, approved) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      const result = await response.json();
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: result.message || "Action completed",
        })
      );
      if (result.success) fetchDashboardData();
    } catch (error) {
      console.error("Error processing job approval:", error);
    }
  };

  const handleNavigate = (path) => router.push(path);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <DashboardHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          value={stats.pendingStudents}
          label="Pending Students"
          icon={<UserGroupIcon />}
          iconBgColor="bg-blue-500"
        />
        <StatCard
          value={stats.pendingRecruiters}
          label="Pending Recruiters"
          icon={<UserGroupIcon />}
          iconBgColor="bg-green-500"
        />
        <StatCard
          value={stats.pendingJobs}
          label="Pending Jobs"
          icon={<BriefcaseIcon />}
          iconBgColor="bg-yellow-500"
        />
        <StatCard
          value={stats.hiredStudents}
          label="Students Hired"
          icon={<BriefcaseIcon />}
          iconBgColor="bg-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickActionCard
          title="User Approvals"
          description="Review and approve new student and recruiter registrations."
          icon={<UserGroupIcon />}
          onClick={() => handleNavigate("/tpo/approvals")}
          className="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <QuickActionCard
          title="Job Approvals"
          description="Manage and approve job postings submitted by recruiters."
          icon={<DocumentCheckIcon />}
          onClick={() => handleNavigate("/tpo/jobs")}
          className="bg-gradient-to-br from-green-500 to-green-600"
        />
        <QuickActionCard
          title="View Reports"
          description="Analyze placement data and generate insightful reports."
          icon={<ChartBarIcon />}
          onClick={() => handleNavigate("/tpo/reports")}
          className="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingRegistrationsList
          registrations={recentRegistrations}
          onApprove={handleUserApproval}
          onNavigate={handleNavigate}
        />
        <PendingJobsList
          jobs={recentJobs}
          onApprove={handleJobApproval}
          onNavigate={handleNavigate}
        />
      </div>

      <SystemAlerts
        pendingUsers={stats.pendingStudents + stats.pendingRecruiters}
        pendingJobs={stats.pendingJobs}
        hiredStudents={stats.hiredStudents}
      />
    </div>
  );
}
