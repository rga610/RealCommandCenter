"use client";

import { MODULES } from "@/lib/modules/modules-directory"; // Import module config
import ModuleBreadcrumb from "@/components/modules/ModuleBreadcrumb"; // Import custom breadcrumb component
import ModuleTabs from "@/components/modules/ModuleTabs"; // Import custom tabs component
import { FileText, FolderOpen } from "lucide-react"; // Import icons

// Import tools //
import ClientReport from "@/app/marketing/client-reports/ClientReport";
import ToolTwo from "@/lib/templates/ToolTwo"; // Change this per page

export default function Module() {
  const module = MODULES.marketing; // Specify parent module here

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      {/* Breadcrumb component */}
      <ModuleBreadcrumb
        currentPage="Client Reports" // Change this per page
        currentPath="/marketing/client-reports" // Change this per page
        moduleName={module.name}
        modulePath={module.path}
      />

      {/* Main heading and description */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Client Reports</h1>
        <p className="text-primary-medium mt-2">
          Share client-facing marketing reports and documentation seamlessly.
        </p>
      </div>

      {/* Tabs Component */}
      <ModuleTabs
        tabs={[
          {
            value: "tab1",
            label: "Marketing report",
            description: "Create and share a digital marketing report",
            icon: <FileText className="h-5 w-5" />,
            component: <ClientReport property={{ 
                //Placeholder data directly here
                title: "Luxury Flats 21 Condo", 
                socialReach: "516",
                socialInteractions: "33",
                emailSent: "9,109",
                emailOpenRate: "38.1%",
                uniqueClicks: "52",
                paidReach: "18,059",
                paidImpressions: "31,428",
                paidLeads: "95",
                marketingNotes: "Strong organic reach; consider a paid campaign."
              }} />,
            },
          {
            value: "tab2",
            label: "Tool 2",
            description: "This is a placeholder description",
            icon: <FolderOpen className="h-5 w-5" />,
            component: <ToolTwo />,
          },
        ]}
      />
    </main>
  );
}