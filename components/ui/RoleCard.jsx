// @/components/RoleCard.tsx
import Link from "next/link";

const themeClasses = {
  blue: {
    gradient: "from-blue-500 to-blue-600",
    text: "text-blue-600",
    hoverBorder: "hover:border-blue-500/50",
  },
  green: {
    gradient: "from-green-500 to-green-600",
    text: "text-green-600",
    hoverBorder: "hover:border-green-500/50",
  },
};

export default function RoleCard({ href, icon, title, description, theme }) {
  const colors = themeClasses[theme];

  return (
    <Link
      href={href}
      // Cleaner class management for hover states and transitions
      className={`
        group relative w-full max-w-sm rounded-2xl bg-white p-8 text-center
        border border-gray-100 shadow-lg transition-all duration-300
        hover:shadow-2xl hover:-translate-y-2 
        ${colors.hoverBorder}
      `}
    >
      {/* Subtle background glow on hover for a nicer feel */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
      />

      <div className="relative z-10">
        {/* Icon container */}
        <div
          className={`mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-gradient-to-br ${colors.gradient} text-white transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>

        {/* Card Content */}
        <h3 className="mb-3 text-2xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}