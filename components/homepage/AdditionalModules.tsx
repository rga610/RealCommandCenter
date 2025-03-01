"use client";

import React from "react";
import Link from "next/link";
import { Link as LinkIcon, ExternalLink, Calendar } from "lucide-react";

export default function AdditionalModules() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-20">
      {/* Useful Links */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <LinkIcon className="w-6 h-6 text-primary-dark" />
          <h2 className="text-xl font-serif text-primary-dark">Useful Links</h2>
        </div>
        <div className="space-y-3">
          <Link
            href="#"
            className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-primary-dark">MLS Database</span>
            <ExternalLink size={16} className="text-primary-medium" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-primary-dark">Property Documents</span>
            <ExternalLink size={16} className="text-primary-medium" />
          </Link>
          <Link
            href="#"
            className="flex items-center justify-between p-3 bg-background rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-primary-dark">Marketing Resources</span>
            <ExternalLink size={16} className="text-primary-medium" />
          </Link>
        </div>
      </div>

      {/* Calendar Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-6 h-6 text-primary-dark" />
          <h2 className="text-xl font-serif text-primary-dark">Calendar Overview</h2>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-background rounded-lg">
            <p className="text-primary-dark font-medium">Property Viewing</p>
            <p className="text-sm text-gray-600">Today, 2:00 PM - Villa Paradise</p>
          </div>
          <div className="p-3 bg-background rounded-lg">
            <p className="text-primary-dark font-medium">Client Meeting</p>
            <p className="text-sm text-gray-600">Tomorrow, 10:00 AM - John Doe</p>
          </div>
          <div className="p-3 bg-background rounded-lg">
            <p className="text-primary-dark font-medium">Property Photoshoot</p>
            <p className="text-sm text-gray-600">Wed, 9:00 AM - Sunset Villa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
