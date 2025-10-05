import { PlusCircleIcon, DocumentTextIcon, CollectionIcon } from "../../icons/DashboardIcons.jsx";

export default function DashboardActions({ onNavigate }) {
  // Define recruiter-specific quick actions
  const quickActions = [
    {
      title: "Post a New Job",
      description: "Create a new job listing for students to apply.",
      icon: <PlusCircleIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/recruiter/jobs/new"),
      color: "blue"
    },
    {
      title: "Review Applications",
      description: "Manage and review all incoming candidate applications.",
      icon: <DocumentTextIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/recruiter/applications"),
      color: "green"
    },
    {
      title: "Manage All Jobs",
      description: "View, edit, or update your existing job postings.",
      icon: <CollectionIcon className="w-10 h-10 text-white" />,
      onClick: () => onNavigate("/recruiter/jobs"),
      color: "purple"
    }
  ];

  return {
    quickActions,
    handleNavigate: onNavigate,
  };
}