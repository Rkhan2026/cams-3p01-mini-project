"use client";

// Import our extracted components
import DashboardHeader from "../../../components/dashboard/shared/DashboardHeader.jsx";
import QuickActions from "../../../components/dashboard/shared/QuickActions.jsx";
import StudentStats from "../../../components/dashboard/student/StudentStats.jsx";
import RecentJobs from "../../../components/dashboard/student/RecentJobs.jsx";
import RecentApplications from "../../../components/dashboard/student/RecentApplications.jsx";
import Notifications from "../../../components/dashboard/student/Notifications.jsx";
import { FullPageSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import DashboardActions from "../../../components/dashboard/student/DashboardActions.jsx";
import useStudentDashboard from "../../../hooks/useStudentDashboard.js";

// --- Main Parent Component ---
export default function StudentDashboard() {
  const {
    stats,
    recentJobs,
    recentApplications,
    appliedJobIds,
    loading,
  } = useStudentDashboard();

  // Simple navigation handler (replace with Next.js's useRouter in your app)
  const handleNavigate = (path) => {
    window.location.href = path;
  };

  // Get dashboard actions configuration
  const { quickActions } = DashboardActions({
    onNavigate: handleNavigate,
  });

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
        <QuickActions actions={quickActions} />
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
