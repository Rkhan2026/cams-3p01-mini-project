"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function StudentDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    myApplications: 0,
    pendingApplications: 0,
    shortlisted: 0,
    interviews: 0,
    hired: 0
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
      // Fetch available jobs
      const jobsResponse = await fetch("/api/jobs?status=APPROVED");
      const jobsResult = await jobsResponse.json();
      
      // Fetch user applications
      const applicationsResponse = await fetch("/api/applications");
      const applicationsResult = await applicationsResponse.json();

      if (jobsResult.success && applicationsResult.success) {
        const jobs = jobsResult.jobs;
        const applications = applicationsResult.applications;

        // Filter active jobs (not expired)
        const activeJobs = jobs.filter(job => 
          new Date(job.applicationDeadline) > new Date()
        );

        // Calculate stats
        const newStats = {
          totalJobs: activeJobs.length,
          myApplications: applications.length,
          pendingApplications: applications.filter(app => app.applicationStatus === "APPLIED").length,
          shortlisted: applications.filter(app => app.applicationStatus === "SHORTLISTED").length,
          interviews: applications.filter(app => app.applicationStatus === "INTERVIEW_SCHEDULED").length,
          hired: applications.filter(app => app.applicationStatus === "HIRED").length
        };

        setStats(newStats);
        setRecentJobs(activeJobs.slice(0, 3)); // Show 3 most recent jobs
        setRecentApplications(applications.slice(0, 3)); // Show 3 most recent applications
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      APPLIED: "bg-blue-100 text-blue-800",
      SHORTLISTED: "bg-yellow-100 text-yellow-800",
      INTERVIEW_SCHEDULED: "bg-purple-100 text-purple-800",
      HIRED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800"
    };

    const statusLabels = {
      APPLIED: "Applied",
      SHORTLISTED: "Shortlisted",
      INTERVIEW_SCHEDULED: "Interview Scheduled",
      HIRED: "Hired",
      REJECTED: "Rejected"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Student Dashboard</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome Back, Student! 👋</h1>
          <p className="text-blue-100 text-lg">
            Here's your placement journey overview
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalJobs}</div>
          <div className="text-sm text-gray-600">Available Jobs</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.myApplications}</div>
          <div className="text-sm text-gray-600">My Applications</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-800 mb-1">{stats.pendingApplications}</div>
          <div className="text-sm text-blue-700">Pending</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-yellow-800 mb-1">{stats.shortlisted}</div>
          <div className="text-sm text-yellow-700">Shortlisted</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-800 mb-1">{stats.interviews}</div>
          <div className="text-sm text-purple-700">Interviews</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-green-800 mb-1">{stats.hired}</div>
          <div className="text-sm text-green-700">Hired</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          onClick={() => router.push("/student/jobs")}
          className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Browse Jobs</h3>
          <p className="text-gray-600 mb-4">Discover new opportunities and find your perfect match</p>
          <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
            Explore Now
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div
          onClick={() => router.push("/student/applications")}
          className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">My Applications</h3>
          <p className="text-gray-600 mb-4">Track your application status and progress</p>
          <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
            View Status
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        <div
          onClick={() => router.push("/student/profile")}
          className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">My Profile</h3>
          <p className="text-gray-600 mb-4">Update your information and preferences</p>
          <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
            Manage Profile
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Job Opportunities</h2>
            <Button
              onClick={() => router.push("/student/jobs")}
              className="bg-neutral-500 hover:bg-neutral-600 text-sm px-3 py-1"
            >
              View All
            </Button>
          </div>
          
          {recentJobs.length === 0 ? (
            <p className="text-neutral-500 text-center py-4">No jobs available</p>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => {
                const daysLeft = getDaysUntilDeadline(job.applicationDeadline);
                return (
                  <div key={job.id} className="border rounded-md p-3 hover:bg-neutral-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-sm">{job.recruiter.name}</h3>
                      <span className={`text-xs ${daysLeft <= 3 ? "text-red-600" : "text-green-600"}`}>
                        {daysLeft} days left
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 line-clamp-2 mb-2">
                      {job.jobDescription}
                    </p>
                    <Button
                      onClick={() => router.push(`/student/jobs/${job.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1"
                    >
                      View & Apply
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <Button
              onClick={() => router.push("/student/applications")}
              className="bg-neutral-500 hover:bg-neutral-600 text-sm px-3 py-1"
            >
              View All
            </Button>
          </div>
          
          {recentApplications.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-neutral-500 mb-2">No applications yet</p>
              <Button
                onClick={() => router.push("/student/jobs")}
                className="bg-blue-600 hover:bg-blue-700 text-sm"
              >
                Start Applying
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((application) => (
                <div key={application.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{application.job.recruiter.name}</h3>
                    {getStatusBadge(application.applicationStatus)}
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-1 mb-2">
                    {application.job.jobDescription}
                  </p>
                  <div className="text-xs text-neutral-500">
                    Deadline: {formatDate(application.job.applicationDeadline)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Success Messages */}
      {stats.hired > 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">🎉 Congratulations!</h3>
          <p className="text-sm text-green-700">
            You have been hired for {stats.hired} position{stats.hired > 1 ? "s" : ""}! 
            Check your applications for more details.
          </p>
        </div>
      )}

      {/* Interview Reminders */}
      {stats.interviews > 0 && (
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-medium text-purple-800 mb-2">📅 Interview Scheduled</h3>
          <p className="text-sm text-purple-700">
            You have {stats.interviews} interview{stats.interviews > 1 ? "s" : ""} scheduled. 
            Check your email and applications for details.
          </p>
        </div>
      )}
    </div>
  );
}