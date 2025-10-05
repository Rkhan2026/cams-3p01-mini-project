/**
 * Standardized loading state component with different variants
 */

export default function LoadingState({ 
  message = "Loading...", 
  size = 'md',
  variant = 'spinner',
  className = "",
  fullScreen = false 
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const SpinnerIcon = () => (
    <div className={`animate-spin rounded-full border-b-2 border-gray-800 ${sizeClasses[size]}`}></div>
  );

  const DotsIcon = () => (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce"></div>
      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-gray-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
    </div>
  );

  const PulseIcon = () => (
    <div className={`bg-gray-300 rounded-full animate-pulse ${sizeClasses[size]}`}></div>
  );

  const renderIcon = () => {
    switch (variant) {
      case 'dots':
        return <DotsIcon />;
      case 'pulse':
        return <PulseIcon />;
      default:
        return <SpinnerIcon />;
    }
  };

  const containerClasses = fullScreen 
    ? "flex items-center justify-center min-h-[60vh]"
    : "flex items-center justify-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="text-center">
        <div className="mx-auto mb-4">
          {renderIcon()}
        </div>
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {message}
        </p>
      </div>
    </div>
  );
}