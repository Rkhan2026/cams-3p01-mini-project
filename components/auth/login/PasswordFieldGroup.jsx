import React from "react";
import Link from "next/link";
import Label from "@/components/ui/Label";
import PasswordField from "@/components/ui/PasswordField";

const PasswordFieldGroup = ({
  id = "password",
  name = "password",
  required = false,
  className = "",
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="font-medium text-gray-700">
          Password
        </Label>
      </div>
      <PasswordField
        id={id}
        name={name}
        required={required}
        autoComplete="current-password"
      />
    </div>
  );
};

export default PasswordFieldGroup;
