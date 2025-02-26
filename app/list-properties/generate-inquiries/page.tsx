//app\list-properties\generate-inquiries\page.tsx

'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { FileText, Download, Bell, ArrowRight, Check, ChevronDown, X } from 'lucide-react';
import * as Select from "@radix-ui/react-select";
import * as Dialog from "@radix-ui/react-dialog";

import AgentSelect from "@/components/ui/my_components/AgentSelect";




const socialMediaSchema = z.object({
  agentRecordId: z.string().optional(),
  agentName: z.string().min(1, 'Agent name is required'),
  propertyLink: z
    .string()
    .min(1, 'Listing Link is required')
    .transform((url) => (url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`))
    .refine((url) => {
      try {
        new URL(url); // ✅ Validate as a proper URL
        return true;
      } catch {
        return false;
      }
    }, { message: 'Invalid URL format' }),
  additionalNotes: z.string().optional(),
});




export default function GenerateInquiries() {
  const { data: session, status } = useSession();
  const socialMediaForm = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      agentName: '',
      propertyLink: '',
      additionalNotes: '',
    },
  });
  const [personalFiles, setPersonalFiles] = useState<
    { id: string; name: string; webViewLink: string; thumbnailLink: string; modifiedTime: string; createdTime: string;}[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  // Load personal files from Google Drive if user is signed in
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (!session) return;

    const fetchFiles = async () => {
      try {
        setLoading(true); // Start loading
        const response = await fetch(`/api/drive`);
        if (!response.ok) throw new Error("Failed to fetch files");
        const data = await response.json();
        setPersonalFiles(data);
      } catch (err) {
        setError("Could not load your personal files. Please try again later.");
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false); // Stop loading
      }
    };


    fetchFiles();
  }, [session]);

  // Prevent render until we know if user is signed in or not
  if (!session) return null;




  const breadcrumbItems = [
    { label: 'List Properties', href: '/list-properties' },
    { label: 'Generate Seller Inquiries', href: '/list-properties/generate-inquiries' },
  ];
  

  async function onSubmitSocialMedia(values: z.infer<typeof socialMediaSchema>) {
    try {
      setIsSubmitting(true);
      setHasSubmitAttempt(false);
      setApiError(null);
  
      // 🔥 Automatically prepend "https://" if missing
      let formattedUrl = values.propertyLink.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      const response = await fetch('/api/airtable/social-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit social media request.');
      }
  
      // ✅ Scroll to top on success
      window.scrollTo({ top: 0, behavior: 'smooth' });
  
      // ✅ Show success modal
      setShowSuccessModal(true);
  
      // ✅ Reset form fields after success
      socialMediaForm.reset({
        agentName: "",
        agentRecordId: "",
        propertyLink: "",
        additionalNotes: "",
      });
  
    } catch (error: any) {
      console.error('❌ Social Media API Error:', error);
      setApiError(error.message || 'An error occurred while submitting.');
      setShowErrorModal(true);
      setHasSubmitAttempt(true);
    } finally {
      setIsSubmitting(false);
    }
  }
  


  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Generate Seller Inquiries</h1>
        <p className="text-primary-medium mt-2">
          Access tools for generating and managing seller leads
        </p>
      </div>

      <div className="relative">
        <Tabs defaultValue="social-media-request" className="space-y-8">
          <div className="sticky top-0 z-10">
            <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2"> {/*⭐ Number of tabs is here*/}

                {/* 🔥 NEW: Social Media Request Tab */}
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
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    <span className="font-medium">Lead-Gen Assets</span>
                  </div>
                  <p className="text-sm text-left">Access marketing materials and templates</p>
                </TabsTrigger>

                <TabsTrigger
                  value="lead-alerts"
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
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
              <p className="text-primary-medium mb-6">Submit a request to feature one of your listings on social media</p>

              <Form {...socialMediaForm}>
                <form 
                  onSubmit={socialMediaForm.handleSubmit(
                    onSubmitSocialMedia, 
                    () => setHasSubmitAttempt(true) // 🔥 Set error flag when validation fails
                  )} 
                  className="space-y-6 max-w-wide"
                >
                  
                  {/* Agent Information */}
                  <div className="space-y-4">
                    <div className="space-y-2  max-w-md">

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
                        <p className="text-sm text-red-500">{socialMediaForm.formState.errors.agentName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Listing Link */}
                  <div className="space-y-4">
                    <Label htmlFor="propertyLink">Listing Link *</Label>
                    <Input {...socialMediaForm.register("propertyLink")} placeholder="Enter a link to the listing being featured" />
                    {socialMediaForm.formState.errors.propertyLink && (
                      <p className="text-sm text-red-500">{socialMediaForm.formState.errors.propertyLink.message}</p>
                    )}
                  </div>

                  {/* Additional Notes Field */}
                  <div className="space-y-4">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      {...socialMediaForm.register("additionalNotes")}
                      placeholder="Enter any additional instructions or details (optional)"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Submit button */}
                  <div className="flex justify-end items-center gap-4">
                    {/* 🔥 Show error message when required fields are missing */}
                    {hasSubmitAttempt && !socialMediaForm.formState.isValid && (
                      <p className="text-red-500 text-sm font-medium flex items-center">
                        ⚠️ Please fill in all required fields.
                      </p>
                    )}

                    {/* ✅ Button stays aligned to the right */}
                    <Button 
                      type="submit"
                      className="w-full md:w-auto bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </Button>
                  </div>



                </form>
              </Form>
            </div>
          </TabsContent>





          {/* Lead-Gen Assets Tab */}
          <TabsContent value="marketing-assets" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-serif text-primary-dark mb-2">Lead Generation Assets</h2>
                <p className="text-primary-medium">
                  Access marketing materials and templates for lead generation
                </p>
              </div>

              {/* Generic Lead-Gen Assets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
                  <h3 className="text-lg font-medium mb-2 text-primary-dark">
                    Property Pitch Deck
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">
                    Professional presentation template for property pitches
                  </p>
                  <Button variant="outline" className="w-full flex items-center gap-2 mt-auto">
                    <Download className="h-4 w-4" />
                    <a
                      href="https://drive.google.com/file/d/1YDeVH6_NJzKa7gaRTHAfG_4gJVs6NqrG/view?usp=drive_link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Template
                    </a>
                  </Button>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
                  <h3 className="text-lg font-medium mb-2 text-primary-dark">
                    Social Media Kit
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">
                    Templates and graphics for social media marketing
                  </p>
                  <Button variant="outline" className="w-full flex items-center gap-2 mt-auto">
                    <Download className="h-4 w-4" />
                    <a
                      href="https://drive.google.com/file/d/0987654321/view"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Kit
                    </a>
                  </Button>
                </Card>

                <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
                  <h3 className="text-lg font-medium mb-2 text-primary-dark">
                  Luxury Living Costa Rica Magazine
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">
                    Our exclusive magazine featuring luxury properties and lifestyle articles
                  </p>
                  <Button variant="outline" className="w-full flex items-center gap-2 mt-auto">
                    <Download className="h-4 w-4" />
                    <a
                      href="https://drive.google.com/file/d/YOUR_ACTUAL_SELLERS_GUIDE_FILE_ID/view"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Magazine
                    </a>
                  </Button>
                </Card>
              </div>
              </div>


              {/* Personal Files Section */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                <h2 className="text-xl font-bold mb-2">Your Personal Files</h2>
                <p className="text-primary-medium mb-6">
                  Access agent-specific marketing assets
                </p>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {loading ? (
                  <p className="text-gray-600">Fetching files...</p> // Show loading text
                ) : personalFiles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {personalFiles.map((file) => (
                      <div key={file.id} className="file-card bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
                        {file.thumbnailLink && (
                          <img src={file.thumbnailLink} alt={file.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                        )}
                        <h3 className="text-lg font-semibold text-primary-dark mb-2">{file.name}</h3>
                        <p className="text-sm text-gray-600 mb-4 flex-grow">Last modified: {new Date(file.modifiedTime).toLocaleDateString()}</p>
                        <a href={file.webViewLink} target="_blank" rel="noopener noreferrer" className="text-primary-dark hover:underline">
                          Open in Drive
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No files found.</p>
                )}
              </div>
          </TabsContent>

          {/* Lead Alerts Tab */}
          <TabsContent value="lead-alerts" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">
                Lead Alerts Configuration
              </h2>
              <p className="text-primary-medium">
                Set up your lead notification preferences
              </p>
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4 text-primary-dark">
                    Notification Settings
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 flex-grow">
                    This feature is coming soon. You will be able to:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                    <li>Set up email notifications for new leads</li>
                    <li>Configure in-app notification preferences</li>
                    <li>Set quiet hours and working schedule</li>
                    <li>Customize notification urgency levels</li>
                  </ul>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
              <p className="text-gray-700 mt-2">Your social media post request was submitted successfully.</p>
              <Dialog.Close asChild>
                <button className="mt-4 w-full bg-accent-gold hover:bg-accent-gold-light text-primary-dark font-semibold py-2 rounded">
                  OK
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={showErrorModal} onOpenChange={setShowErrorModal}>
        <Dialog.Portal>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[100]">
            <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center">
                <Dialog.Title className="text-xl font-semibold text-red-600">Error</Dialog.Title>
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

