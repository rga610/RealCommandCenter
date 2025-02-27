"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import MarketingAssets from "@/components/ui/my_components/media/MarketingAssets";
import ListingMedia from "@/components/ui/my_components/media/ListingMediaSection";


import {
  FileText,
  Download,
  Bell,
  X,
} from "lucide-react";

import * as Dialog from "@radix-ui/react-dialog";
import AgentSelect from "@/components/ui/my_components/AgentSelect";

const socialMediaSchema = z.object({
  agentRecordId: z.string().optional(),
  agentName: z.string().min(1, "Agent name is required"),
  propertyLink: z
    .string()
    .min(1, "Listing Link is required")
    .transform((url) =>
      url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`
    )
    .refine(
      (url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Invalid URL format" }
    ),
  additionalNotes: z.string().optional(),
});

export default function GenerateInquiries() {
  // 1) Clerk user
  const { user, isSignedIn, isLoaded } = useUser();

  // 2) Form
  const socialMediaForm = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      agentName: "",
      propertyLink: "",
      additionalNotes: "",
    },
  });

  // 3) All Hooks must be defined unconditionally (before any `return`)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [activeTab, setActiveTab] = useState("social-media-request");

  // 4) If loading or not signed in, render fallback UI (but after Hooks)
  if (!isLoaded) return <p>Loading user...</p>;
  if (!isSignedIn) return null; // or redirect to /auth/signin

  // 5) Submission handler
  async function onSubmitSocialMedia(values: z.infer<typeof socialMediaSchema>) {
    try {
      setIsSubmitting(true);
      setHasSubmitAttempt(false);
      setApiError(null);

      // ensure https://
      let formattedUrl = values.propertyLink.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const response = await fetch("/api/airtable/social-media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, propertyLink: formattedUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit social media request.");
      }

      // success => show modal + reset form
      window.scrollTo({ top: 0, behavior: "smooth" });
      setShowSuccessModal(true);
      socialMediaForm.reset({
        agentName: "",
        agentRecordId: "",
        propertyLink: "",
        additionalNotes: "",
      });
    } catch (error: any) {
      console.error("❌ Social Media API Error:", error);
      setApiError(error.message || "An error occurred while submitting.");
      setShowErrorModal(true);
      setHasSubmitAttempt(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  // 6) Breadcrumb
  const breadcrumbItems = [
    { label: "List Properties", href: "/list-properties" },
    { label: "Generate Seller Inquiries", href: "/list-properties/generate-inquiries" },
  ];

  // 7) Render
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Generate Seller Inquiries</h1>
        <p className="text-primary-medium mt-2">
          Access tools for generating and managing seller leads
        </p>
      </div>

      {/* Tabs */}
      <div className="relative">
        <Tabs
          defaultValue="social-media-request"
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="sticky top-0 z-10">
            <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2">
                <TabsTrigger
                  value="social-media-request"
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold 
                  data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark 
                  hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start 
                  p-4 gap-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">Request Social Media Post</span>
                  </div>
                  <p className="text-sm text-left">Submit social media post requests</p>
                </TabsTrigger>

                <TabsTrigger
                  value="marketing-assets"
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold 
                  data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark 
                  hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start 
                  p-4 gap-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    <span className="font-medium">Lead-Gen Assets</span>
                  </div>
                  <p className="text-sm text-left">Access marketing materials and templates</p>
                </TabsTrigger>

                <TabsTrigger
                  value="lead-alerts"
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold 
                  data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark 
                  hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start 
                  p-4 gap-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <span className="font-medium">Lead Alerts</span>
                  </div>
                  <p className="text-sm text-left">Configure lead notifications and alerts</p>
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          {/* Social Media Request Tab */}
          <TabsContent value="social-media-request" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">Request Social Media Post</h2>
              <p className="text-primary-medium mb-6">
                Submit a request to feature one of your listings on social media
              </p>

              <Form {...socialMediaForm}>
                <form
                  onSubmit={socialMediaForm.handleSubmit(
                    onSubmitSocialMedia,
                    () => setHasSubmitAttempt(true)
                  )}
                  className="space-y-6 max-w-wide"
                >
                  {/* Agent Info */}
                  <div className="space-y-4">
                    <div className="space-y-2 max-w-md">
                      <AgentSelect
                        value={socialMediaForm.watch("agentRecordId")}
                        onChange={(id, agent) => {
                          if (agent) {
                            socialMediaForm.setValue("agentRecordId", id);
                            socialMediaForm.setValue("agentName", agent.name);
                            socialMediaForm.clearErrors("agentName");
                          }
                        }}
                        error={socialMediaForm.formState.errors.agentName?.message}
                      />
                      {socialMediaForm.formState.errors.agentName && (
                        <p className="text-sm text-red-500">
                          {socialMediaForm.formState.errors.agentName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Listing Link */}
                  <div className="space-y-4">
                    <Label htmlFor="propertyLink">Listing Link *</Label>
                    <Input
                      {...socialMediaForm.register("propertyLink")}
                      placeholder="Enter a link to the listing being featured"
                    />
                    {socialMediaForm.formState.errors.propertyLink && (
                      <p className="text-sm text-red-500">
                        {socialMediaForm.formState.errors.propertyLink.message}
                      </p>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-4">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      {...socialMediaForm.register("additionalNotes")}
                      placeholder="Enter any additional instructions or details (optional)"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Submit */}
                  <div className="flex justify-end items-center gap-4">
                    {hasSubmitAttempt && !socialMediaForm.formState.isValid && (
                      <p className="text-red-500 text-sm font-medium flex items-center">
                        ⚠️ Please fill in all required fields.
                      </p>
                    )}
                    <Button
                      type="submit"
                      className="w-full md:w-auto bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </TabsContent>

          {/* Marketing Assets Tab */}
          <TabsContent value="marketing-assets" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-serif text-primary-dark mb-2">Lead Generation Assets</h2>
                <p className="text-primary-medium">
                  Access marketing materials and templates for lead generation
                </p>
              </div>

              {/* Now only marketing assets here */}
              <MarketingAssets />

              {/* New Listing Media Section below it */}
              <ListingMedia />
            </div>
          </TabsContent>

          {/* Lead Alerts Tab */}
          <TabsContent value="lead-alerts" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">
                Lead Alerts Configuration
              </h2>
              <p className="text-primary-medium">Set up your lead notification preferences</p>
              <div className="space-y-6">
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Success Modal */}
      <Dialog.Root open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <Dialog.Portal>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100]">
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-xl font-semibold">Success!</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>
              <p className="text-gray-700 mt-2">
                Your social media post request was submitted successfully.
              </p>
              <Dialog.Close asChild>
                <button className="mt-4 w-full bg-accent-gold hover:bg-accent-gold-light text-primary-dark font-semibold py-2 rounded">
                  OK
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Error Modal */}
      <Dialog.Root open={showErrorModal} onOpenChange={setShowErrorModal}>
        <Dialog.Portal>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100]">
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-xl font-semibold text-red-600">
                  Error
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </Dialog.Close>
              </div>
              <p className="text-gray-700 mt-2">{apiError}</p>
              <Dialog.Close asChild>
                <button className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded">
                  OK
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </main>
  );
}
