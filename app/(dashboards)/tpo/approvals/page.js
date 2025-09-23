"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

// --- Reusable UI Components ---

const Button = ({ onClick, className, children, ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors duration-300 disabled:bg-gray-400 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// --- SVG Icon Components ---

const ArrowLeftIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

// --- Child Components ---

const PageHeader = ({ title, subtitle, onBack }) => (
  <div className="mb-8">
    <button
      onClick={onBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all mb-4"
    >
      <ArrowLeftIcon />
      Back to Dashboard
    </button>
    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
    <p className="text-gray-500 mt-1">{subtitle}</p>
  </div>
);

const FilterTabs = ({ counts, activeFilter, onFilterChange }) => {
  const filters = [
    { key: "PENDING", label: "Pending" },
    { key: "APPROVED", label: "Approved" },
    { key: "REJECTED", label: "Rejected" },
  ];
  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`px-4 py-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors ${
            activeFilter === key
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          {label}
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              activeFilter === key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {counts[key] || 0}
          </span>
        </button>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusStyles = {
    APPROVED: "bg-green-100 text-green-800 border border-green-200",
    REJECTED: "bg-red-100 text-red-800 border border-red-200",
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

const StudentCard = ({ student, onApprove, status }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
        <p className="text-sm text-gray-500">{student.email}</p>
      </div>
      <div className="text-sm text-gray-700 md:text-right">
        {status !== "PENDING" ? (
          <StatusBadge status={status} />
        ) : (
          <>
            <p>
              <strong>Faculty No:</strong> {student.facultyNo || "N/A"}
            </p>
            <p>
              <strong>Enrollment No:</strong> {student.enrollmentNo || "N/A"}
            </p>
          </>
        )}
      </div>
    </div>

    {student.academicRecords && (
      <div className="mb-5">
        <h4 className="font-semibold text-sm text-gray-800 mb-2">
          Academic Records:
        </h4>
        <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
          {Object.entries(student.academicRecords).map(([key, value]) => {
            if (!value) return null;
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase());
            return (
              <div key={key}>
                <strong className="text-gray-600">{label}:</strong>
                {key === "resumeLink" ? (
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    View Resume
                  </a>
                ) : (
                  <span className="text-gray-800 ml-1">
                    {value}
                    {key.includes("Percentage") && "%"}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    )}

    {status === "PENDING" && (
      <div className="flex gap-3 pt-4 border-t mt-4">
        <Button
          onClick={() => onApprove(student.id, "STUDENT", true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Approve
        </Button>
        <Button
          onClick={() => onApprove(student.id, "STUDENT", false)}
          className="bg-red-600 hover:bg-red-700"
        >
          Reject
        </Button>
      </div>
    )}
  </div>
);

const RecruiterCard = ({ recruiter, onApprove, status }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {recruiter.name}
        </h3>
        <p className="text-sm text-gray-500">{recruiter.email}</p>
      </div>
      {status !== "PENDING" && <StatusBadge status={status} />}
    </div>

    <div className="mb-5">
      <h4 className="font-semibold text-sm text-gray-800 mb-2">
        Company Profile:
      </h4>
      <p className="text-sm bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
        {recruiter.companyProfile}
      </p>
    </div>

    {status === "PENDING" && (
      <div className="flex gap-3 pt-4 border-t mt-4">
        <Button
          onClick={() => onApprove(recruiter.id, "RECRUITER", true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Approve
        </Button>
        <Button
          onClick={() => onApprove(recruiter.id, "RECRUITER", false)}
          className="bg-red-600 hover:bg-red-700"
        >
          Reject
        </Button>
      </div>
    )}
  </div>
);

const ApprovalListSection = ({
  title,
  users,
  CardComponent,
  onApprove,
  emptyMessage,
  status,
}) => (
  <div className="mb-10">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
    {users.length === 0 ? (
      <div className="text-center py-10 bg-white border border-dashed rounded-xl">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    ) : (
      <div className="space-y-4">
        {users.map((user) => (
          <CardComponent
            key={user.id}
            student={user}
            recruiter={user}
            onApprove={onApprove}
            status={status}
          />
        ))}
      </div>
    )}
  </div>
);

const ApprovalsPageSkeleton = () => (
  <div className="p-6 md:p-8 bg-gray-50 min-h-screen animate-pulse">
    <div className="mb-8">
      <div className="h-10 w-48 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-9 w-64 bg-gray-300 rounded mb-2"></div>
      <div className="h-5 w-96 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      <div className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
      <div className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
      <div className="h-10 w-32 bg-gray-200 rounded-t-lg"></div>
    </div>
    <div className="mb-10">
      <div className="h-8 w-56 bg-gray-300 rounded mb-4"></div>
      <div className="space-y-4">
        <div className="bg-gray-200 rounded-xl h-40"></div>
      </div>
    </div>
  </div>
);

// --- Main Component ---

export default function ApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState({
    students: [],
    recruiters: [],
  });
  const [approvedUsers, setApprovedUsers] = useState({
    students: [],
    recruiters: [],
  });
  const [rejectedUsers, setRejectedUsers] = useState({
    students: [],
    recruiters: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("PENDING");
  const router = useRouter();

  const fetchPendingUsers = async () => {
    const response = await fetch("/api/auth/pending");
    const result = await response.json();
    if (result.success) setPendingUsers(result.data);
  };

  const fetchApprovedUsers = async () => {
    const response = await fetch("/api/auth/approved");
    const result = await response.json();
    if (result.success) setApprovedUsers(result.data);
  };

  const fetchRejectedUsers = async () => {
    const response = await fetch("/api/auth/rejected");
    const result = await response.json();
    if (result.success) setRejectedUsers(result.data);
  };

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchPendingUsers(),
        fetchApprovedUsers(),
        fetchRejectedUsers(),
      ]);
    } catch (error) {
      console.error("Error fetching all user data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleApproval = async (userId, userType, approved) => {
    try {
      const response = await fetch("/api/auth/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userType, approved }),
      });
      const result = await response.json();
      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: result.message || "Action completed.",
        })
      );
      if (result.success) fetchAllData();
    } catch (error) {
      console.error("Error processing approval:", error);
    }
  };

  const { filteredUsers, counts } = useMemo(() => {
    const newCounts = {
      PENDING: pendingUsers.students.length + pendingUsers.recruiters.length,
      APPROVED: approvedUsers.students.length + approvedUsers.recruiters.length,
      REJECTED: rejectedUsers.students.length + rejectedUsers.recruiters.length,
    };

    let usersToDisplay;
    if (activeFilter === "PENDING") usersToDisplay = pendingUsers;
    else if (activeFilter === "APPROVED") usersToDisplay = approvedUsers;
    else if (activeFilter === "REJECTED") usersToDisplay = rejectedUsers;

    return { filteredUsers: usersToDisplay, counts: newCounts };
  }, [pendingUsers, approvedUsers, rejectedUsers, activeFilter]);

  if (loading) return <ApprovalsPageSkeleton />;

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader
        title="User Registration Management"
        subtitle="Review and manage all student and recruiter registrations."
        onBack={() => router.push("/tpo")}
      />

      <FilterTabs
        counts={counts}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <ApprovalListSection
        title="Students"
        users={filteredUsers.students}
        CardComponent={StudentCard}
        onApprove={handleApproval}
        emptyMessage={`No ${activeFilter.toLowerCase()} students found.`}
        status={activeFilter}
      />

      <ApprovalListSection
        title="Recruiters"
        users={filteredUsers.recruiters}
        CardComponent={RecruiterCard}
        onApprove={handleApproval}
        emptyMessage={`No ${activeFilter.toLowerCase()} recruiters found.`}
        status={activeFilter}
      />
    </div>
  );
}
