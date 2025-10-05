import React from 'react';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';

const EmailField = ({
  id = 'email',
  name = 'email',
  placeholder = 'you@example.com',
  required = false,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="font-medium text-gray-700">
        Email Address
      </Label>
      <Input
        id={id}
        name={name}
        type="email"
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-black transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        required={required}
        autoComplete="email"
        aria-describedby={`${id}-description`}
      />
    </div>
  );
};

export default EmailField;