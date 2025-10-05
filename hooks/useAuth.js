import { useState } from 'react';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        // Role-based navigation with delay to show loading state
        setTimeout(() => {
          const role = result.user.role;
          if (role === "STUDENT") {
            window.location.href = "/student";
          } else if (role === "RECRUITER") {
            window.location.href = "/recruiter";
          } else {
            window.location.href = "/tpo";
          }
        }, 500);
        
        // Don't set loading to false here as we're navigating away
        return;
      } else {
        setError(
          result.error?.message || "Invalid credentials. Please try again."
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    }

    setLoading(false);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    login,
    loading,
    error,
    clearError
  };
};