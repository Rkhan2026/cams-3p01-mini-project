import { Suspense } from "react";
import RegistrationForm from "@/components/auth/register/RegistrationForm";
import AuthLayout from "@/components/layout/AuthLayout";

// A small component to read search params safely on the server
function RegistrationPageContent() {
  return <RegistrationForm />;
}

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Join PlacementConnect and kickstart your journey."
      maxWidth="max-w-2xl"
    >
      {/* Suspense is good practice when using useSearchParams */}
      <Suspense fallback={<div>Loading...</div>}>
        <RegistrationPageContent />
      </Suspense>
    </AuthLayout>
  );
}
