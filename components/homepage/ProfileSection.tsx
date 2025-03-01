"use client";

import React from "react";
import { UserResource } from "@clerk/types";
import { Users, Building2 } from "lucide-react";

interface ProfileSectionProps {
  user: UserResource;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const profileImage = user?.imageUrl

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 flex-1">
      {/* Profile Picture */}
      <div className="relative w-44 h-44">
        <img
          src={profileImage}
          alt="Profile"
          className="w-44 h-44 rounded-full object-cover border-4 border-white shadow-md"
        />
      </div>

      {/* Name + Stats */}
      <div>
        <h1 className="text-3xl font-serif text-primary-dark mb-2">
          {user?.fullName || user?.username}
        </h1>
        <p className="text-primary-medium mb-4">
           {(user?.publicMetadata as { jobtitle?: string[] })?.jobtitle?.[0] || "Luxury Living Costa Rica"}
          </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
          <div className="bg-background p-4 rounded-lg">
            <div className="flex items-center gap-2 text-primary-dark mb-1">
              <Users size={20} />
              <span className="font-medium">Seller Leads</span>
            </div>
            <p className="text-2xl font-bold text-primary-dark">
              24
              <span className="text-sm font-normal text-gray-600">/36</span>
            </p>
          </div>

          <div className="bg-background p-4 rounded-lg">
            <div className="flex items-center gap-2 text-primary-dark mb-1">
              <Building2 size={20} />
              <span className="font-medium">Buyer Leads</span>
            </div>
            <p className="text-2xl font-bold text-primary-dark">
              18
              <span className="text-sm font-normal text-gray-600">/28</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
