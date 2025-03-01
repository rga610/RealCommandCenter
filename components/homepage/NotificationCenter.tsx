"use client";

import React from "react";
import { Bell } from "lucide-react";

export default function NotificationCenter() {
  return (
    <div className="w-full md:w-80 bg-background p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-primary-dark flex items-center gap-2">
          <Bell size={20} />
          Recent Notifications
        </h3>
        <span className="bg-primary-dark text-white text-xs px-2 py-1 rounded-full">
          3 new
        </span>
      </div>
      <div className="space-y-3">
        <div className="border-l-4 border-accent-gold bg-white p-3 rounded shadow-sm">
          <p className="text-sm text-primary-dark">New inquiry for Villa Paradise</p>
          <p className="text-xs text-gray-500">10 minutes ago</p>
        </div>
        <div className="border-l-4 border-primary-light bg-white p-3 rounded shadow-sm">
          <p className="text-sm text-primary-dark">Meeting with John Doe scheduled</p>
          <p className="text-xs text-gray-500">1 hour ago</p>
        </div>
        <div className="border-l-4 border-primary-light bg-white p-3 rounded shadow-sm">
          <p className="text-sm text-primary-dark">Property viewing confirmed</p>
          <p className="text-xs text-gray-500">2 hours ago</p>
        </div>
      </div>
    </div>
  );
}
