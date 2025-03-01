"use client";

import React from "react";
import { usePathname } from "next/navigation"; // <-- import usePathname
import ModuleBreadcrumb from "@/components/modules/ModuleBreadcrumb";
import ModuleTabs from "@/components/modules/ModuleTabs";
import type { Tab } from "@/components/modules/ModuleTabs";

export interface ChildModulePageProps {
  // For breadcrumb
  moduleName: string;   // e.g. "List Properties"
  modulePath: string;   // e.g. "/list-properties"
  currentPage: string;  // e.g. "Generate Seller Inquiries"
  currentPath?: string; // optional, fallback to usePathname()

  // Main heading + description
  heading: string;
  description: string;

  // Tabs array
  tabs: Tab[];
}

export default function ChildModulePageTemplate({
  moduleName,
  modulePath,
  currentPage,
  currentPath, // optional
  heading,
  description,
  tabs,
}: ChildModulePageProps) {
  // 1) Derive the actual route if currentPath not passed
  const pathname = usePathname();
  const resolvedPath = currentPath || pathname;

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      {/* Breadcrumb */}
      <ModuleBreadcrumb
        currentPage={currentPage}
        currentPath={resolvedPath}
        moduleName={moduleName}
        modulePath={modulePath}
      />

      {/* Main heading and description */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">{heading}</h1>
        <p className="text-primary-medium mt-2">{description}</p>
      </div>

      {/* Tabs */}
      <ModuleTabs tabs={tabs} />
    </main>
  );
}
