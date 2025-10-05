import { useState, useEffect } from "react";

export default function useTPODashboard() {
  const [stats, setStats] = useState({
    pendingStudents: 0,
    pendingRecruiters: 0,
    pendingJobs: 0,
    hiredStudents: 0,
  });
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    // Data
    stats,
    recentRegistrations,
    recentJobs,
    loading,
    // Actions
    fetchDashboardData,
    handleUserApproval,
    handleJobApproval,
  };
}