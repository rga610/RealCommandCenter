// components\modules\ParentModuleComponent.tsx

"use client";

import React from "react";
import Link from "next/link";
import { MODULES } from "@/lib/modules/modules-directory";
import ModuleBreadcrumb from "@/components/modules/ModuleBreadcrumb";
import { cn } from "@/lib/utils";
import { Users, FileText, FolderOpen, Bell } from "lucide-react";

export interface ChildModule {
  href: string;
  icon: JSX.Element;
  title: string;
  description: string;
}

export interface ParentModulesProps {
  moduleKey: keyof typeof MODULES;
  childModules: ChildModule[];
  heading?: string;
  description?: string;
}

export default function ParentModules({
  moduleKey,
  childModules,
  heading,
  description,
}: ParentModulesProps) {
  const module = MODULES[moduleKey];

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      {/* Breadcrumb */}
      <ModuleBreadcrumb
        currentPage={module.name}
        currentPath={module.path}
        moduleName={module.name}
        modulePath={module.path}
      />

      {/* Main Heading & Description */}
      <nav className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-serif text-primary-dark">
            {heading || module.name}
          </h1>
          <p className="text-primary-medium mt-2">
            {description || `Manage your ${module.name} seamlessly.`}
          </p>
        </div>
      </nav>

      {/* Grid of Child Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {childModules.map((child) => (
          <Link 
            key={child.href} 
            href={child.href}
            className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300"
            >
              <div className="mb-4">
                {child.icon}
              </div>
              <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light transition-colors">
                {child.title}
              </h2>
              <p className="text-primary-medium">{child.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
