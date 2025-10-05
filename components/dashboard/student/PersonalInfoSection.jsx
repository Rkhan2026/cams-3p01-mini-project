import ProfileSection from "../shared/ProfileSection.jsx";

const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <p className="mt-1 text-sm text-gray-900">{value}</p>
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
      status === "ACTIVE"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {status.replace("_", " ")}
  </span>
);

export default function PersonalInfoSection({ student }) {
  return (
    <ProfileSection title="Personal Information">
      <InfoField label="Name" value={student.name} />
      <InfoField label="Email" value={student.email} />
      
      {student.facultyNo && (
        <InfoField label="Faculty Number" value={student.facultyNo} />
      )}
      
      {student.enrollmentNo && (
        <InfoField label="Enrollment Number" value={student.enrollmentNo} />
      )}
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Account Status
        </label>
        <div className="mt-1">
          <StatusBadge status={student.accountStatus} />
        </div>
      </div>
    </ProfileSection>
  );
}