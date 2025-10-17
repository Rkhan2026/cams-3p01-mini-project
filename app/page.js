"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/shared/Logo";
import RoleCard from "@/components/ui/RoleCard";
import HeroSection from "@/components/layout/HeroSection";
import { StudentIcon, RecruiterIcon } from "@/components/icons/RoleIcons";
import { DashboardGridIcon } from "@/components/icons/DashboardIcons.jsx";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchSession() {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) throw new Error("Failed to fetch session");
        const data = await res.json();
        if (mounted && data?.success && data?.session) {
          setSession(data.session);
        }
      } catch (err) {
        // silent: treat as not-logged-in
        console.debug("session fetch error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSession();

    return () => {
      mounted = false;
    };
  }, []);

  // While checking session, keep a minimal blank state to avoid layout shift
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" />
    );
  }

  // If user is logged in, show a dashboard-oriented hero and quick links
  if (session) {
    const role = session?.role || "STUDENT";
    const dashboardHref =
      role === "RECRUITER"
        ? "/recruiter"
        : role === "TPO"
        ? "/tpo"
        : "/student";

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <header className="absolute top-0 left-0 right-0 p-6 z-20">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Logo />
              <div className="text-sm text-gray-700">
                Welcome back, {session.name || session.email}
              </div>
            </div>
            <Link
              href={dashboardHref}
              className="px-4 py-2 font-semibold text-white bg-blue-600 rounded shadow hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        </header>

        <main className="flex min-h-screen items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            <HeroSection
              title={`Welcome back${session.name ? `, ${session.name}` : ""}`}
              subtitle="Here's your dashboard quick link to pick up where you left off."
              className="mb-8"
            />
            {/* Dashboard access card (visible only to authenticated users) */}
            <div className="flex items-center justify-center mb-8">
              <RoleCard
                href={dashboardHref}
                title="Go to Dashboard"
                description="Open your dashboard to manage jobs, applications and settings."
                icon={<DashboardGridIcon className="w-8 h-8" />}
                theme="blue"
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Default landing for guests
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

          {/* Guests do not see direct dashboard access */}

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
