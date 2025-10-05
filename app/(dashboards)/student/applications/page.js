"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

// Import our extracted components
import { PageHeader, FilterTabs } from "../../../../components/dashboard/shared";
import { 
  ApplicationCard, 
  ApplicationsEmptyState, 
  ApplicationsStats 
} from "../../../../components/dashboard/student";
import { FullPageSpinner } from "../../../../components/ui/LoadingSpinner.jsx";
import { PlusIcon } from "../../../../components/ui/Icons.js";

// --- Main Page Component ---

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const router = useRouter();

  // ... All functions (fetchApplications, handleWithdrawApplication) remain the same
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/applications");
      const result = await response.json();
      if (result.success) {
        setApplications(result.applications || []);
      } else {
        console.error("API call was not successful:", result.error);
        setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchApplications();
  }, []);
  const handleWithdrawApplication = async (applicationId) => {
    console.log(`Withdrawing application ${applicationId}`);
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
  };

  const applicationStats = useMemo(() => {
    // ... applicationStats logic remains the same
    return applications.reduce(
      (stats, app) => {
        stats[app.applicationStatus] = (stats[app.applicationStatus] || 0) + 1;
        stats.TOTAL = (stats.TOTAL || 0) + 1;
        return stats;
      },
      {
        TOTAL: 0,
        APPLIED: 0,
        SHORTLISTED: 0,
        INTERVIEW_SCHEDULED: 0,
        HIRED: 0,
        REJECTED: 0,
      }
    );
  }, [applications]);

  const filteredApplications = useMemo(() => {
    // ... filteredApplications logic remains the same
    if (filter === "ALL") return applications;
    return applications.filter((app) => app.applicationStatus === filter);
  }, [applications, filter]);

  const filterStatuses = [
    "ALL",
    "APPLIED",
    "SHORTLISTED",
    "INTERVIEW_SCHEDULED",
    "HIRED",
    "REJECTED",
  ];

  const filterOptions = filterStatuses.map((status) => ({
    key: status,
    label: status === "ALL" ? "All" : status.replace("_", " "),
    count: status === "ALL" ? applicationStats.TOTAL : applicationStats[status] || 0
  }));

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
        <div className="max-w-7xl mx-auto">
          <FullPageSpinner text="Loading your applications..." />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-8">
          <PageHeader
            title="My Applications"
            subtitle="Track your job applications and manage your next steps."
            onBack={() => router.push("/student")}
          />
          <div className="mt-4 sm:mt-8 flex-shrink-0">
            <button
              onClick={() => router.push("/student/jobs")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Browse & Apply
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <ApplicationsStats stats={applicationStats} />

        {/* Filter Tabs */}
        <FilterTabs 
          filters={filterOptions}
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        {/* Main Content */}
        <main>
          {filteredApplications.length === 0 ? (
            <ApplicationsEmptyState
              filter={filter}
              onBrowseJobs={() => router.push("/student/jobs")}
            />
          ) : (
            <div className="space-y-6">
              {filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onViewDetails={() =>
                    router.push(`/student/jobs/${application.job.id}`)
                  }
                  onWithdraw={() => handleWithdrawApplication(application.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
