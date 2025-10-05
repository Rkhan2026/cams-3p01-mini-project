/**
 * Password input field with toggle visibility functionality
 */

"use client";

import { useState } from "react";
import Input from "./Input";
import { EyeIcon, EyeSlashIcon } from "../icons/FormIcons";

export default function PasswordField({ 
  id, 
  name, 
  placeholder = "••••••••", 
  className = "",
  required = false,
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-gray-200 px-4 py-3 text-black transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${className}`}
        required={required}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? (
          <EyeSlashIcon className="h-6 w-6" />
        ) : (
          <EyeIcon className="h-6 w-6" />
        )}
      </button>
    </div>
  );
}