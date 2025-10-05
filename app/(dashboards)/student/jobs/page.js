"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Import extracted components
import JobCard from "../../../../components/dashboard/student/JobCard.jsx";
import JobCardSkeleton from "../../../../components/dashboard/student/JobCardSkeleton.jsx";
import JobsSearchBar from "../../../../components/dashboard/student/JobsSearchBar.jsx";
import JobsEmptyState from "../../../../components/dashboard/student/JobsEmptyState.jsx";
import PageHeader from "../../../../components/dashboard/shared/PageHeader.jsx";

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => fetchJobs(), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = jobs.filter((job) => {
        const titleMatch = job.jobDescription.match(/\(([^)]+)\)/);
        const extractedTitle = titleMatch ? titleMatch[1].toLowerCase() : "";
        return (
          extractedTitle.includes(lowercasedFilter) ||
          job.jobDescription.toLowerCase().includes(lowercasedFilter) ||
          job.recruiter.name.toLowerCase().includes(lowercasedFilter)
        );
      });
      setFilteredJobs(filtered);
    }
  }, [jobs, searchTerm]);

  const fetchJobs = async () => {
    try {
      const [jobsResponse, applicationsResponse] = await Promise.all([
        fetch("/api/jobs?status=APPROVED"),
        fetch("/api/applications")
      ]);
      
      const jobsResult = await jobsResponse.json();
      const applicationsResult = await applicationsResponse.json();
      
      if (jobsResult.success) {
        const activeJobs = jobsResult.jobs.filter(
          (job) => new Date(job.applicationDeadline) > new Date()
        );
        setJobs(activeJobs);
      }
      
      if (applicationsResult.success) {
        setApplications(applicationsResult.applications);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };



  const onBack = () => router.push("/student");

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <JobCardSkeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader
        title="Available Jobs"
        subtitle={`${filteredJobs.length} opportunities waiting for you.`}
        onBack={onBack}
      />

      <JobsSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {filteredJobs.length === 0 ? (
        <JobsEmptyState
          searchTerm={searchTerm}
          onClearSearch={() => setSearchTerm("")}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            // Check if student has already applied to this job
            const hasApplied = applications.some(app => app.jobId === job.id);

            return (
              <JobCard
                key={job.id}
                job={job}
                hasApplied={hasApplied}
                onViewJob={(jobId) => router.push(`/student/jobs/${jobId}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
