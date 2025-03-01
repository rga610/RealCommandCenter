"use client";

import ParentModule, { ChildModule } from "@/components/modules/ParentModuleComponent";
import { Presentation } from "lucide-react";

// Define the base path for the Marketing module
const BASE_PATH = "/marketing";

export default function MarketingPage() {
  const childModules: ChildModule[] = [
    {
      href: `${BASE_PATH}/client-reports`,
      icon: <Presentation className="w-8 h-8 text-primary-dark" />,
      title: "Client Reports",
      description: "Generate digital marketing client reports",
    },
  ];

  return (
    <ParentModule
      moduleKey="marketing"
      childModules={childModules}
      heading="Marketing"
      description="Market our brand and specific listings."
    />
  );
}
