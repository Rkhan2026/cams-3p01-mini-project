/**
 * JobFormField Component
 * 
 * Provides consistent form field styling using the shared FormField component.
 * Includes required field indicators and help text display.
 */

import FormField from "../../ui/FormField.jsx";

const JobFormField = ({ id, label, helpText, children, required }) => {
  return (
    <FormField
      id={id}
      label={label}
      helpText={helpText}
      required={required}
    >
      {children}
    </FormField>
  );
};

export default JobFormField;