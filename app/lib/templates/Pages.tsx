"use client";

import { MODULES } from "@/app/lib/modules"; // Import module config
import ModuleBreadcrumb from "@/components/ui/my_components/ModuleBreadcrumb"; // Import custom breadcrumb component
import ModuleTabs from "@/components/ui/my_components/ModuleTabs"; // Import custom tabs component
import { FileText, FolderOpen } from "lucide-react"; // Import icons

// Import tools //
import ToolOne from "@/app/lib/templates/DataForm"; // Change this per page
import ToolTwo from "@/app/lib/templates/ToolTwo"; // Change this per page

export default function Module() {
  const module = MODULES.sell; // Specify parent module here

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      {/* Breadcrumb component */}
      <ModuleBreadcrumb
        currentPage="Close Deal" // Change this per page
        currentPath="/sell-properties/close-deal" // Change this per page
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