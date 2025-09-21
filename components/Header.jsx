"use client";

import Button from "./ui/Button";
import Logo from "./Logo";
import { useEffect, useState } from "react";

export default function Header() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Get session from server-side cookie via API
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data.session))
      .catch(() => setSession(null));
  }, []);

  return (
    <header className="w-full bg-white backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity duration-200"
        >
          <Logo width={120} height={57} />
        </a>

        <div className="flex items-center gap-4">
          {session && (
            <div className="hidden sm:flex items-center bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                {session.role === "STUDENT"
                  ? "Student"
                  : session.role === "RECRUITER"
                  ? "Recruiter"
                  : "TPO Admin"}
              </span>
            </div>
          )}

          {session ? (
            <Button
              onClick={async () => {
                await fetch("/api/auth/logout", { method: "POST" });
                location.href = "/";
              }}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Sign Out
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                as="a"
                href="/auth/register?role=STUDENT"
                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Register As Student
              </Button>
              <Button
                as="a"
                href="/auth/register?role=RECRUITER"
                className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
              >
                Register As Company Recruiter
              </Button>
              <Button
                as="a"
                href="/auth/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
