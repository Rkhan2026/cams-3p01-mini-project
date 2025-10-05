"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import EmailField from "./EmailField";
import PasswordFieldGroup from "./PasswordFieldGroup";
import FormErrorMessage from "@/components/ui/FormErrorMessage";
import LoadingButton from "@/components/ui/LoadingButton";
import AuthNavigation from "./AuthNavigation";

const LoginForm = ({ onSuccess, onError, className = "" }) => {
  const { login, loading, error, clearError } = useAuth();

  const handleSubmit = async (formData) => {
    clearError();

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err) {
      onError?.(err.message);
    }
  };

  return (
    <form
      action={handleSubmit}
      className={`space-y-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-xl ${className}`}
    >
      <EmailField
        id="email"
        name="email"
        placeholder="you@example.com"
        required
      />

      <PasswordFieldGroup
        id="password"
        name="password"
        required
        showForgotPassword={true}
        forgotPasswordHref="/auth/forgot-password"
      />

      <FormErrorMessage error={error} />

      <LoadingButton
        type="submit"
        loading={loading}
        loadingText="Signing in..."
        className="w-full transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-6 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl disabled:opacity-75"
      >
        Sign In
      </LoadingButton>

      <AuthNavigation type="login" />
    </form>
  );
};

export default LoginForm;
