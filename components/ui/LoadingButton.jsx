import React from 'react';

const LoadingButton = ({
  loading = false,
  loadingText = 'Loading...',
  children,
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={`${className} ${isDisabled ? 'opacity-75 cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="-ml-1 mr-3 h-5 w-5 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;