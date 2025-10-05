import { SearchIcon, DocumentTextIcon, UserIcon } from "../../icons/DashboardIcons.jsx";

export default function DashboardActions({ onNavigate }) {
  // Define student-specific quick actions
  const quickActions = [
    {
      title: "Browse Jobs",
      description: "Discover new opportunities.",
      icon: <SearchIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/student/jobs"),
      color: "blue",
    },
    {
      title: "My Applications",
      description: "Track your application status.",
      icon: <DocumentTextIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/student/applications"),
      color: "green",
    },
    {
      title: "My Profile",
      description: "Update your information.",
      icon: <UserIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/student/profile"),
      color: "purple",
    },
  ];

  return {
    quickActions,
    handleNavigate: onNavigate,
  };
}