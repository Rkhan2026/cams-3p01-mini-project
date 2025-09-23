"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SearchIcon, BriefcaseIcon } from "@/components/ui/Icons"; // Assuming you have an Icons component

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const lowercasedFilter = searchTerm.toLowerCase();
      const filtered = jobs.filter(
        (job) =>
          job.jobDescription.toLowerCase().includes(lowercasedFilter) ||
          job.eligibilityCriteria.toLowerCase().includes(lowercasedFilter) ||
          job.recruiter.name.toLowerCase().includes(lowercasedFilter)
      );
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

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getDeadlineStatus = (deadline) => {
    const diffDays = Math.ceil(
      (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 1) return { text: "Closes today", color: "text-red-600" };
    if (diffDays <= 3)
      return { text: `${diffDays} days left`, color: "text-orange-500" };
    return { text: `${diffDays} days left`, color: "text-green-600" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            Loading Jobs...
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Finding opportunities for you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
          <p className="text-gray-600 mt-1">
            {filteredJobs.length} opportunities waiting for you.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Input
            type="text"
            placeholder="Search by company, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-16">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">
            {searchTerm
              ? "No jobs match your search"
              : "No jobs available right now"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? "Try a different keyword."
              : "Please check back later."}
          </p>
          {searchTerm && (
            <Button
              onClick={() => setSearchTerm("")}
              className="mt-4 bg-gray-700 hover:bg-gray-800"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredJobs.map((job) => {
            const deadlineStatus = getDeadlineStatus(job.applicationDeadline);
            return (
              <div
                key={job.id}
                className="bg-white border rounded-2xl p-6 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {job.recruiter.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${deadlineStatus.color
                        .replace("text-", "bg-")
                        .replace("-600", "-100")} ${deadlineStatus.color}`}
                    >
                      {deadlineStatus.text}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm mb-1">
                      Description
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {job.jobDescription}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
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
