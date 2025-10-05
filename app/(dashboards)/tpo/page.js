"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import our extracted components
import {
  DashboardHeader,
  QuickActionCard,
} from "../../../components/dashboard/shared";
import {
  TPOStats,
  PendingRegistrationsList,
  PendingJobsList,
  SystemAlerts,
} from "../../../components/dashboard/tpo";
import { FullPageSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import {
  UserGroupIcon,
  DocumentCheckIcon,
  ChartBarIcon,
} from "../../../components/ui/Icons.js";

// Quick Actions component using our extracted QuickActionCard
const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      title: "User Approvals",
      description:
        "Review and approve new student and recruiter registrations.",
      icon: <UserGroupIcon className="w-8 h-8 text-white" />,
      onClick: () => onNavigate("/tpo/approvals"),
      color: "blue",
    },
    {
      title: "Job Approvals",
      description: "Manage and approve job postings submitted by recruiters.",
      icon: <DocumentCheckIcon className="w-8 h-8 text-white" />,
      onClick: () => onNavigate("/tpo/jobs"),
      color: "green",
    },
    {
      title: "View Reports",
      description: "Analyze placement data and generate insightful reports.",
      icon: <ChartBarIcon className="w-8 h-8 text-white" />,
      onClick: () => onNavigate("/tpo/reports"),
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {actions.map((action, index) => (
        <QuickActionCard key={index} {...action} />
      ))}
    </div>
  );
};

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
    return <FullPageSpinner text="Loading your dashboard..." />;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <DashboardHeader
        title="TPO Admin Dashboard"
        subtitle="Oversee registrations, manage job postings, and track placements."
        gradient="gray"
      />

      <TPOStats stats={stats} />
      <QuickActions onNavigate={handleNavigate} />

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
