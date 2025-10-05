"use client";

import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import Logo from "@/components/shared/Logo";

export default function TPOLayout({ children }) {
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
    { href: "/tpo", label: "Dashboard", icon: "🏠" },
    { href: "/tpo/approvals", label: "User Approvals", icon: "👥" },
    { href: "/tpo/jobs", label: "Job Management", icon: "📊" },
    { href: "/tpo/applications", label: "Applications", icon: "📋" },
    { href: "/tpo/reports", label: "Reports", icon: "📈" },
    { href: "/tpo/users", label: "User Management", icon: "⚙️" },
  ];

  const isActive = (href) => {
    if (href === "/tpo") {
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
