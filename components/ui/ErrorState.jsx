/**
 * Standardized error state component with optional retry functionality
 */

import Button from "./Button";

export default function ErrorState({ 
  message, 
  onRetry, 
  retryText = "Retry",
  className = "",
  fullScreen = false 
}) {
  const containerClasses = fullScreen 
    ? "flex items-center justify-center min-h-[60vh]"
    : "flex items-center justify-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className="text-red-600 text-xl mb-4">
          Error: {message}
        </div>
        {onRetry && (
          <Button onClick={onRetry} className="bg-blue-600 hover:bg-blue-700 text-white">
            {retryText}
          </Button>
        )}
      </div>
    </div>
  );
}