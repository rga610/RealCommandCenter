"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Top area combining profile + notifications
import HomepageTopSection from "@/components/homepage/TopSection";
import HomepageGreetingSection from "@/components/homepage/GreetingSection";
import HomepageActionCards from "@/components/homepage/ActionCards";
import HomepageAdditionalModules from "@/components/homepage/AdditionalModules";
import HomepageAIChat from "@/components/homepage/AIChat";

export default function Home() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/auth/signin");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Authenticating...
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Profile + Notifications together */}
      <HomepageTopSection user={user} />

      {/* Greeting */}
      <HomepageGreetingSection user={user} />

      {/* Main Action Cards */}
      <HomepageActionCards />

      {/* Additional Modules (Useful Links + Calendar Overview) */}
      <HomepageAdditionalModules />

      {/* AI Assistant Chat */}
      <HomepageAIChat />
    </main>
  );
}
