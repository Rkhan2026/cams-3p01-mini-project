/**
 * ApplicationStatPill Component
 * 
 * Displays application statistics with dynamic styling based on color and active state.
 * Handles filter selection and provides visual feedback for active filters.
 */

const ApplicationStatPill = ({ label, value, color, isActive, onClick }) => {
  const baseStyle =
    "flex items-center justify-center text-center p-4 rounded-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1";
  const activeStyle =
    color === "black"
      ? `bg-black text-white shadow-lg`
      : `bg-${color}-600 text-white shadow-lg`;
  const inactiveTextColor =
    color === "black" ? "text-black" : `text-${color}-600`;
  const inactiveStyle = `bg-white hover:shadow-md border`;

  return (
    <div
      onClick={onClick}
      className={`${baseStyle} ${isActive ? activeStyle : inactiveStyle}`}
    >
      <div>
        <div
          className={`text-2xl font-bold ${
            isActive ? "text-white" : inactiveTextColor
          }`}
        >
          {value}
        </div>
        <div
          className={`text-xs font-medium ${
            isActive ? "text-white opacity-90" : "text-gray-500"
          }`}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatPill;