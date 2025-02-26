// app/list-properties/evaluate/page.tsx
"use client";

import { useForm, FormProvider } from "react-hook-form";
import { MODULES } from "@/app/lib/modules";
import ModuleBreadcrumb from "@/components/ui/my_components/ModuleBreadcrumb";
import ModuleTabs from "@/components/ui/my_components/ModuleTabs";
import { FileText, FolderOpen } from "lucide-react";

// Import tools
import ListingForm from "./form";
import ComparableInput from "./comparables";
import MatchScore from "./MatchScore"

export default function EvaluateModule() {
  const module = MODULES.list;

  // Set mode: "onBlur" so inputs update their values when they lose focus.
  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      title: "",
      location: "",
      price: "",
      size: "",
      bedrooms: "",
      bathrooms: "",
      agent: "",
      comparables: [],
    },
  });

  return (
    <FormProvider {...methods}>
      <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
        {/* Breadcrumb component */}
        <ModuleBreadcrumb
          currentPage="Evaluate Property"
          currentPath="/list-properties/evaluate"
          moduleName={module.name}
          modulePath={module.path}
        />

        {/* Main heading and description */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-primary-dark">Evaluate Property</h1>
          <p className="text-primary-medium mt-2">
            Compare property values and determine accurate pricing.
          </p>
        </div>

        {/* Tabs Component */}
        <ModuleTabs
          tabs={[
            {
              value: "tab1",
              label: "Property Form",
              description: "Enter details for the property under evaluation",
              icon: <FileText className="h-5 w-5" />,
              component: <ListingForm />,
            },
            {
              value: "tab2",
              label: "Comparables",
              description: "Manually add comparable properties",
              icon: <FolderOpen className="h-5 w-5" />,
              component: <ComparableInput />,
            },
            {
              value: "tab3",
              label: "Match Score",
              description: "Calculate matching score",
              icon: <FolderOpen className="h-5 w-5" />,
              component: <MatchScore />,
            },
          ]}
        />
      </main>
    </FormProvider>
  );
}
