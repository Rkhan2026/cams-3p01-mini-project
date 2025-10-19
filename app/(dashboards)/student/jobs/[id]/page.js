"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

// Import extracted components
import PageHeader from "../../../../../components/dashboard/shared/PageHeader.jsx";
import JobInfoBlock from "../../../../../components/dashboard/student/JobInfoBlock.jsx";
import JobApplicationStatus from "../../../../../components/dashboard/student/JobApplicationStatus.jsx";
import JobDetailsSkeleton from "../../../../../components/dashboard/student/JobDetailsSkeleton.jsx";
import JobDeadlineInfo from "../../../../../components/dashboard/student/JobDeadlineInfo.jsx";
import JobApplicationActions from "../../../../../components/dashboard/student/JobApplicationActions.jsx";
import JobNotFoundState from "../../../../../components/dashboard/student/JobNotFoundState.jsx";
import ApplicationProcessInfo from "../../../../../components/dashboard/student/ApplicationProcessInfo.jsx";

// --- Main Component ---
export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params.id;
  const router = useRouter();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [isEligible, setIsEligible] = useState(true);
  const [eligibilityReason, setEligibilityReason] = useState("");

  // --- Logic and Functions (Unchanged) ---
  const fetchJobDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/jobs?status=APPROVED`);
      const result = await response.json();
      if (result.success) {
        const jobDetails = result.jobs.find((j) => j.id === jobId);
        if (jobDetails) setJob(jobDetails);
        else router.push("/student/jobs");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoading(false);
    }
  }, [jobId, router]);
  const checkApplicationStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/applications");
      const result = await response.json();
      if (result.success) {
        const existing = result.applications.find((app) => app.jobId === jobId);
        setHasApplied(!!existing);
      }
    } catch (error) {
      console.error("Error checking application status:", error);
    }
  }, [jobId]);
  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      checkApplicationStatus();
    }
  }, [jobId, fetchJobDetails, checkApplicationStatus]);

  // Fetch student's profile for eligibility comparison
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/students/profile");
        if (!res.ok) return;
        const d = await res.json();
        // API returns the student object directly
        setStudentProfile(d);
      } catch (e) {
        console.error("Error fetching student profile:", e);
      }
    };

    fetchProfile();
  }, []);

  // Heuristic eligibility check using job.eligibilityCriteria and studentProfile.academicRecords
  useEffect(() => {
    const parseSalaryFromText = (text) => {
      if (!text || typeof text !== "string") return null;
      
      // Try different salary formats
      // Format 1: "Salary: X LPA"
      let match = text.match(/salary:\s*(\d+(?:\.\d+)?)\s*lpa/i);
      if (match) {
        console.log("Parsing salary from:", text, "Result:", parseFloat(match[1]));
        return parseFloat(match[1]);
      }
      
      // Format 2: "CTC: ₹X,XX,XXX per annum" (convert to LPA)
      match = text.match(/ctc:\s*₹(\d+(?:,\d+)*)\s*per\s*annum/i);
      if (match) {
        const amount = parseFloat(match[1].replace(/,/g, ''));
        const lpa = amount / 100000; // Convert to LPA
        console.log("Parsing salary from:", text, "Result:", lpa);
        return lpa;
      }
      
      console.log("Parsing salary from:", text, "Result: null");
      return null;
    };

    const checkEligibility = async (criteriaText, academicRecords) => {
      if (!criteriaText || !criteriaText.trim())
        return { ok: true, reason: "" };

      // Check if student is already hired first
      try {
        const response = await fetch("/api/applications");
        const result = await response.json();
        if (result.success) {
          const hiredApplication = result.applications.find(
            (app) => app.applicationStatus === "HIRED" || app.applicationStatus === "PLACED"
          );
          
          console.log("Applications found:", result.applications);
          console.log("Hired application:", hiredApplication);
          
          if (hiredApplication) {
            // Get current CTC from hired job description
            const currentCtc = parseSalaryFromText(hiredApplication.job?.jobDescription || "");
            // Get new job salary
            const newJobSalary = parseSalaryFromText(job?.jobDescription || "");
            
            console.log("Current CTC:", currentCtc, "New job salary:", newJobSalary);
            
            if (currentCtc && newJobSalary) {
              const maxAllowedSalary = 2 * currentCtc;
              
              if (newJobSalary <= currentCtc) {
                console.log("Blocking application: new salary <= current CTC");
                return {
                  ok: false,
                  reason: `You cannot apply for jobs with salary ${newJobSalary} LPA as it is less than or equal to your current CTC (${currentCtc} LPA).`,
                };
              }
              
              if (newJobSalary > currentCtc && newJobSalary <= maxAllowedSalary) {
                console.log("Blocking application: salary not high enough");
                return {
                  ok: false,
                  reason: `You cannot apply for jobs with salary ${newJobSalary} LPA (your current CTC: ${currentCtc} LPA). You can only apply to jobs with salary more than ${maxAllowedSalary} LPA.`,
                };
              }
            } else {
              console.log("Could not parse salaries - currentCtc:", currentCtc, "newJobSalary:", newJobSalary);
            }
          } else {
            console.log("No hired application found");
          }
        }
      } catch (error) {
        console.error("Error checking hired status:", error);
      }

      // Parse semicolon-separated 'Key: Value; Key: Value' format
      const parts = (criteriaText || "")
        .split(";")
        .map((p) => p.trim())
        .filter(Boolean);
      const criteria = {};
      parts.forEach((p) => {
        const [k, ...rest] = p.split(":");
        if (!k) return;
        const key = k.trim().toLowerCase();
        const val = rest.join(":").trim();
        if (!val) return;
        if (key === "mincgpa") criteria.minCgpa = parseFloat(val);
        else if (key === "classx") criteria.classX = parseFloat(val);
        else if (key === "classxii") criteria.classXII = parseFloat(val);
        else if (key === "degree") criteria.degree = val;
        else if (key === "notes") criteria.notes = val;
        else criteria[key] = val;
      });

      const records = academicRecords || {};
      const studentCgpaNum =
        records.currentCGPA || records.currentCgpa || records.current_cgpa
          ? parseFloat(
              records.currentCGPA || records.currentCgpa || records.current_cgpa
            )
          : null;

      if (criteria.minCgpa != null && !isNaN(criteria.minCgpa)) {
        if (studentCgpaNum == null) {
          return {
            ok: false,
            reason: `Minimum CGPA of ${criteria.minCgpa} is required but your CGPA is not provided in profile.`,
          };
        }
        if (studentCgpaNum < criteria.minCgpa) {
          return {
            ok: false,
            reason: `Minimum CGPA ${criteria.minCgpa} required (your CGPA: ${studentCgpaNum}).`,
          };
        }
      }

      if (criteria.degree) {
        const jobDegree = criteria.degree.toString().toLowerCase();
        const studentCourse = (records.courseEnrolled || "")
          .toString()
          .toLowerCase();
        if (jobDegree.includes("computer") || jobDegree.includes("cs")) {
          if (
            !studentCourse.includes("cs") &&
            !studentCourse.includes("computer")
          ) {
            return {
              ok: false,
              reason: `Role requires a Computer Science background (${
                criteria.degree
              }) which doesn't match your enrolled course (${
                records.courseEnrolled || "N/A"
              }).`,
            };
          }
        } else if (/(btech|b\.tech|engineering|bachelor)/i.test(jobDegree)) {
          if (
            !/(engineering|btech|b\.tech|bachelor|b e|be)/i.test(studentCourse)
          ) {
            return {
              ok: false,
              reason: `Role requires an engineering/bachelor background (${
                criteria.degree
              }) which doesn't match your enrolled course (${
                records.courseEnrolled || "N/A"
              }).`,
            };
          }
        }
      }

      if (criteria.classx != null && !isNaN(criteria.classx)) {
        const sX = parseFloat(
          records.classXPercentage || records.classX || null
        );
        if (isNaN(sX) || sX < criteria.classx) {
          return {
            ok: false,
            reason: `Minimum Class X percentage ${
              criteria.classx
            } required (your Class X: ${sX ?? "N/A"}).`,
          };
        }
      }

      if (criteria.classxii != null && !isNaN(criteria.classxii)) {
        const sXII = parseFloat(
          records.classXIIPercentage ||
            records.classXii ||
            records.classXII ||
            null
        );
        if (isNaN(sXII) || sXII < criteria.classxii) {
          return {
            ok: false,
            reason: `Minimum Class XII percentage ${
              criteria.classxii
            } required (your Class XII: ${sXII ?? "N/A"}).`,
          };
        }
      }

      return { ok: true, reason: "" };
    };

    if (job) {
      const recordsRaw =
        studentProfile?.academicRecords ||
        studentProfile?.academic_records ||
        {};
      let parsedRecords = recordsRaw;
      try {
        if (typeof recordsRaw === "string")
          parsedRecords = JSON.parse(recordsRaw);
      } catch (e) {
        parsedRecords = recordsRaw;
      }

      // If profile missing, mark ineligible with message
      if (!studentProfile) {
        setIsEligible(false);
        setEligibilityReason(
          "Please complete your profile to check eligibility."
        );
        return;
      }

      // Call async eligibility check
      checkEligibility(
        job.eligibilityCriteria || "",
        parsedRecords || {}
      ).then((result) => {
        setIsEligible(result.ok);
        setEligibilityReason(result.reason || "");
      });
    }
  }, [job, studentProfile]);
  const handleApply = async () => {
    setApplying(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const result = await response.json();
      // If backend returned unmet criteria, surface those to the user
      if (!result.success && result.unmetCriteria) {
        const list = result.unmetCriteria
          .map((c) => {
            if (c.field === "minCgpa")
              return `Minimum CGPA ${c.required} required (your: ${
                c.actual ?? "N/A"
              })`;
            if (c.field === "degree") return `Required degree: ${c.required}`;
            if (c.field === "classX")
              return `Minimum Class X ${c.required}% required (your: ${
                c.actual ?? "N/A"
              })`;
            if (c.field === "classXII")
              return `Minimum Class XII ${c.required}% required (your: ${
                c.actual ?? "N/A"
              })`;
            return `${c.field}: ${c.required}`;
          })
          .join("; ");

        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: `You do not meet the eligibility criteria: ${list}`,
          })
        );
        setIsEligible(false);
        setEligibilityReason(`You do not meet: ${list}`);
      } else {
        window.dispatchEvent(
          new CustomEvent("toast", {
            detail: result.message || result.error?.message,
          })
        );
        if (result.success) setHasApplied(true);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      window.dispatchEvent(
        new CustomEvent("toast", { detail: "Error submitting application" })
      );
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <JobDetailsSkeleton />;

  if (!job) {
    return (
      <JobNotFoundState onBackToJobs={() => router.push("/student/jobs")} />
    );
  }

  const deadlinePassed = new Date(job.applicationDeadline) <= new Date();

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          title={
            job.title ||
            `Opportunity at ${
              job.recruiter.companyProfile || job.recruiter.name
            }`
          }
          subtitle={job.recruiter.companyProfile || job.recruiter.name}
          onBack={() => router.push("/student/jobs")}
          buttonText="Back to Jobs"
        />

        <div className="bg-white rounded-xl shadow-sm p-8">
          <JobDeadlineInfo deadline={job.applicationDeadline} />

          <div className="mb-8">
            <JobApplicationStatus
              hasApplied={hasApplied}
              deadlinePassed={deadlinePassed}
            />
          </div>

          <JobInfoBlock title="About the Company">
            {job.recruiter.companyProfile}
          </JobInfoBlock>
          <JobInfoBlock title="Job Description">
            {job.jobDescription}
          </JobInfoBlock>
          <JobInfoBlock title="Eligibility Criteria">
            {job.eligibilityCriteria}
          </JobInfoBlock>

          <JobApplicationActions
            hasApplied={hasApplied}
            deadlinePassed={deadlinePassed}
            applying={applying}
            onApply={handleApply}
            onViewApplications={() => router.push("/student/applications")}
            isEligible={isEligible}
            eligibilityReason={eligibilityReason}
            showViewApplications={isEligible}
          />
        </div>

        <ApplicationProcessInfo showInfo={!hasApplied && !deadlinePassed} />
      </div>
    </div>
  );
}
