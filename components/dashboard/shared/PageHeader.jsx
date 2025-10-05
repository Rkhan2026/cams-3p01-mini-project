/**
 * PageHeader Component
 * 
 * Displays page header with back navigation, title, and subtitle.
 * Provides consistent header styling across dashboard pages.
 */

import { ArrowLeftIcon } from "../../icons/ArrowIcons.jsx";

const PageHeader = ({ title, subtitle, onBack, buttonText = "Back to Dashboard" }) => {
  return (
    <div className="mb-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all mb-4"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        {buttonText}
      </button>
      <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      <p className="text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
};

export default PageHeader;