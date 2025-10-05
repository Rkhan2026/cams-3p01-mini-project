"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";

// Import our extracted components
import { PageHeader, FilterTabs } from "../../../../components/dashboard/shared";
import { 
  StudentCard, 
  RecruiterCard, 
  ApprovalListSection 
} from "../../../../components/dashboard/tpo";
import { FullPageSpinner } from "../../../../components/ui/LoadingSpinner.jsx";

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

  const filterOptions = [
    { key: "PENDING", label: "Pending", count: counts.PENDING },
    { key: "APPROVED", label: "Approved", count: counts.APPROVED },
    { key: "REJECTED", label: "Rejected", count: counts.REJECTED }
  ];

  if (loading) {
    return (
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <FullPageSpinner text="Loading approvals..." />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <PageHeader
        title="User Registration Management"
        subtitle="Review and manage all student and recruiter registrations."
        onBack={() => router.push("/tpo")}
      />

      <FilterTabs
        filters={filterOptions}
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
