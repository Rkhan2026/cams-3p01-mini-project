"use client";

import Link from "next/link";
import Logo from "@/components/shared/Logo";
import RoleCard from "@/components/ui/RoleCard";
import HeroSection from "@/components/layout/HeroSection";
import { StudentIcon, RecruiterIcon } from "@/components/icons/RoleIcons";

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
          <HeroSection 
            title="Connecting Talent with Opportunity"
            subtitle="The bridge between students and recruiters. Find your next opportunity or your next great hire."
          />

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
