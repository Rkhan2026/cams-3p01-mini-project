/**
 * FormInput Component
 * 
 * Reusable input component with consistent styling for forms.
 * Supports all standard input props and custom className.
 */

const FormInput = ({ className, ...props }) => {
  return (
    <input
      className={`block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm text-gray-900 ${className || ''}`}
      {...props}
    />
  );
};

export default FormInput;