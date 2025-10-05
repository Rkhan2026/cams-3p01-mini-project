'use client';

const ArrowLeftIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

export default function BackButton({ text = "Back to Dashboard" }) {
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/student';
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all mb-4"
    >
      <ArrowLeftIcon className="h-5 w-5" />
      {text}
    </button>
  );
}