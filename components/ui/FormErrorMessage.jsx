import React from 'react';

const FormErrorMessage = ({ 
  error, 
  variant = 'error', 
  className = '' 
}) => {
  if (!error) return null;

  const variantStyles = {
    error: 'border-red-300 bg-red-50 text-red-600',
    warning: 'border-yellow-300 bg-yellow-50 text-yellow-600',
    info: 'border-blue-300 bg-blue-50 text-blue-600'
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`rounded-lg border p-3 text-center text-sm font-medium ${variantStyles[variant]} ${className}`}
    >
      {error}
    </div>
  );
};

export default FormErrorMessage;