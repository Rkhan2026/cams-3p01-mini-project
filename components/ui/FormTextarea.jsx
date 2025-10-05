/**
 * FormTextarea Component
 * 
 * Reusable textarea component with consistent styling for forms.
 * Supports all standard textarea props and custom className.
 */

const FormTextarea = ({ className, ...props }) => {
  return (
    <textarea
      className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 ${className || ''}`}
      {...props}
    />
  );
};

export default FormTextarea;