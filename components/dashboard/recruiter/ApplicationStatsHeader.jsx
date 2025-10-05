/**
 * ApplicationStatsHeader Component
 * 
 * Displays application statistics overview with filter functionality.
 * Handles filter changes and provides report download functionality.
 */

import ApplicationStatPill from "./ApplicationStatPill.jsx";

const ApplicationStatsHeader = ({
  stats,
  activeFilter,
  onFilterChange,
  onDownloadReport,
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Applications Management
        </h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <ApplicationStatPill
          label="Total"
          value={stats.total}
          color="black"
          isActive={activeFilter === "ALL"}
          onClick={() => onFilterChange("ALL")}
        />
        <ApplicationStatPill
          label="New"
          value={stats.applied}
          color="blue"
          isActive={activeFilter === "APPLIED"}
          onClick={() => onFilterChange("APPLIED")}
        />
        <ApplicationStatPill
          label="Shortlisted"
          value={stats.shortlisted}
          color="yellow"
          isActive={activeFilter === "SHORTLISTED"}
          onClick={() => onFilterChange("SHORTLISTED")}
        />
        <ApplicationStatPill
          label="Interviews"
          value={stats.interviews}
          color="purple"
          isActive={activeFilter === "INTERVIEW_SCHEDULED"}
          onClick={() => onFilterChange("INTERVIEW_SCHEDULED")}
        />
        <ApplicationStatPill
          label="Hired"
          value={stats.hired}
          color="green"
          isActive={activeFilter === "HIRED"}
          onClick={() => onFilterChange("HIRED")}
        />
        <ApplicationStatPill
          label="Rejected"
          value={stats.rejected}
          color="red"
          isActive={activeFilter === "REJECTED"}
          onClick={() => onFilterChange("REJECTED")}
        />
      </div>
    </div>
  );
};

export default ApplicationStatsHeader;