import Button from '../../ui/Button.jsx';
import Badge from '../../ui/Badge.jsx';

/**
 * Student card component for TPO approvals page
 * @param {Object} props - Component props
 * @param {Object} props.student - Student object with details
 * @param {function} props.onApprove - Approval handler function
 * @param {string} props.status - Current status (PENDING, APPROVED, REJECTED)
 * @param {string} props.className - Additional CSS classes
 */
export default function StudentCard({ 
  student, 
  onApprove, 
  status, 
  className = "",
  ...props 
}) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-shadow hover:shadow-md ${className}`} {...props}>
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-500">{student.email}</p>
        </div>
        <div className="text-sm text-gray-700 md:text-right">
          {status !== "PENDING" ? (
            <Badge status={status.toLowerCase()}>
              {status}
            </Badge>
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
            variant="primary"
          >
            Approve
          </Button>
          <Button
            onClick={() => onApprove(student.id, "STUDENT", false)}
            variant="secondary"
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}