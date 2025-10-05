import React from 'react';
import Link from 'next/link';

const AuthNavigation = ({ 
  type = 'login', 
  className = '' 
}) => {
  const navigationConfig = {
    login: {
      text: "Don't have an account?",
      linkText: "Create Account",
      href: "/auth/register"
    },
    register: {
      text: "Already have an account?",
      linkText: "Sign In",
      href: "/auth/login"
    }
  };

  const config = navigationConfig[type];

  return (
    <div className={`pt-4 text-center ${className}`}>
      <p className="text-gray-600">
        {config.text}{" "}
        <Link
          href={config.href}
          className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700"
        >
          {config.linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthNavigation;