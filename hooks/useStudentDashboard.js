import { useState, useEffect } from "react";

export default function useStudentDashboard() {
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
    } finally {
      // Set a timeout to demonstrate the skeleton loader
      setTimeout(() => setLoading(false), 1000);
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
    appliedJobIds,
    loading,
    // Actions
    fetchDashboardData,
  };
}