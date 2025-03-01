// components/ui/my_components/ModuleBreadcrumb.tsx

"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface ModuleBreadcrumbProps {
  moduleName: string;  // e.g. "List Properties"
  modulePath: string;  // e.g. "/list"
  currentPage: string; // e.g. "List Properties" or "Generate Inquiries"
  currentPath: string; // e.g. "/list" or "/list/generate-inquiries"
}

export default function ModuleBreadcrumb({
  moduleName,
  modulePath,
  currentPage,
  currentPath,
}: ModuleBreadcrumbProps) {
  // If modulePath === currentPath, we're on the parent page (no child route)
  const isParentPage = modulePath === currentPath;

  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center space-x-2">
        {/* Home Link */}
        <li>
          <Link
            href="/"
            className="text-primary-medium hover:text-primary-dark transition-colors flex items-center hover:bg-gray-100 p-2 rounded-xl"
          >
            <Home size={20} />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {/* Parent Module Link */}
        <li className="flex items-center">
          <ChevronRight size={18} className="text-gray-400 mx-1" />
          <Link
            href={modulePath}
            className="text-primary-medium hover:text-primary-dark transition-colors hover:bg-gray-100 p-2 rounded-xl"
          >
            {moduleName}
          </Link>
        </li>

        {/* Current Page crumb (only if it's a child route) */}
        {!isParentPage && (
          <li className="flex items-center">
            <ChevronRight size={18} className="text-gray-400 mx-1" />
            <span className="text-primary-dark font-medium p-1 border-b-2 rounded-b-md border-accent-gold-light">
              {currentPage}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}
