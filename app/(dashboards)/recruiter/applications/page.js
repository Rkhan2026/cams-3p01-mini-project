"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function RecruiterApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedJob, setSelectedJob] = useState("ALL");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchApplications();
    fetchJobs();
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

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs?recruiterId=current");
      const result = await response.json();
      
      if (result.success) {
        setJobs(result.jobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (result.success) {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.message })
        );
        fetchApplications(); // Refresh the list
      } else {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.error.message })
        );
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Error updating application status" })
      );
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status] || "bg-gray-100 text-gray-800"}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

  const getStatusActions = (application) => {
    const currentStatus = application.applicationStatus;
    const actions = [];

    if (currentStatus === "APPLIED") {
      actions.push(
        <Button
          key="shortlist"
          onClick={() => updateApplicationStatus(application.id, "SHORTLISTED")}
          className="bg-yellow-600 hover:bg-yellow-700 text-xs px-3 py-1"
        >
          Shortlist
        </Button>
      );
      actions.push(
        <Button
          key="reject"
          onClick={() => updateApplicationStatus(application.id, "REJECTED")}
          className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1"
        >
          Reject
        </Button>
      );
    }

    if (currentStatus === "SHORTLISTED") {
      actions.push(
        <Button
          key="interview"
          onClick={() => updateApplicationStatus(application.id, "INTERVIEW_SCHEDULED")}
          className="bg-purple-600 hover:bg-purple-700 text-xs px-3 py-1"
        >
          Schedule Interview
        </Button>
      );
      actions.push(
        <Button
          key="reject"
          onClick={() => updateApplicationStatus(application.id, "REJECTED")}
          className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1"
        >
          Reject
        </Button>
      );
    }

    if (currentStatus === "INTERVIEW_SCHEDULED") {
      actions.push(
        <Button
          key="hire"
          onClick={() => updateApplicationStatus(application.id, "HIRED")}
          className="bg-green-600 hover:bg-green-700 text-xs px-3 py-1"
        >
          Hire
        </Button>
      );
      actions.push(
        <Button
          key="reject"
          onClick={() => updateApplicationStatus(application.id, "REJECTED")}
          className="bg-red-600 hover:bg-red-700 text-xs px-3 py-1"
        >
          Reject
        </Button>
      );
    }

    return actions;
  };

  const filteredApplications = applications.filter(app => {
    if (filter !== "ALL" && app.applicationStatus !== filter) return false;
    if (selectedJob !== "ALL" && app.jobId !== selectedJob) return false;
    return true;
  });

  const getApplicationStats = () => {
    const stats = {
      total: applications.length,
      applied: applications.filter(app => app.applicationStatus === "APPLIED").length,
      shortlisted: applications.filter(app => app.applicationStatus === "SHORTLISTED").length,
      interviews: applications.filter(app => app.applicationStatus === "INTERVIEW_SCHEDULED").length,
      hired: applications.filter(app => app.applicationStatus === "HIRED").length,
      rejected: applications.filter(app => app.applicationStatus === "REJECTED").length
    };
    return stats;
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Applications Management</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const stats = getApplicationStats();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Applications Management</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neutral-800">{stats.total}</div>
          <div className="text-xs text-neutral-600">Total</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-800">{stats.applied}</div>
          <div className="text-xs text-blue-600">New</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-800">{stats.shortlisted}</div>
          <div className="text-xs text-yellow-600">Shortlisted</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-800">{stats.interviews}</div>
          <div className="text-xs text-purple-600">Interviews</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-800">{stats.hired}</div>
          <div className="text-xs text-green-600">Hired</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-800">{stats.rejected}</div>
          <div className="text-xs text-red-600">Rejected</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto">
          {["ALL", "APPLIED", "SHORTLISTED", "INTERVIEW_SCHEDULED", "HIRED", "REJECTED"].map((status) => (
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
            </button>
          ))}
        </div>

        {/* Job Filter */}
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="ALL">All Jobs</option>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              Job #{job.id.slice(-8)} - {job.recruiter.name}
            </option>
          ))}
        </select>
      </div>

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 mb-4">No applications found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium">{application.student.name}</h3>
                    {getStatusBadge(application.applicationStatus)}
                  </div>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p><strong>Email:</strong> {application.student.email}</p>
                    {application.student.facultyNo && (
                      <p><strong>Faculty No:</strong> {application.student.facultyNo}</p>
                    )}
                    {application.student.enrollmentNo && (
                      <p><strong>Enrollment No:</strong> {application.student.enrollmentNo}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Records */}
              {application.student.academicRecords && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Academic Records:</h4>
                  <div className="bg-neutral-50 dark:bg-gray-700 rounded-md p-3 space-y-2 text-sm">
                    {application.student.academicRecords.classXPercentage && (
                      <div><strong>Class X:</strong> {application.student.academicRecords.classXPercentage}%</div>
                    )}
                    {application.student.academicRecords.classXIIPercentage && (
                      <div><strong>Class XII:</strong> {application.student.academicRecords.classXIIPercentage}%</div>
                    )}
                    {application.student.academicRecords.courseEnrolled && (
                      <div><strong>Course:</strong> {application.student.academicRecords.courseEnrolled}</div>
                    )}
                    {application.student.academicRecords.college && (
                      <div><strong>College:</strong> {application.student.academicRecords.college}</div>
                    )}
                    {application.student.academicRecords.currentCGPA && (
                      <div><strong>Current CGPA:</strong> {application.student.academicRecords.currentCGPA}</div>
                    )}
                    {application.student.academicRecords.currentYearSemester && (
                      <div><strong>Year/Semester:</strong> {application.student.academicRecords.currentYearSemester}</div>
                    )}
                    {application.student.academicRecords.resumeLink && (
                      <div>
                        <strong>Resume:</strong> 
                        <a 
                          href={application.student.academicRecords.resumeLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-2 underline"
                        >
                          View Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Job Information */}
              <div className="mb-4 bg-blue-50 rounded-md p-3">
                <h4 className="font-medium text-sm mb-1">Applied for:</h4>
                <p className="text-sm text-blue-800">Job #{application.job.id.slice(-8)}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 flex-wrap">
                {getStatusActions(application)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}