// app\sell-properties\close-deal\page.tsx

"use client";

import { MODULES } from "@/lib/modules/modules-directory"; // Import module config
import ModuleBreadcrumb from "@/components/modules/ModuleBreadcrumb"; // Import custom breadcrumb component
import ModuleTabs from "@/components/modules/ModuleTabs"; // Import custom tabs component
import { FileText, FolderOpen } from "lucide-react"; // Import icons

// Import tools //
import ToolOne from "@/lib/templates/DataFormTemplate";
import ToolTwo from "@/lib/templates/ToolTwo";

export default function Module() {
  const module = MODULES.sell;

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      {/* Breadcrumb component */}
      <ModuleBreadcrumb
        currentPage="Close Deal"
        currentPath="/sell-properties/close-deal"
        moduleName={module.name}
        modulePath={module.path}
      />

      {/* Main heading and description */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Close Deal</h1>
        <p className="text-primary-medium mt-2">
          Manage transactions and documentation seamlessly.
        </p>
      </div>

      {/* Tabs Component */}
      <ModuleTabs
        tabs={[
          {
            value: "tab1",
            label: "Deal Form",
            description: "Submit a deal with all necessary details",
            icon: <FileText className="h-5 w-5" />,
            component: <ToolOne />,
          },
          {
            value: "tab2",
            label: "Transaction Docs",
            description: "View and manage transaction documents",
            icon: <FolderOpen className="h-5 w-5" />,
            component: <ToolTwo />,
          },
        ]}
      />
    </main>
  );
}