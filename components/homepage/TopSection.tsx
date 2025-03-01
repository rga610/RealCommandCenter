"use client";

import React from "react";
import { UserResource } from "@clerk/types";
import ProfileSection from "./ProfileSection";
import NotificationCenter from "./NotificationCenter";

interface TopSectionProps {
  user: UserResource;
}

export default function TopSection({ user }: TopSectionProps) {
  return (
    <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-start gap-6 flex-col md:flex-row">
        {/* Left side: Profile + stats */}
        <ProfileSection user={user} />

        {/* Right side: Notifications */}
        <NotificationCenter />
      </div>
    </section>
  );
}
