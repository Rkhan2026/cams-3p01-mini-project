/**
 * System alerts component for TPO dashboard
 * @param {Object} props - Component props
 * @param {number} props.pendingUsers - Number of pending user registrations
 * @param {number} props.pendingJobs - Number of pending job approvals
 * @param {number} props.hiredStudents - Number of hired students
 * @param {string} props.className - Additional CSS classes
 */
export default function SystemAlerts({ 
  pendingUsers = 0, 
  pendingJobs = 0, 
  hiredStudents = 0, 
  className = "",
  ...props 
}) {
  const hasAlerts = pendingUsers > 0 || pendingJobs > 0 || hiredStudents > 0;
  
  if (!hasAlerts) {
    return null;
  }

  return (
    <div className={`mt-8 space-y-4 ${className}`} {...props}>
      {(pendingUsers > 0 || pendingJobs > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-2xl">⏳</span>
          <div>
            <h3 className="font-semibold text-yellow-800">Action Required</h3>
            <p className="text-sm text-yellow-700">
              {pendingUsers > 0 && (
                <>
                  {pendingUsers} user registration{pendingUsers !== 1 && "s"}
                  {pendingJobs > 0 && " and "}
                </>
              )}
              {pendingJobs > 0 && (
                <>
                  {pendingJobs} job posting{pendingJobs !== 1 && "s"}
                </>
              )}
              {" "}
              {pendingUsers > 0 || pendingJobs > 0 ? "are" : "is"} awaiting approval.
            </p>
          </div>
        </div>
      )}

      {hiredStudents > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-4">
          <span className="text-2xl">🎉</span>
          <div>
            <h3 className="font-semibold text-green-800">Placement Success!</h3>
            <p className="text-sm text-green-700">
              Congratulations! {hiredStudents} student
              {hiredStudents > 1 ? "s have" : " has"} been successfully placed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}