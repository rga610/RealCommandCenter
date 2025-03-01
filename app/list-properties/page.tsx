// app/list-properties/page.tsx
"use client";

import ParentModule, { ChildModule } from "@/components/modules/ParentModuleComponent";
import {
  Users,
  ClipboardList,
  UserPlus,
  Database,
  Calculator,
  Camera,
  FileText,
  Globe,
  LineChart,
  Settings,
} from "lucide-react";

// Define the base path once
const BASE_PATH = "/list-properties";

export default function ListPropertiesPage() {
  // Define the child modules using BASE_PATH
  const childModules: ChildModule[] = [
    {
      href: `${BASE_PATH}/generate-inquiries`,
      icon: <Users className="w-8 h-8 text-primary-dark" />,
      title: "Generate Seller Inquiries",
      description: "Access marketing assets and see new leads",
    },
    {
      href: `${BASE_PATH}/capture-inquiries`,
      icon: <ClipboardList className="w-8 h-8 text-primary-dark" />,
      title: "Capture Seller Inquiries",
      description: "Report and manage new seller leads",
    },
    {
      href: `${BASE_PATH}/onboard-seller`,
      icon: <UserPlus className="w-8 h-8 text-primary-dark" />,
      title: "Onboard Seller",
      description: "Guide sellers through the onboarding process",
    },
    {
      href: `${BASE_PATH}/collect-data`,
      icon: <Database className="w-8 h-8 text-primary-dark" />,
      title: "Collect Listing Data",
      description: "Gather and manage property information",
    },
    {
      href: `${BASE_PATH}/evaluate`,
      icon: <Calculator className="w-8 h-8 text-primary-dark" />,
      title: "Evaluate Property",
      description: "Conduct property evaluation and CMA",
    },
    {
      href: `${BASE_PATH}/visual-assets`,
      icon: <Camera className="w-8 h-8 text-primary-dark" />,
      title: "Create Visual Assets",
      description: "Manage property photography and media",
    },
    {
      href: `${BASE_PATH}/develop-content`,
      icon: <FileText className="w-8 h-8 text-primary-dark" />,
      title: "Develop Listing Content",
      description: "Create and manage listing descriptions",
    },
    {
      href: `${BASE_PATH}/activate`,
      icon: <Globe className="w-8 h-8 text-primary-dark" />,
      title: "Activate Listing",
      description: "Publish and manage active listings",
    },
    {
      href: `${BASE_PATH}/monitor`,
      icon: <LineChart className="w-8 h-8 text-primary-dark" />,
      title: "Monitor Performance",
      description: "Track listing metrics and performance",
    },
    {
      href: `${BASE_PATH}/optimize`,
      icon: <Settings className="w-8 h-8 text-primary-dark" />,
      title: "Optimize Listing",
      description: "Update and optimize listing performance",
    },
  ];

  return (
    <ParentModule
      moduleKey="list"
      childModules={childModules}
      heading="List a Property"
      description="Manage your property listings from start to finish"
    />
  );
}
