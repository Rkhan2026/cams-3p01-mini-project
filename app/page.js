"use client";

import Link from "next/link";
import Logo from "@/components/shared/Logo";
import RoleCard from "@/components/ui/RoleCard"; // <-- Import the new component

// It's good practice to have icons as their own components
const StudentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-8"
  >
    <title>Student Icon</title> {/* <-- Accessibility win! */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
    />
  </svg>
);

const RecruiterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-8"
  >
    <title>Recruiter Icon</title> {/* <-- Accessibility win! */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
    />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header for primary and secondary actions */}
      <header className="absolute top-0 left-0 right-0 p-6 z-20">
        <div className="container mx-auto flex justify-between items-center">
          <Link
            href="/auth/login"
            className="px-4 py-2 font-semibold text-gray-700 transition-colors hover:text-blue-600"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Hero Section with improved copy */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent md:text-5xl">
              Connecting Talent with Opportunity
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              The bridge between students and recruiters. Find your next
              opportunity or your next great hire.
            </p>
          </div>

          {/* Role Selection using the new RoleCard component */}
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
            <RoleCard
              href="/auth/register?role=STUDENT"
              title="I am a Student"
              description="Browse jobs, build your profile, and track your application status."
              icon={<StudentIcon />}
              theme="blue"
            />
            <RoleCard
              href="/auth/register?role=RECRUITER"
              title="I am a Recruiter"
              description="Post job openings, discover top talent, and manage your hiring pipeline."
              icon={<RecruiterIcon />}
              theme="green"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
