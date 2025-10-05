"use client";

import Button from "../ui/Button";
import Logo from "../shared/Logo";
import { useEffect, useState, useRef } from "react";

export default function Header() {
  const [session, setSession] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Get session from server-side cookie via API
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data.session))
      .catch(() => setSession(null));
  }, []);

  // Effect to close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

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
            <div className="hidden sm:flex items-center gap-3">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {session.name ? session.name.charAt(0).toUpperCase() : session.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* Online status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              
              {/* User Info */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900">
                  {session.name || session.email?.split('@')[0] || 'User'}
                </span>
                <div className="flex items-center gap-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    session.role === "STUDENT" 
                      ? "bg-blue-500" 
                      : session.role === "RECRUITER" 
                      ? "bg-purple-500" 
                      : "bg-emerald-500"
                  }`}></div>
                  <span className="text-xs text-gray-600 font-medium">
                    {session.role === "STUDENT"
                      ? "Student"
                      : session.role === "RECRUITER"
                      ? "Recruiter"
                      : "TPO Admin"}
                  </span>
                </div>
              </div>
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
              {/* --- REGISTRATION DROPDOWN --- */}
              <div className="relative" ref={dropdownRef}>
                <Button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className=" border-gray-300 px-6 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  Register
                  {/* Dropdown arrow icon */}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </Button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <a
                        href="/auth/register?role=STUDENT"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Register as Student
                      </a>
                      <a
                        href="/auth/register?role=RECRUITER"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Register as Recruiter
                      </a>
                    </div>
                  </div>
                )}
              </div>
              {/* --- END REGISTRATION DROPDOWN --- */}

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
