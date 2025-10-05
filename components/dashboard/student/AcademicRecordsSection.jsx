import ProfileSection from "../shared/ProfileSection.jsx";

const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <p className="mt-1 text-sm text-gray-900">{value}</p>
  </div>
);

const ResumeLink = ({ resumeLink }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Resume
    </label>
    <a
      href={resumeLink}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 text-sm text-blue-600 hover:text-blue-800 underline"
    >
      View Resume
    </a>
  </div>
);

export default function AcademicRecordsSection({ academicRecords }) {
  if (!academicRecords) {
    return (
      <ProfileSection title="Academic Records">
        <p className="text-sm text-gray-500 italic">
          No academic records available
        </p>
      </ProfileSection>
    );
  }

  return (
    <ProfileSection title="Academic Records">
      {academicRecords.college && (
        <InfoField label="College" value={academicRecords.college} />
      )}

      {academicRecords.courseEnrolled && (
        <InfoField label="Course Enrolled" value={academicRecords.courseEnrolled} />
      )}

      {academicRecords.currentYearSemester && (
        <InfoField 
          label="Current Year/Semester" 
          value={academicRecords.currentYearSemester} 
        />
      )}

      {academicRecords.currentCGPA && (
        <InfoField label="Current CGPA" value={academicRecords.currentCGPA} />
      )}

      {academicRecords.classXPercentage && (
        <InfoField 
          label="Class X Percentage" 
          value={`${academicRecords.classXPercentage}%`} 
        />
      )}

      {academicRecords.classXIIPercentage && (
        <InfoField 
          label="Class XII Percentage" 
          value={`${academicRecords.classXIIPercentage}%`} 
        />
      )}

      {academicRecords.resumeLink && (
        <ResumeLink resumeLink={academicRecords.resumeLink} />
      )}
    </ProfileSection>
  );
}