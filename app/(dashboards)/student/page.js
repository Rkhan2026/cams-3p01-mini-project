"use client";

import { useState, useEffect } from "react";

// --- Icon Components (Grouped for clarity) ---
const Icons = {
  Briefcase: () => (
    <svg
      className="w-6 h-6 text-white"
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
  ),
  DocumentText: () => (
    <svg
      className="w-6 h-6 text-white"
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
  ),
  Clock: () => (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Star: () => (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  ),
  Calendar: () => (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  CheckCircle: () => (
    <svg
      className="w-6 h-6 text-white"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Search: () => (
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
  Profile: () => (
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
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
};

// --- Child Components ---

const DashboardHeader = () => (
  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
    <h1 className="text-3xl md:text-4xl font-bold mb-2">
      Welcome Back, Student! 👋
    </h1>
    <p className="text-blue-100 text-lg">
      Here is your placement journey overview.
    </p>
  </div>
);

const Notifications = ({ hiredCount, interviewsCount }) => (
  <div className="space-y-4 mb-8">
    {hiredCount > 0 && (
      <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 rounded-lg shadow-sm">
        <h3 className="font-bold">🎉 Congratulations!</h3>
        <p>
          You have been hired for {hiredCount} position
          {hiredCount > 1 ? "s" : ""}! Check your applications for details.
        </p>
      </div>
    )}
    {interviewsCount > 0 && (
      <div className="bg-purple-50 border-l-4 border-purple-400 text-purple-700 p-4 rounded-lg shadow-sm">
        <h3 className="font-bold">📅 Interview Scheduled</h3>
        <p>
          You have {interviewsCount} interview{interviewsCount > 1 ? "s" : ""}{" "}
          scheduled. Good luck!
        </p>
      </div>
    )}
  </div>
);

const StatCard = ({
  icon,
  value,
  label,
  cardBg,
  iconBg,
  valueColor,
  labelColor,
}) => (
  <div
    className={`${cardBg} rounded-2xl p-6 shadow-md border hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
  >
    <div
      className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-4`}
    >
      {icon}
    </div>
    <div className={`text-3xl font-bold ${valueColor} mb-1`}>{value}</div>
    <div className={`text-sm font-medium ${labelColor}`}>{label}</div>
  </div>
);

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      icon: <Icons.Briefcase />,
      value: stats.totalJobs,
      label: "Available Jobs",
      cardBg: "bg-white border-gray-100",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      valueColor: "text-gray-900",
      labelColor: "text-gray-500",
    },
    {
      icon: <Icons.DocumentText />,
      value: stats.myApplications,
      label: "Applications",
      cardBg: "bg-white border-gray-100",
      iconBg: "bg-gradient-to-br from-gray-500 to-gray-600",
      valueColor: "text-gray-900",
      labelColor: "text-gray-500",
    },
    {
      icon: <Icons.Clock />,
      value: stats.pendingApplications,
      label: "Pending",
      cardBg: "bg-blue-50 border-blue-200",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      valueColor: "text-blue-800",
      labelColor: "text-blue-600",
    },
    {
      icon: <Icons.Star />,
      value: stats.shortlisted,
      label: "Shortlisted",
      cardBg: "bg-yellow-50 border-yellow-200",
      iconBg: "bg-gradient-to-br from-yellow-400 to-yellow-500",
      valueColor: "text-yellow-800",
      labelColor: "text-yellow-600",
    },
    {
      icon: <Icons.Calendar />,
      value: stats.interviews,
      label: "Interviews",
      cardBg: "bg-purple-50 border-purple-200",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
      valueColor: "text-purple-800",
      labelColor: "text-purple-600",
    },
    {
      icon: <Icons.CheckCircle />,
      value: stats.hired,
      label: "Hired",
      cardBg: "bg-green-50 border-green-200",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
      valueColor: "text-green-800",
      labelColor: "text-green-600",
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

const QuickActionCard = ({
  icon,
  title,
  description,
  linkText,
  color,
  onClick,
}) => (
  <div
    onClick={onClick}
    className="group bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
  >
    <div
      className={`w-16 h-16 ${color.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <div
      className={`flex items-center ${color.text} font-semibold group-hover:${color.hoverText}`}
    >
      {linkText}
      <Icons.ArrowRight />
    </div>
  </div>
);

const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      title: "Browse Jobs",
      description: "Discover new opportunities.",
      linkText: "Explore Now",
      color: {
        bg: "bg-gradient-to-br from-blue-500 to-blue-600",
        text: "text-blue-600",
        hoverText: "text-blue-700",
      },
      path: "/student/jobs",
      icon: <Icons.Search />,
    },
    {
      title: "My Applications",
      description: "Track your application status.",
      linkText: "View Status",
      color: {
        bg: "bg-gradient-to-br from-green-500 to-green-600",
        text: "text-green-600",
        hoverText: "text-green-700",
      },
      path: "/student/applications",
      icon: <Icons.DocumentText />,
    },
    {
      title: "My Profile",
      description: "Update your information.",
      linkText: "Manage Profile",
      color: {
        bg: "bg-gradient-to-br from-purple-500 to-purple-600",
        text: "text-purple-600",
        hoverText: "text-purple-700",
      },
      path: "/student/profile",
      icon: <Icons.Profile />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {actions.map((action, index) => (
        <QuickActionCard
          key={index}
          {...action}
          onClick={() => onNavigate(action.path)}
        />
      ))}
    </div>
  );
};

const EmptyState = ({ title, message, buttonText, onButtonClick }) => (
  <div className="text-center py-12 px-6 bg-gray-50 rounded-lg">
    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
      <Icons.DocumentText />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
    <p className="text-gray-500 mb-4">{message}</p>
    <button
      onClick={onButtonClick}
      className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors"
    >
      {buttonText}
    </button>
  </div>
);

const RecentJobs = ({ jobs, onNavigate }) => {
  const getDaysUntilDeadline = (deadline) =>
    Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Recent Opportunities
        </h2>
        <button
          onClick={() => onNavigate("/student/jobs")}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View All
        </button>
      </div>
      {jobs.length === 0 ? (
        <EmptyState
          title="No Jobs Available"
          message="New opportunities will appear here."
          buttonText="Browse All Jobs"
          onButtonClick={() => onNavigate("/student/jobs")}
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const daysLeft = getDaysUntilDeadline(job.applicationDeadline);
            return (
              <div
                key={job.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {job.recruiter.name}
                  </h3>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      daysLeft <= 3
                        ? "text-red-700 bg-red-100"
                        : "text-green-700 bg-green-100"
                    }`}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {job.jobDescription}
                </p>
                <button
                  onClick={() => onNavigate(`/student/jobs/${job.id}`)}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  View & Apply
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RecentApplications = ({ applications, onNavigate }) => {
  const getStatusBadge = (status) => {
    const styles = {
      APPLIED: "bg-blue-100 text-blue-800",
      SHORTLISTED: "bg-yellow-100 text-yellow-800",
      INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-800",
      HIRED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      default: "bg-gray-100 text-gray-800",
    };
    const labels = {
      APPLIED: "Applied",
      SHORTLISTED: "Shortlisted",
      INTERVIEW_SCHEDULED: "Interview",
      HIRED: "Hired",
      REJECTED: "Rejected",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          styles[status] || styles.default
        }`}
      >
        {labels[status] || status}
      </span>
    );
  };
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
        <button
          onClick={() => onNavigate("/student/applications")}
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          View All
        </button>
      </div>
      {applications.length === 0 ? (
        <EmptyState
          title="No Applications Yet"
          message="Apply for a job to see your status here."
          buttonText="Start Applying"
          onButtonClick={() => onNavigate("/student/jobs")}
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">
                  {app.job.recruiter.name}
                </h3>
                {getStatusBadge(app.applicationStatus)}
              </div>
              <p className="text-sm text-gray-500 line-clamp-1 mb-2">
                {app.job.jobDescription}
              </p>
              <div className="text-xs text-gray-400">
                Deadline: {formatDate(app.job.applicationDeadline)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Skeleton Loader for better UX ---
const DashboardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-40 bg-gray-300 rounded-2xl mb-8"></div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-56 bg-gray-200 rounded-2xl"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="h-80 bg-gray-200 rounded-2xl"></div>
      <div className="h-80 bg-gray-200 rounded-2xl"></div>
    </div>
  </div>
);

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <DashboardSkeleton />
        ) : (
          <>
            <DashboardHeader />
            <Notifications
              hiredCount={stats.hired}
              interviewsCount={stats.interviews}
            />
            <DashboardStats stats={stats} />
            <QuickActions onNavigate={handleNavigate} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentJobs jobs={recentJobs} onNavigate={handleNavigate} />
              <RecentApplications
                applications={recentApplications}
                onNavigate={handleNavigate}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
