/**
 * Reusable page header component for dashboard pages
 */

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "../icons/ArrowIcons";

export default function PageHeader({ 
  title, 
  subtitle, 
  onBack, 
  backText = "Back to Dashboard",
  backHref,
  gradient = false,
  className = "" 
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <div className={className}>
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          {backText}
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        {gradient ? (
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-300 text-lg">
                {subtitle}
              </p>
            )}
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600 text-lg">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}