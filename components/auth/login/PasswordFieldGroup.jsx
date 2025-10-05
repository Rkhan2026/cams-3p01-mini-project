import React from 'react';
import Link from 'next/link';
import Label from '@/components/ui/Label';
import PasswordField from '@/components/ui/PasswordField';

const PasswordFieldGroup = ({
  id = 'password',
  name = 'password',
  required = false,
  showForgotPassword = true,
  forgotPasswordHref = '/auth/forgot-password',
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="font-medium text-gray-700">
          Password
        </Label>
        {showForgotPassword && (
          <Link
            href={forgotPasswordHref}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            Forgot Password?
          </Link>
        )}
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