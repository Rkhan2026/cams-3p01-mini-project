"use client";

import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import Logo from "@/components/shared/Logo";

export default function StudentLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { href: "/student", label: "Dashboard", icon: "🏠" },
    { href: "/student/jobs", label: "Browse Jobs", icon: "🔍" },
    { href: "/student/applications", label: "My Applications", icon: "📋" },
    { href: "/student/profile", label: "Profile", icon: "👤" },
  ];

  const isActive = (href) => {
    if (href === "/student") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
