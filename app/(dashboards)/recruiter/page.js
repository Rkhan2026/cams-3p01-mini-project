"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    pendingJobs: 0,
    approvedJobs: 0,
    rejectedJobs: 0,
    totalApplications: 0,
    newApplications: 0,
    shortlisted: 0,
    hired: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recruiter's jobs
      const jobsResponse = await fetch("/api/jobs?recruiterId=current");
      const jobsResult = await jobsResponse.json();

      // Fetch applications for recruiter's jobs
      const applicationsResponse = await fetch("/api/applications");
      const applicationsResult = await applicationsResponse.json();

      if (jobsResult.success && applicationsResult.success) {
        const jobs = jobsResult.jobs;
        const applications = applicationsResult.applications;

        // Calculate job stats
        const jobStats = {
          totalJobs: jobs.length,
          pendingJobs: jobs.filter((job) => job.approvalStatus === "PENDING")
            .length,
          approvedJobs: jobs.filter((job) => job.approvalStatus === "APPROVED")
            .length,
          rejectedJobs: jobs.filter((job) => job.approvalStatus === "REJECTED")
            .length,
        };

        // Calculate application stats
        const applicationStats = {
          totalApplications: applications.length,
          newApplications: applications.filter(
            (app) => app.applicationStatus === "APPLIED"
          ).length,
          shortlisted: applications.filter(
            (app) => app.applicationStatus === "SHORTLISTED"
          ).length,
          hired: applications.filter((app) => app.applicationStatus === "HIRED")
            .length,
        };

        setStats({ ...jobStats, ...applicationStats });
        setRecentJobs(jobs.slice(0, 3)); // Show 3 most recent jobs
        setRecentApplications(applications.slice(0, 5)); // Show 5 most recent applications
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, type = "job") => {
    if (type === "job") {
      const statusStyles = {
        PENDING: "bg-yellow-100 text-yellow-800",
        APPROVED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
      };
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusStyles[status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {status}
        </span>
      );
    } else {
      const statusStyles = {
        APPLIED: "bg-blue-100 text-blue-800",
        SHORTLISTED: "bg-yellow-100 text-yellow-800",
        INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-800",
        HIRED: "bg-green-100 text-green-800",
        REJECTED: "bg-red-100 text-red-800",
      };

      const statusLabels = {
        APPLIED: "New",
        SHORTLISTED: "Shortlisted",
        INTERVIEW_SCHEDULED: "Interview",
        HIRED: "Hired",
        REJECTED: "Rejected",
      };

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusStyles[status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusLabels[status] || status}
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-black mb-6">Recruiter Dashboard</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black font-semibold">Recruiter Dashboard</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalJobs}
          </div>
          <div className="text-xs text-neutral-600">Total Jobs</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-800">
            {stats.pendingJobs}
          </div>
          <div className="text-xs text-yellow-600">Pending Approval</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-800">
            {stats.approvedJobs}
          </div>
          <div className="text-xs text-green-600">Approved Jobs</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-800">
            {stats.rejectedJobs}
          </div>
          <div className="text-xs text-red-600">Rejected Jobs</div>
        </div>
      </div>

      {/* Application Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neutral-800">
            {stats.totalApplications}
          </div>
          <div className="text-xs text-neutral-600">Total Applications</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-800">
            {stats.newApplications}
          </div>
          <div className="text-xs text-blue-600">New Applications</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-800">
            {stats.shortlisted}
          </div>
          <div className="text-xs text-yellow-600">Shortlisted</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-800">{stats.hired}</div>
          <div className="text-xs text-green-600">Hired</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button
          onClick={() => router.push("/recruiter/jobs/new")}
          className="bg-blue-600 hover:bg-blue-700 p-6 h-auto flex flex-col items-center"
        >
          <div className="text-2xl mb-2">➕</div>
          <div className="font-medium">Post New Job</div>
          <div className="text-xs opacity-80">Create job posting</div>
        </Button>
        <Button
          onClick={() => router.push("/recruiter/applications")}
          className="bg-green-600 hover:bg-green-700 p-6 h-auto flex flex-col items-center"
        >
          <div className="text-2xl mb-2">📋</div>
          <div className="font-medium">Review Applications</div>
          <div className="text-xs opacity-80">Manage candidates</div>
        </Button>
        <Button
          onClick={() => router.push("/recruiter/jobs")}
          className="bg-purple-600 hover:bg-purple-700 p-6 h-auto flex flex-col items-center"
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="font-medium">Manage Jobs</div>
          <div className="text-xs opacity-80">View all postings</div>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-black font-semibold">Recent Job Postings</h2>
            <Button
              onClick={() => router.push("/recruiter/jobs")}
              className="bg-neutral-500 hover:bg-neutral-600 text-sm px-3 py-1"
            >
              View All
            </Button>
          </div>

          {recentJobs.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-neutral-500 mb-2">No job postings yet</p>
              <Button
                onClick={() => router.push("/recruiter/jobs/new")}
                className="bg-blue-600 hover:bg-blue-700 text-sm"
              >
                Create First Job
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="border rounded-md p-3 hover:bg-neutral-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-black">
                      Job #{job.id.slice(-8)}
                    </h3>
                    {getStatusBadge(job.approvalStatus, "job")}
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2 mb-2">
                    {job.jobDescription}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-neutral-500">
                      Deadline: {formatDate(job.applicationDeadline)}
                    </span>
                    <span className="text-xs text-blue-600">
                      {job._count.applications} applications
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-black font-semibold">Recent Applications</h2>
            <Button
              onClick={() => router.push("/recruiter/applications")}
              className="bg-neutral-500 hover:bg-neutral-600 text-sm px-3 py-1"
            >
              View All
            </Button>
          </div>

          {recentApplications.length === 0 ? (
            <p className="text-neutral-500 text-center py-4">
              No applications yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((application) => (
                <div key={application.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-black">
                      {application.student.name}
                    </h3>
                    {getStatusBadge(
                      application.applicationStatus,
                      "application"
                    )}
                  </div>
                  <p className="text-xs text-neutral-600 mb-1">
                    {application.student.email}
                  </p>
                  <div className="text-xs text-neutral-500">
                    Job #{application.job.id.slice(-8)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {stats.newApplications > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">
            📬 New Applications
          </h3>
          <p className="text-sm text-blue-700">
            You have {stats.newApplications} new application
            {stats.newApplications > 1 ? "s" : ""} to review.
          </p>
        </div>
      )}

      {stats.pendingJobs > 0 && (
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">
            ⏳ Pending Approval
          </h3>
          <p className="text-sm text-yellow-700">
            You have {stats.pendingJobs} job posting
            {stats.pendingJobs > 1 ? "s" : ""} awaiting TPO approval.
          </p>
        </div>
      )}
    </div>
  );
}
