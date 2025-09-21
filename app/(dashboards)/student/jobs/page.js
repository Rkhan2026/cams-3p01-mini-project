"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

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
    // Filter jobs based on search term
    if (searchTerm.trim() === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        job.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.eligibilityCriteria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.recruiter.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [jobs, searchTerm]);

  const fetchJobs = async () => {
    try {
      // Only fetch approved jobs for students
      const response = await fetch("/api/jobs?status=APPROVED");
      const result = await response.json();
      
      if (result.success) {
        // Filter out expired jobs
        const currentDate = new Date();
        const activeJobs = result.jobs.filter(job => 
          new Date(job.applicationDeadline) > currentDate
        );
        setJobs(activeJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getDaysUntilDeadline = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDeadlineStatus = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days <= 1) return { text: "Expires today", color: "text-red-600" };
    if (days <= 3) return { text: `${days} days left`, color: "text-orange-600" };
    if (days <= 7) return { text: `${days} days left`, color: "text-yellow-600" };
    return { text: `${days} days left`, color: "text-green-600" };
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Available Jobs</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Available Jobs</h1>
        <div className="text-sm text-neutral-600">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} available
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="max-w-md">
          <Input
            type="text"
            placeholder="Search jobs by description, criteria, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-500 mb-2">
            {searchTerm ? "No jobs match your search criteria" : "No jobs available at the moment"}
          </p>
          {searchTerm && (
            <Button
              onClick={() => setSearchTerm("")}
              className="bg-neutral-500 hover:bg-neutral-600"
            >
              Clear Search
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => {
            const deadlineStatus = getDeadlineStatus(job.applicationDeadline);
            
            return (
              <div key={job.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">{job.recruiter.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <span>
                        <strong>Deadline:</strong> {formatDate(job.applicationDeadline)}
                      </span>
                      <span className={`font-medium ${deadlineStatus.color}`}>
                        {deadlineStatus.text}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-medium text-sm mb-1">Job Description:</h4>
                    <p className="text-sm text-neutral-700 line-clamp-3">
                      {job.jobDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-1">Eligibility Criteria:</h4>
                    <p className="text-sm text-neutral-700 line-clamp-2">
                      {job.eligibilityCriteria}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => router.push(`/student/jobs/${job.id}`)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    View Details & Apply
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