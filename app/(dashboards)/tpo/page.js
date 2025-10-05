"use client";

import { useRouter } from "next/navigation";

// Import our extracted components
import {
  DashboardHeader,
} from "../../../components/dashboard/shared";
import QuickActions from "../../../components/dashboard/shared/QuickActions.jsx";
import {
  TPOStats,
  PendingRegistrationsList,
  PendingJobsList,
  SystemAlerts,
} from "../../../components/dashboard/tpo";
import { FullPageSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import DashboardActions from "../../../components/dashboard/tpo/DashboardActions.jsx";
import useTPODashboard from "../../../hooks/useTPODashboard.js";

// --- Main Parent Component ---

export default function TPODashboard() {
  const router = useRouter();
  const {
    stats,
    recentRegistrations,
    recentJobs,
    loading,
    handleUserApproval,
    handleJobApproval,
  } = useTPODashboard();

  const handleNavigate = (path) => router.push(path);

  // Get dashboard actions configuration
  const { quickActions } = DashboardActions({
    onUserApproval: handleUserApproval,
    onJobApproval: handleJobApproval,
    onNavigate: handleNavigate,
  });

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
      <QuickActions actions={quickActions} />

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
