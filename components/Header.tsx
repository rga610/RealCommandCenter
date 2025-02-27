"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Bell, Home } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
// The built-in Clerk user button menu
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Example: If you store roles in user?.publicMetadata?.roles, you can display them
  const userRoles = (user?.publicMetadata?.roles as string[]) ?? [];
  const formattedRoles = userRoles.join(", "); // e.g. "dev, agent"

  // Optional: show a toast if unauthorized param is present
  useEffect(() => {
    if (searchParams.get("unauthorized") === "true") {
      toast.error("You don't have permission to access this section", {
        description: "Please contact an administrator if you need access.",
      });
      // remove the param from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete("unauthorized");
      window.history.replaceState({}, "", url);
    }
  }, [searchParams]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Left side: branding */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5 text-primary-dark" />
              <span className="text-primary-dark text-lg font-serif font-semibold">
                Real Estate Command Center
              </span>
            </a>
          </div>

          {/* Right side: optional role badge, notifications, user button */}
          <div className="flex items-center gap-4">
            {isLoaded && isSignedIn && (
              <>
                {/* If you want to display the user’s roles */}
                {formattedRoles && (
                  <div className="hidden md:flex items-center">
                    <span className="text-xs font-medium bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                      {formattedRoles}
                    </span>
                  </div>
                )}

                {/* A simple notifications button (no logic attached) */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </Button>

                {/* Clerk’s built-in user menu: sign out, manage account, etc. */}
                <UserButton afterSignOutUrl="/auth/signin" />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
