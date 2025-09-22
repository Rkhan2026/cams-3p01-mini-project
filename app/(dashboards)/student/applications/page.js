"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const router = useRouter();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      const result = await response.json();

      if (result.success) {
        setApplications(result.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
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
      REJECTED: "bg-red-100 text-red-800",
    };

    const statusLabels = {
      APPLIED: "Applied",
      SHORTLISTED: "Shortlisted",
      INTERVIEW_SCHEDULED: "Interview Scheduled",
      HIRED: "Hired",
      REJECTED: "Rejected",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusLabels[status] || status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPLIED":
        return "📝";
      case "SHORTLISTED":
        return "⭐";
      case "INTERVIEW_SCHEDULED":
        return "📅";
      case "HIRED":
        return "🎉";
      case "REJECTED":
        return "❌";
      default:
        return "📋";
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filter === "ALL") return true;
    return app.applicationStatus === filter;
  });

  const getApplicationStats = () => {
    const stats = {
      total: applications.length,
      applied: applications.filter((app) => app.applicationStatus === "APPLIED")
        .length,
      shortlisted: applications.filter(
        (app) => app.applicationStatus === "SHORTLISTED"
      ).length,
      interviews: applications.filter(
        (app) => app.applicationStatus === "INTERVIEW_SCHEDULED"
      ).length,
      hired: applications.filter((app) => app.applicationStatus === "HIRED")
        .length,
      rejected: applications.filter(
        (app) => app.applicationStatus === "REJECTED"
      ).length,
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-neutral-900">
          My Applications
        </h1>
        <div className="text-center text-neutral-600">Loading...</div>
      </div>
    );
  }

  const stats = getApplicationStats();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            My Applications
          </h1>
          <p className="text-sm text-neutral-600">
            Track your job applications and next steps.
          </p>
        </div>
        <Button
          onClick={() => router.push("/student/jobs")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Browse Jobs
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 mt-4">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neutral-900">
            {stats.total}
          </div>
          <div className="text-xs text-neutral-600">Total</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-800">
            {stats.applied}
          </div>
          <div className="text-xs text-blue-600">Applied</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-800">
            {stats.shortlisted}
          </div>
          <div className="text-xs text-yellow-600">Shortlisted</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-800">
            {stats.interviews}
          </div>
          <div className="text-xs text-purple-600">Interviews</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-800">{stats.hired}</div>
          <div className="text-xs text-green-600">Hired</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-800">
            {stats.rejected}
          </div>
          <div className="text-xs text-red-600">Rejected</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          "ALL",
          "APPLIED",
          "SHORTLISTED",
          "INTERVIEW_SCHEDULED",
          "HIRED",
          "REJECTED",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
              filter === status
                ? "bg-blue-600 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            {status === "ALL" ? "All" : status.replace("_", " ")}
            {status !== "ALL" &&
              ` (${
                applications.filter((app) => app.applicationStatus === status)
                  .length
              })`}
          </button>
        ))}
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 mb-4">
            {filter === "ALL"
              ? "No applications yet"
              : `No ${filter.toLowerCase().replace("_", " ")} applications`}
          </p>
          {filter === "ALL" && (
            <Button
              onClick={() => router.push("/student/jobs")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Applying for Jobs
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div
              key={application.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">
                      {getStatusIcon(application.applicationStatus)}
                    </span>
                    <h3 className="text-lg font-medium text-neutral-900">
                      {application.job.title}
                    </h3>
                    {getStatusBadge(application.applicationStatus)}
                  </div>
                  <p className="text-sm text-neutral-600">
                    Recruiter: {application.job.recruiter.name}
                  </p>
                  <p className="text-sm text-neutral-600">
                    Applied on: {formatDate(application.appliedAt)}
                  </p>
                  <p className="text-sm text-neutral-600">
                    Deadline: {formatDate(application.job.applicationDeadline)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-1 text-neutral-800">
                    Job Description:
                  </h4>
                  <p className="text-sm text-neutral-700 line-clamp-2">
                    {application.job.jobDescription}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-1 text-neutral-800">
                    Company:
                  </h4>
                  <p className="text-sm text-neutral-700 line-clamp-1">
                    {application.job.recruiter.companyProfile}
                  </p>
                </div>
              </div>

              {/* Status-specific information */}
              {application.applicationStatus === "INTERVIEW_SCHEDULED" && (
                <div className="mt-4 bg-purple-50 border border-purple-200 rounded-md p-3">
                  <p className="text-sm font-medium text-purple-800">
                    📅 Interview Scheduled
                  </p>
                  <p className="text-xs text-purple-600">
                    Check your email for interview details and timing.
                  </p>
                </div>
              )}

              {application.applicationStatus === "HIRED" && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm font-medium text-green-800">
                    Congratulations! You Have been hired!
                  </p>
                  <p className="text-xs text-green-600">
                    The recruiter will contact you with next steps.
                  </p>
                </div>
              )}

              {application.applicationStatus === "REJECTED" && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm font-medium text-red-800">
                    Application not selected
                  </p>
                  <p className="text-xs text-red-600">
                    Keep applying! There are more opportunities available.
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() =>
                    router.push(`/student/jobs/${application.job.id}`)
                  }
                  className="bg-neutral-500 hover:bg-neutral-600 text-white text-sm"
                >
                  View Job Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
