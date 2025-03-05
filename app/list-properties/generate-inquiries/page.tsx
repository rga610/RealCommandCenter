"use client";

import { MODULES } from "@/lib/modules/modules-directory";
import ChildModulePageTemplate from "@/components/modules/ChildModuleComponent";
import { FileText, FolderOpen, Bell } from "lucide-react";

import SMListingFeatureForm from "../../../components/modules/list-properties/generate-inquiries/tools/sm-listing-feature-form";
import MarketingAssets from "@/components/modules/media/tools/MarketingAssets";
import ListingMedia from "@/components/modules/media/tools/ListingMedia";
import { Card } from "@/components/default/card";

export default function GenerateInquiries() {
  const module = MODULES.list // Configure mondule path in 'app\lib\modules.ts'

  const tabs = [
    {
      value: "social-media-request",
      label: "Request Social Media Post",
      description: "Feature one of your listings on social media",
      tooltipText: `
# **How to Request a Social Media Post**
---
**1.** Add a link to the listing's webpage  
**2.** Click *"Submit Request"*  
**3.** Wait for approval  
`,
      icon: <FileText className="h-5 w-5" />,
      component: <SMListingFeatureForm />,
    },
    {
      value: "lead-gen-assets",
      label: "Lead-Gen Assets",
      description: "Access marketing materials and templates",
      tooltipText: "Here’s how to request a social media post...",
      icon: <FolderOpen className="h-5 w-5" />,
      component: (
        <>
          <div className="mb-6">
            <h2 className="text-xl font-serif text-primary-dark mb-2">
              Lead Generation Assets
            </h2>
            <p className="text-primary-medium">
              Access marketing materials and templates for lead generation
            </p>
          </div>
          <MarketingAssets />
          <ListingMedia />
        </>
      ),
    },
    {
      value: "lead-alerts",
      label: "Lead Alerts",
      description: "Configure lead notifications and alerts",
      tooltipText: "Here’s how to request a social media post...",
      icon: <Bell className="h-5 w-5" />,
      component: (
        <div className="p-6">
          <h2 className="text-xl font-serif text-primary-dark mb-2">
            Lead Alerts Configuration
          </h2>
          <p className="text-primary-medium">
            Set up your lead notification preferences
          </p>
          <div className="space-y-6 mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4 text-primary-dark">
                Notification Settings
              </h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">
                This feature is coming soon...
              </p>
            </Card>
          </div>
        </div>
      ),
    },
  ];

  return (
    <ChildModulePageTemplate
      moduleName={module.name}
      modulePath={module.path}
      currentPage="Generate Seller Inquiries"
      heading="Generate Seller Inquiries"
      description="Access tools for generating and managing seller leads."
      tabs={tabs}
    />
  );
}
