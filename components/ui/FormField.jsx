/**
 * FormField Component
 * 
 * Reusable form field wrapper with label and help text support.
 * Provides consistent form field styling and required field indicators.
 */

const Label = ({ children, ...props }) => (
  <label className="block text-sm font-medium text-gray-800" {...props}>
    {children}
  </label>
);

const FormField = ({ id, label, helpText, children, required }) => {
  return (
    <div>
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="mt-1">{children}</div>
      {helpText && <p className="mt-2 text-sm text-gray-500">{helpText}</p>}
    </div>
  );
};

export default FormField;