/**
 * Student notifications component for dashboard alerts
 * @param {Object} props - Component props
 * @param {number} props.hiredCount - Number of hired positions
 * @param {number} props.interviewsCount - Number of scheduled interviews
 * @param {string} props.className - Additional CSS classes
 */
export default function Notifications({ 
  hiredCount = 0, 
  interviewsCount = 0, 
  className = "",
  ...props 
}) {
  if (hiredCount === 0 && interviewsCount === 0) {
    return null;
  }

  return (
    <div className={`space-y-4 mb-8 ${className}`} {...props}>
      {hiredCount > 0 && (
        <div className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold">🎉 Congratulations!</h3>
          <p>
            You have been hired for {hiredCount} position
            {hiredCount > 1 ? "s" : ""}! Check your applications for details.
          </p>
        </div>
      )}
      
      {interviewsCount > 0 && (
        <div className="bg-purple-50 border-l-4 border-purple-400 text-purple-700 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold">📅 Interview Scheduled</h3>
          <p>
            You have {interviewsCount} interview{interviewsCount > 1 ? "s" : ""}{" "}
            scheduled. Good luck!
          </p>
        </div>
      )}
    </div>
  );
}