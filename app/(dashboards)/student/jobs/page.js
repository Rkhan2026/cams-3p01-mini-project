"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { 
  SearchIcon, 
  BriefcaseIcon, 
  ArrowLeftIcon, 
  MoneyIcon 
} from "../../../../components/ui/Icons.js";

const JobCardSkeleton = () => (
  <div className="bg-white border rounded-2xl p-6 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="w-3/4 h-6 bg-gray-200 rounded"></div>
      <div className="w-1/4 h-6 bg-gray-200 rounded"></div>
    </div>
    <div className="w-1/2 h-4 mt-2 bg-gray-200 rounded"></div>
    <div className="mt-4 space-y-2">
      <div className="w-full h-4 bg-gray-200 rounded"></div>
      <div className="w-full h-4 bg-gray-200 rounded"></div>
      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
    </div>
    <div className="mt-6 w-full h-10 bg-gray-200 rounded-lg"></div>
  </div>
);

const PageHeader = ({ title, subtitle, onBack }) => (
  <div className="mb-8">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all mb-4"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      Back to Dashboard
    </button>
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    <p className="text-gray-500 mt-1">{subtitle}</p>
  </div>
);

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

  const getDeadlineStatus = (deadline) => {
    const diffDays = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 1)
      return {
        text: "Closes today",
        textColor: "text-red-600",
        bgColor: "bg-red-100",
      };
    if (diffDays <= 3)
      return {
        text: `${diffDays} days left`,
        textColor: "text-orange-500",
        bgColor: "bg-orange-100",
      };
    return {
      text: `${diffDays} days left`,
      textColor: "text-green-600",
      bgColor: "bg-green-100",
    };
  };

  const onBack = () => router.push("/student");

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="h-10 w-1/3 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <JobCardSkeleton />
          <JobCardSkeleton />
          <JobCardSkeleton />
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

      <div className="relative w-full md:w-80 mb-8">
        <Input
          type="text"
          placeholder="Search by company, role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 py-2.5 rounded-xl text-gray-900"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {searchTerm
              ? "No jobs match your search"
              : "No jobs available right now"}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {searchTerm
              ? "Try adjusting your keywords or clearing the search."
              : "Please check back later for new opportunities."}
          </p>
          {searchTerm && (
            <Button onClick={() => setSearchTerm("")} className="mt-6">
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const deadlineStatus = getDeadlineStatus(job.applicationDeadline);
            const titleMatch = job.jobDescription.match(/\(([^)]+)\)/);
            const displayTitle = titleMatch
              ? titleMatch[1]
              : "Job Title Not Specified";
            const displayDescription = job.jobDescription.replace(
              /\(([^)]+)\)\s*\n*/,
              ""
            );
            
            // Check if student has already applied to this job
            const hasApplied = applications.some(app => app.jobId === job.id);

            return (
              <div
                key={job.id}
                className="bg-white border rounded-2xl p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* --- FIX START: Wrapped content in a new div with flex-grow --- */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {displayTitle}
                      </h3>
                      <p className="text-sm font-medium text-gray-600">
                        {job.recruiter.companyProfile || job.recruiter.name}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {hasApplied && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                          Already Applied
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deadlineStatus.bgColor} ${deadlineStatus.textColor}`}
                      >
                        {deadlineStatus.text}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mt-4">
                    {displayDescription}
                  </p>
                  <div className="border-t mt-4 pt-4 space-y-3">
                    {job.package && (
                      <div className="flex items-center gap-2">
                        <MoneyIcon className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {job.package}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {/* --- FIX END --- */}

                <div className="mt-5">
                  <Button
                    onClick={() => router.push(`/student/jobs/${job.id}`)}
                    className={`w-full ${hasApplied 
                      ? 'bg-gray-400 hover:bg-gray-500' 
                      : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    disabled={hasApplied}
                  >
                    {hasApplied ? 'Already Applied' : 'View & Apply'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
