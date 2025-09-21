"use client";

import { useRouter, usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import Logo from "@/components/Logo";

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
    { href: "/tpo/users", label: "User Management", icon: "⚙️" }
  ];

  const isActive = (href) => {
    if (href === "/tpo") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation Header */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0 flex items-center space-x-3">
                <Logo width={100} height={48} />
                <div>
                  <p className="text-xs text-neutral-500 font-medium">TPO Admin Portal</p>
                </div>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden lg:flex space-x-4">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-purple-100 text-purple-700"
                        : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-sm px-4 py-2"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-purple-100 text-purple-700"
                    : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}