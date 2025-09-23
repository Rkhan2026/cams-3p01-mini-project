import { Suspense } from "react";
import RegistrationForm from "@/components/Registration_Form/RegistrationForm";
import Logo from "@/components/Logo";

// A small component to read search params safely on the server
function RegistrationPageContent() {
  return <RegistrationForm />;
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join PlacementConnect and kickstart your journey.
          </p>
        </div>

        {/* Suspense is good practice when using useSearchParams */}
        <Suspense fallback={<div>Loading...</div>}>
          <RegistrationPageContent />
        </Suspense>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </main>
  );
}
