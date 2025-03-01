"use client";

import ParentModule, { ChildModule } from "@/components/modules/ParentModuleComponent";
import {
  Users,
  ClipboardList,
  UserPlus,
  Search,
  Eye,
  LineChart,
  FileCheck,
  FileText,
  DollarSign,
  MessageSquare,
} from "lucide-react";

// Define the base path for the Sell Properties module
const BASE_PATH = "/sell-properties";

export default function SellPropertiesPage() {
  // Define the child modules using the BASE_PATH
  const childModules: ChildModule[] = [
    {
      href: `${BASE_PATH}/generate-inquiries`,
      icon: <Users className="w-8 h-8 text-primary-dark" />,
      title: "Generate Buyer Inquiries",
      description: "Manage and track buyer leads",
    },
    {
      href: `${BASE_PATH}/capture-inquiries`,
      icon: <ClipboardList className="w-8 h-8 text-primary-dark" />,
      title: "Capture Buyer Inquiries",
      description: "Qualify and process buyer leads",
    },
    {
      href: `${BASE_PATH}/onboard-buyer`,
      icon: <UserPlus className="w-8 h-8 text-primary-dark" />,
      title: "Onboard Buyer",
      description: "Guide buyers through onboarding",
    },
    {
      href: `${BASE_PATH}/property-search`,
      icon: <Search className="w-8 h-8 text-primary-dark" />,
      title: "Property Search",
      description: "Search and shortlist properties",
    },
    {
      href: `${BASE_PATH}/viewings`,
      icon: <Eye className="w-8 h-8 text-primary-dark" />,
      title: "Property Viewings",
      description: "Schedule and manage property viewings",
    },
    {
      href: `${BASE_PATH}/evaluate-viewings`,
      icon: <LineChart className="w-8 h-8 text-primary-dark" />,
      title: "Evaluate Viewings",
      description: "Review and analyze property viewings",
    },
    {
      href: `${BASE_PATH}/offers`,
      icon: <FileCheck className="w-8 h-8 text-primary-dark" />,
      title: "Manage Offers",
      description: "Handle and track property offers",
    },
    {
      href: `${BASE_PATH}/transaction`,
      icon: <FileText className="w-8 h-8 text-primary-dark" />,
      title: "Transaction Docs",
      description: "Manage transaction documentation",
    },
    {
      href: `${BASE_PATH}/close-deal`,
      icon: <DollarSign className="w-8 h-8 text-primary-dark" />,
      title: "Close Deal",
      description: "Finalize the sale and manage commissions",
    },
    {
      href: `${BASE_PATH}/follow-up`,
      icon: <MessageSquare className="w-8 h-8 text-primary-dark" />,
      title: "Post-Sale Follow-Up",
      description: "Maintain client relationships",
    },
  ];

  return (
    <ParentModule
      moduleKey="sell"
      childModules={childModules}
      heading="Sell a Property"
      description="Guide buyers through their property purchase journey"
    />
  );
}
