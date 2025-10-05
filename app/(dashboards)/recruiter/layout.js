"use client";

import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import Logo from "@/components/shared/Logo";

export default function RecruiterLayout({ children }) {
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
    { href: "/recruiter", label: "Dashboard", icon: "🏠" },
    { href: "/recruiter/jobs", label: "My Jobs", icon: "📊" },
    { href: "/recruiter/applications", label: "Applications", icon: "📋" },
    { href: "/recruiter/profile", label: "Profile", icon: "🏢" },
  ];

  const isActive = (href) => {
    if (href === "/recruiter") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
