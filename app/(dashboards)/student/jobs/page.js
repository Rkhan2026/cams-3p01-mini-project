"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

// --- ICONS ---
const SearchIcon = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const BriefcaseIcon = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const ArrowLeftIcon = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);
const MoneyIcon = (props) => (
  <svg
    {...props}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v.01M12 18v-2m0-4a2 2 0 00-2 2m2-2a2 2 0 012 2m0 0c0 1.105-.895 2-2 2m-2 2a2 2 0 01-2-2m2 2a2 2 0 002-2"
    />
  </svg>
);
// --- END ICONS ---

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
      const response = await fetch("/api/jobs?status=APPROVED");
      const result = await response.json();
      if (result.success) {
        const activeJobs = result.jobs.filter(
          (job) => new Date(job.applicationDeadline) > new Date()
        );
        setJobs(activeJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
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
                        {job.recruiter.name}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deadlineStatus.bgColor} ${deadlineStatus.textColor}`}
                    >
                      {deadlineStatus.text}
                    </span>
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
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    View & Apply
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
