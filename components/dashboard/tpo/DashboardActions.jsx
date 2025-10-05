import { UserGroupIcon, DocumentCheckIcon, ChartBarIcon } from "../../icons/DashboardIcons.jsx";

export default function DashboardActions({ onUserApproval, onJobApproval, onNavigate }) {
  // Define TPO-specific quick actions
  const quickActions = [
    {
      title: "User Approvals",
      description:
        "Review and approve new student and recruiter registrations.",
      icon: <UserGroupIcon className="w-8 h-8 text-white" />,
      onClick: () => onNavigate("/tpo/approvals"),
      color: "blue",
    },
    {
      title: "Job Approvals",
      description: "Manage and approve job postings submitted by recruiters.",
      icon: <DocumentCheckIcon className="w-8 h-8 text-white" />,
      onClick: () => onNavigate("/tpo/jobs"),
      color: "green",
    },
    {
      title: "View Reports",
      description: "Analyze placement data and generate insightful reports.",
      icon: <ChartBarIcon className="w-8 h-8 text-white" />,
      onClick: () => onNavigate("/tpo/reports"),
      color: "purple",
    },
  ];

  return {
    quickActions,
    handleUserApproval: onUserApproval,
    handleJobApproval: onJobApproval,
    handleNavigate: onNavigate,
  };
}