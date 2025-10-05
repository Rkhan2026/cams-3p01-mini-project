"use client";

import { useRouter } from "next/navigation";

// Import our extracted components
import DashboardHeader from "../../../components/dashboard/shared/DashboardHeader.jsx";
import QuickActions from "../../../components/dashboard/shared/QuickActions.jsx";
import RecruiterStats from "../../../components/dashboard/recruiter/RecruiterStats.jsx";
import RecentJobsList from "../../../components/dashboard/recruiter/RecentJobsList.jsx";
import RecentApplicationsList from "../../../components/dashboard/recruiter/RecentApplicationsList.jsx";
import Alerts from "../../../components/dashboard/recruiter/Alerts.jsx";
import { FullPageSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import DashboardActions from "../../../components/dashboard/recruiter/DashboardActions.jsx";
import useRecruiterDashboard from "../../../hooks/useRecruiterDashboard.js";

// --- Main Parent Component ---

export default function RecruiterDashboard() {
  const router = useRouter();
  const {
    stats,
    recentJobs,
    recentApplications,
    loading,
  } = useRecruiterDashboard();

  const handleNavigate = (path) => router.push(path);

  // Get dashboard actions configuration
  const { quickActions } = DashboardActions({
    onNavigate: handleNavigate,
  });

  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <FullPageSpinner text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <DashboardHeader 
        title="Welcome, Recruiter! 👋"
        subtitle="Manage your job postings and review candidate applications."
        gradient="gray"
      />

      <RecruiterStats stats={stats} />
      <QuickActions actions={quickActions} />

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
