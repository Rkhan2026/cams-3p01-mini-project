"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import our extracted components
import DashboardHeader from "../../../components/dashboard/shared/DashboardHeader.jsx";
import QuickActionCard from "../../../components/dashboard/shared/QuickActionCard.jsx";
import RecruiterStats from "../../../components/dashboard/recruiter/RecruiterStats.jsx";
import RecentJobsList from "../../../components/dashboard/recruiter/RecentJobsList.jsx";
import RecentApplicationsList from "../../../components/dashboard/recruiter/RecentApplicationsList.jsx";
import Alerts from "../../../components/dashboard/recruiter/Alerts.jsx";
import { FullPageSpinner } from "../../../components/ui/LoadingSpinner.jsx";
import { 
  PlusCircleIcon, 
  DocumentTextIcon, 
  CollectionIcon 
} from "../../../components/ui/Icons.js";

// Quick Actions component using our extracted QuickActionCard
const QuickActions = ({ onNavigate }) => {
  const actions = [
    {
      title: "Post a New Job",
      description: "Create a new job listing for students to apply.",
      icon: <PlusCircleIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/recruiter/jobs/new"),
      color: "blue"
    },
    {
      title: "Review Applications",
      description: "Manage and review all incoming candidate applications.",
      icon: <DocumentTextIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/recruiter/applications"),
      color: "green"
    },
    {
      title: "Manage All Jobs",
      description: "View, edit, or update your existing job postings.",
      icon: <CollectionIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/recruiter/jobs"),
      color: "purple"
    }
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
          // Sort jobs by creation date (newest first) before taking recent jobs
          const sortedJobs = jobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setRecentJobs(sortedJobs.slice(0, 3));
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
      <QuickActions onNavigate={handleNavigate} />

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
