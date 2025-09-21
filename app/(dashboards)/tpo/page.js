"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function TPODashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingStudents: 0,
    pendingRecruiters: 0,
    approvedUsers: 0,
    totalJobs: 0,
    pendingJobs: 0,
    approvedJobs: 0,
    totalApplications: 0,
    activeApplications: 0,
    hiredStudents: 0
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
      // Fetch pending registrations
      const pendingResponse = await fetch("/api/auth/pending");
      const pendingResult = await pendingResponse.json();
      
      // Fetch all jobs
      const jobsResponse = await fetch("/api/jobs");
      const jobsResult = await jobsResponse.json();
      
      // Fetch all applications
      const applicationsResponse = await fetch("/api/applications");
      const applicationsResult = await applicationsResponse.json();

      if (pendingResult.success && jobsResult.success && applicationsResult.success) {
        const pendingData = pendingResult.data;
        const jobs = jobsResult.jobs;
        const applications = applicationsResult.applications;

        // Calculate user stats
        const userStats = {
          pendingStudents: pendingData.students.length,
          pendingRecruiters: pendingData.recruiters.length,
          totalUsers: pendingData.students.length + pendingData.recruiters.length,
          approvedUsers: 0 // This would need additional API call for approved users
        };

        // Calculate job stats
        const jobStats = {
          totalJobs: jobs.length,
          pendingJobs: jobs.filter(job => job.approvalStatus === "PENDING").length,
          approvedJobs: jobs.filter(job => job.approvalStatus === "APPROVED").length
        };

        // Calculate application stats
        const applicationStats = {
          totalApplications: applications.length,
          activeApplications: applications.filter(app => 
            ["APPLIED", "SHORTLISTED", "INTERVIEW_SCHEDULED"].includes(app.applicationStatus)
          ).length,
          hiredStudents: applications.filter(app => app.applicationStatus === "HIRED").length
        };

        setStats({ ...userStats, ...jobStats, ...applicationStats });
        
        // Combine recent registrations
        const allPending = [
          ...pendingData.students.map(s => ({ ...s, type: "Student" })),
          ...pendingData.recruiters.map(r => ({ ...r, type: "Recruiter" }))
        ];
        setRecentRegistrations(allPending.slice(0, 5));
        setRecentJobs(jobs.filter(job => job.approvalStatus === "PENDING").slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApproval = async (userId, userType, approved) => {
    try {
      const response = await fetch("/api/auth/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userType, approved })
      });

      const result = await response.json();
      if (result.success) {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.message })
        );
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error("Error processing approval:", error);
    }
  };

  const handleJobApproval = async (jobId, approved) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved })
      });

      const result = await response.json();
      if (result.success) {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.message })
        );
        fetchDashboardData(); // Refresh data
      }
    } catch (error) {
      console.error("Error processing job approval:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">TPO Admin Dashboard</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">TPO Admin Dashboard</h1>
        <div className="text-sm text-neutral-600">
          System administration and oversight
        </div>
      </div>

      {/* User Statistics */}
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-3">User Management</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">{stats.pendingStudents}</div>
            <div className="text-xs text-blue-600">Pending Students</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{stats.pendingRecruiters}</div>
            <div className="text-xs text-green-600">Pending Recruiters</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-800">{stats.pendingJobs}</div>
            <div className="text-xs text-yellow-600">Pending Jobs</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-800">{stats.totalApplications}</div>
            <div className="text-xs text-purple-600">Total Applications</div>
          </div>
        </div>
      </div>

      {/* Job & Application Statistics */}
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-3">Placement Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-neutral-800">{stats.totalJobs}</div>
            <div className="text-xs text-neutral-600">Total Jobs</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{stats.approvedJobs}</div>
            <div className="text-xs text-green-600">Approved Jobs</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-800">{stats.activeApplications}</div>
            <div className="text-xs text-blue-600">Active Applications</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-800">{stats.hiredStudents}</div>
            <div className="text-xs text-green-600">Students Hired</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Button
          onClick={() => router.push("/tpo/approvals")}
          className="bg-blue-600 hover:bg-blue-700 p-6 h-auto flex flex-col items-center"
        >
          <div className="text-2xl mb-2">👥</div>
          <div className="font-medium">User Approvals</div>
          <div className="text-xs opacity-80">Review registrations</div>
        </Button>
        <Button
          onClick={() => router.push("/tpo/jobs")}
          className="bg-green-600 hover:bg-green-700 p-6 h-auto flex flex-col items-center"
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="font-medium">Job Management</div>
          <div className="text-xs opacity-80">Approve job postings</div>
        </Button>
        <Button
          onClick={() => router.push("/tpo/reports")}
          className="bg-purple-600 hover:bg-purple-700 p-6 h-auto flex flex-col items-center"
        >
          <div className="text-2xl mb-2">📈</div>
          <div className="font-medium">Reports</div>
          <div className="text-xs opacity-80">Placement analytics</div>
        </Button>
        <Button
          onClick={() => router.push("/tpo/applications")}
          className="bg-orange-600 hover:bg-orange-700 p-6 h-auto flex flex-col items-center"
        >
          <div className="text-2xl mb-2">📋</div>
          <div className="font-medium">Applications</div>
          <div className="text-xs opacity-80">Monitor progress</div>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Registrations */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pending Registrations</h2>
            <Button
              onClick={() => router.push("/tpo/approvals")}
              className="bg-neutral-500 hover:bg-neutral-600 text-sm px-3 py-1"
            >
              View All
            </Button>
          </div>
          
          {recentRegistrations.length === 0 ? (
            <p className="text-neutral-500 text-center py-4">No pending registrations</p>
          ) : (
            <div className="space-y-3">
              {recentRegistrations.map((user) => (
                <div key={user.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-sm">{user.name}</h3>
                      <p className="text-xs text-neutral-600">{user.email}</p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {user.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() => handleQuickApproval(user.id, user.userType || user.type.toUpperCase(), true)}
                      className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleQuickApproval(user.id, user.userType || user.type.toUpperCase(), false)}
                      className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Job Approvals */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Pending Job Approvals</h2>
            <Button
              onClick={() => router.push("/tpo/jobs")}
              className="bg-neutral-500 hover:bg-neutral-600 text-sm px-3 py-1"
            >
              View All
            </Button>
          </div>
          
          {recentJobs.length === 0 ? (
            <p className="text-neutral-500 text-center py-4">No pending job approvals</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div key={job.id} className="border rounded-md p-3">
                  <div className="mb-2">
                    <h3 className="font-medium text-sm">{job.recruiter.name}</h3>
                    <p className="text-xs text-neutral-600 line-clamp-2">
                      {job.jobDescription}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleJobApproval(job.id, true)}
                      className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleJobApproval(job.id, false)}
                      className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Alerts */}
      {(stats.pendingStudents > 0 || stats.pendingRecruiters > 0) && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">⏳ Pending Approvals</h3>
          <p className="text-sm text-yellow-700">
            {stats.pendingStudents + stats.pendingRecruiters} user registration{stats.pendingStudents + stats.pendingRecruiters > 1 ? "s" : ""} 
            {stats.pendingJobs > 0 && ` and ${stats.pendingJobs} job posting${stats.pendingJobs > 1 ? "s" : ""}`} 
            awaiting your approval.
          </p>
        </div>
      )}

      {stats.hiredStudents > 0 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">🎉 Placement Success</h3>
          <p className="text-sm text-green-700">
            {stats.hiredStudents} student{stats.hiredStudents > 1 ? "s have" : " has"} been successfully placed!
          </p>
        </div>
      )}
    </div>
  );
}