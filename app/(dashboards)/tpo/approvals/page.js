"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

export default function ApprovalsPage() {
  const [pendingUsers, setPendingUsers] = useState({ students: [], recruiters: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      const response = await fetch("/api/auth/pending");
      const result = await response.json();
      if (result.success) {
        setPendingUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching pending users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId, userType, approved) => {
    try {
      const response = await fetch("/api/auth/approve", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userType, approved })
      });

      const result = await response.json();
      if (result.success) {
        window.dispatchEvent(
          new CustomEvent("toast", { 
            detail: `User ${approved ? "approved" : "rejected"} successfully` 
          })
        );
        fetchPendingUsers(); // Refresh the list
      } else {
        window.dispatchEvent(
          new CustomEvent("toast", { detail: result.error.message })
        );
      }
    } catch (error) {
      console.error("Error processing approval:", error);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Error processing approval" })
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">User Approvals</h1>
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">User Approvals</h1>
      
      {/* Pending Students */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4">Pending Students ({pendingUsers.students.length})</h2>
        {pendingUsers.students.length === 0 ? (
          <p className="text-neutral-500">No pending student registrations</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.students.map((student) => (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <p className="text-sm text-neutral-600">{student.email}</p>
                  </div>
                  <div className="text-sm">
                    <p><strong>Faculty No:</strong> {student.facultyNo || "N/A"}</p>
                    <p><strong>Enrollment No:</strong> {student.enrollmentNo || "N/A"}</p>
                  </div>
                </div>
                
                {student.academicRecords && (
                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">Academic Records:</h4>
                    <div className="bg-neutral-50 dark:bg-gray-700 p-3 rounded-lg space-y-2 text-sm">
                      {student.academicRecords.classXPercentage && (
                        <div><strong>Class X:</strong> {student.academicRecords.classXPercentage}%</div>
                      )}
                      {student.academicRecords.classXIIPercentage && (
                        <div><strong>Class XII:</strong> {student.academicRecords.classXIIPercentage}%</div>
                      )}
                      {student.academicRecords.courseEnrolled && (
                        <div><strong>Course:</strong> {student.academicRecords.courseEnrolled}</div>
                      )}
                      {student.academicRecords.college && (
                        <div><strong>College:</strong> {student.academicRecords.college}</div>
                      )}
                      {student.academicRecords.currentCGPA && (
                        <div><strong>Current CGPA:</strong> {student.academicRecords.currentCGPA}</div>
                      )}
                      {student.academicRecords.currentYearSemester && (
                        <div><strong>Year/Semester:</strong> {student.academicRecords.currentYearSemester}</div>
                      )}
                      {student.academicRecords.resumeLink && (
                        <div>
                          <strong>Resume:</strong> 
                          <a 
                            href={student.academicRecords.resumeLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-2 underline"
                          >
                            View Resume
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproval(student.id, "STUDENT", true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleApproval(student.id, "STUDENT", false)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Recruiters */}
      <div>
        <h2 className="text-xl font-medium mb-4">Pending Recruiters ({pendingUsers.recruiters.length})</h2>
        {pendingUsers.recruiters.length === 0 ? (
          <p className="text-neutral-500">No pending recruiter registrations</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.recruiters.map((recruiter) => (
              <div key={recruiter.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-medium">{recruiter.name}</h3>
                    <p className="text-sm text-neutral-600">{recruiter.email}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Company Profile:</h4>
                  <p className="text-sm bg-neutral-50 p-2 rounded">
                    {recruiter.companyProfile}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApproval(recruiter.id, "RECRUITER", true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleApproval(recruiter.id, "RECRUITER", false)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}