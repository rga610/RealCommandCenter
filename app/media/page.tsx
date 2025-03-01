"use client";

import ParentModule, { ChildModule } from "@/components/modules/ParentModuleComponent";
import { Users, FileText, FolderOpen, Bell } from "lucide-react";

// Define the base path once
const BASE_PATH = "/media";

export default function ListPropertiesPage() {
  // Define the child modules for this parent module
  const childModules: ChildModule[] = [
    {
      href: `${BASE_PATH}/child-module1`,
      icon: <Users className="w-8 h-8 text-primary-dark" />,
      title: "A tool",
      description: "A brief description of the tool.",
    },
    {
      href: `${BASE_PATH}/child-module2`,
      icon: <FileText className="w-8 h-8 text-primary-dark" />,
      title: "Another Tool",
      description: "A brief description of another tool.",
    },
    // Add additional child modules as needed…
  ];

  return (
    <ParentModule
      moduleKey="media"
      childModules={childModules}
      heading="Manage media"
      description="Manage marketing and listing media."
    />
  );
}
