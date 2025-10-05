import { useState, useEffect } from "react";

export default function useRecruiterDashboard() {
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    // Data
    stats,
    recentJobs,
    recentApplications,
    loading,
    // Actions
    fetchDashboardData,
  };
}