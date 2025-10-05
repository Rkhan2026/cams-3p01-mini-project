"use client";

import { useState, useEffect } from "react";

// Import our extracted components
import DashboardHeader from "../../../components/dashboard/shared/DashboardHeader.jsx";
import QuickActionCard from "../../../components/dashboard/shared/QuickActionCard.jsx";
import StudentStats from "../../../components/dashboard/student/StudentStats.jsx";
import RecentJobs from "../../../components/dashboard/student/RecentJobs.jsx";
import RecentApplications from "../../../components/dashboard/student/RecentApplications.jsx";
import Notifications from "../../../components/dashboard/student/Notifications.jsx";
import { FullPageSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import {
  SearchIcon,
  DocumentTextIcon,
  UserIcon,
} from "../../../components/ui/Icons.js";

// Quick Actions component using our extracted QuickActionCard
const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      title: "Browse Jobs",
      description: "Discover new opportunities.",
      icon: <SearchIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/student/jobs"),
      color: "blue",
    },
    {
      title: "My Applications",
      description: "Track your application status.",
      icon: <DocumentTextIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/student/applications"),
      color: "green",
    },
    {
      title: "My Profile",
      description: "Update your information.",
      icon: <UserIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/student/profile"),
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
export default function StudentDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    myApplications: 0,
    pendingApplications: 0,
    shortlisted: 0,
    interviews: 0,
    hired: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simple navigation handler (replace with Next.js's useRouter in your app)
  const handleNavigate = (path) => {
    window.location.href = path;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [jobsRes, appsRes] = await Promise.all([
          fetch("/api/jobs?status=APPROVED"),
          fetch("/api/applications"),
        ]);
        const jobsResult = await jobsRes.json();
        const appsResult = await appsRes.json();

        if (jobsResult.success && appsResult.success) {
          const activeJobs = jobsResult.jobs.filter(
            (job) => new Date(job.applicationDeadline) > new Date()
          );
          const { applications } = appsResult;

          setStats({
            totalJobs: activeJobs.length,
            myApplications: applications.length,
            pendingApplications: applications.filter(
              (app) => app.applicationStatus === "APPLIED"
            ).length,
            shortlisted: applications.filter(
              (app) => app.applicationStatus === "SHORTLISTED"
            ).length,
            interviews: applications.filter(
              (app) => app.applicationStatus === "INTERVIEW_SCHEDULED"
            ).length,
            hired: applications.filter(
              (app) => app.applicationStatus === "HIRED"
            ).length,
          });

          setRecentJobs(activeJobs.slice(0, 3));
          setRecentApplications(applications.slice(0, 3));
          setAppliedJobIds(applications.map(app => app.jobId));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Here you might want to set an error state to show a message to the user
      } finally {
        // Set a timeout to demonstrate the skeleton loader
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FullPageSpinner text="Loading your dashboard..." />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardHeader
          title="Welcome Back, Student! 👋"
          subtitle="Here is your placement journey overview."
          gradient="blue"
        />
        <Notifications
          hiredCount={stats.hired}
          interviewsCount={stats.interviews}
        />
        <StudentStats stats={stats} />
        <QuickActions onNavigate={handleNavigate} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentJobs 
            key={`recent-jobs-${recentApplications.length}`}
            jobs={recentJobs} 
            appliedJobIds={appliedJobIds}
            onNavigate={handleNavigate} 
          />
          <RecentApplications
            applications={recentApplications}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </main>
  );
}
