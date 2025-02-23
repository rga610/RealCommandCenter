//app\list-properties\capture-inquiries\page.tsx

'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { FileText, Download, Bell, ArrowRight } from 'lucide-react'
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";



const formSchema = z.object({
  agentRecordId: z.string().optional(),
  agentName: z.string().min(1, 'Agent name is required'),
  reportDate: z.string().min(1, 'Report date is required'),
  clientFirstName: z.string().min(1, 'First name is required'),
  clientLastName: z.string().min(1, 'Last name is required'),
  clientEmail: z.string().email('Invalid email').or(z.literal('NA')),
  clientPhone: z.string().min(1, 'Phone is required').or(z.literal('NA')),
  relatedContact: z.string().optional(),
  relationshipType: z.string().optional(),
  additionalInfo: z.string().optional(),
  leadType: z.enum(['sell', 'rent', 'sell or rent'], {
    required_error: 'Lead type is required',
  }),
  propertyAddress: z.string().min(1, 'Property address is required'),
  community: z.string().optional(),
  propertyDetails: z.string().optional(),
  contactStatus: z.enum(['Pending', 'Contacted'], {
    required_error: 'Contact status is required',
  }),
  agentNotes: z.string().optional(),
})

export default function CaptureInquiries() {
  const [agents, setAgents] = useState<{ id: string; name: string }[]>([]);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [hasSubmitAttempt, setHasSubmitAttempt] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  



  useEffect(() => {
    async function loadAgents() {
      try {
        const res = await fetch("/api/airtable/agents");
        const data = await res.json();

        console.log("📌 Received agents in Frontend:", data);

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid agents data received");
        }

        setAgents(
          data.map((r: any) => ({
            id: r.id,
            name: r.name,
          }))
        );
      } catch (error) {
        console.error("🚨 Error loading agents:", error);
        setAgents([]);
      }
    }
    loadAgents();
  }, []);

  
  

  const [isSubmitting, setIsSubmitting] = useState(false)


  const breadcrumbItems = [
    { label: 'List a Property', href: '/list-properties' },
    { label: 'Capture Seller Inquiries', href: '/list-properties/capture-inquiries' }
  ]

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agentName: '',
      reportDate: new Date().toISOString().split('T')[0],
      clientFirstName: '',
      clientLastName: '',
      clientEmail: '',
      clientPhone: '',
      relatedContact: '',
      relationshipType: '',
      additionalInfo: '',
      leadType: 'sell',
      propertyAddress: '',
      community: '',
      propertyDetails: '',
      contactStatus: 'Pending',
      agentNotes: '',
    },
  })

    // 🔥 Auto-Clear Error Message When Form is Valid
    useEffect(() => {
      // Get the current form values
      const values = form.watch();
    
      // Check if all required fields are filled
      const isFormValid =
        values.agentName &&
        values.reportDate &&
        values.clientFirstName &&
        values.clientLastName &&
        values.clientEmail &&
        values.clientPhone &&
        values.propertyAddress;
    
      if (hasSubmitAttempt && isFormValid) {
        setHasSubmitAttempt(false); // ✅ Hide error when the form becomes valid
      }
    }, [form.watch("agentName"), form.watch("reportDate"), form.watch("clientFirstName"), 
        form.watch("clientLastName"), form.watch("clientEmail"), form.watch("clientPhone"), 
        form.watch("propertyAddress")]);
    
    

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setHasSubmitAttempt(false); // Reset error state on valid submission
      setApiError(null); // Clear previous errors

  
      const response = await fetch('/api/airtable/seller-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); // Try to extract API error details
        throw new Error('Failed to submit data to Airtable.');
      }
  
      // ✅ Scroll to Top Immediately
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // ✅ Show Success Modal
      setShowSuccessModal(true);
  
      form.reset({
        agentName: "",
        agentRecordId: "",
        reportDate: new Date().toISOString().split("T")[0],
        clientFirstName: "",
        clientLastName: "",
        clientEmail: "",
        clientPhone: "",
        relatedContact: "",
        relationshipType: "",
        additionalInfo: "",
        leadType: "sell", // ✅ Explicitly set the default
        propertyAddress: "",
        community: "",
        propertyDetails: "",
        contactStatus: "Pending", // ✅ Explicitly set the default
        agentNotes: "",
      });
      

    } catch (error: any) {
      console.error('❌ Airtable API Error:', error);
      
      // ✅ Show Error Modal
      setApiError(error.message || 'An error occurred while submitting the form.');
      setShowErrorModal(true); 
  
      setHasSubmitAttempt(true); // 🔥 Show error if validation failed
    } finally {
      setIsSubmitting(false);
    }
  }
      
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Capture Seller Inquiries</h1>
        <p className="text-primary-medium mt-2">Access tools for reporting and managing new seller leads</p>
      </div>

      <div className="relative">
        <Tabs defaultValue="lead-form" className="space-y-8">
          <div className="sticky top-0 z-10">
            <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2">

                <TabsTrigger 
                  value="lead-form" 
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="font-medium">Lead Reporting Form</span>
                  </div>
                  <p className="text-sm text-left">Submit new seller leads through a structured form</p>
                </TabsTrigger>

                
                <TabsTrigger 
                  value="placeholder" 
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <span className="font-medium">This is a placeholder</span>
                  </div>
                  <p className="text-sm text-left">Configure and placeholder</p>
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="lead-form" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-serif text-primary-dark mb-2">Manual Lead Entry Form</h2>
                <p className="text-primary-medium">Submit new seller leads through this structured form</p>
              </div>
              <Form {...form}>
              <form onSubmit={form.handleSubmit(
                onSubmit,
                () => setHasSubmitAttempt(true) // 🔥 Set error flag if validation fails
              )} className="space-y-8">
                  {/* Agent Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-serif text-primary-dark">Agent Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="space-y-2">
                    <Label htmlFor="agentName">Select an Agent</Label>
                    
                    <Select.Root
                      value={form.watch("agentRecordId") || ""}
                      onValueChange={(value) => {
                        const selectedAgent = agents.find((agent) => agent.id === value);
                        if (selectedAgent) {
                          form.setValue("agentRecordId", selectedAgent.id || "");
                          form.setValue("agentName", selectedAgent.name || "");
                          form.clearErrors("agentName");
                        }
                      }}
                    >
                      <Select.Trigger className="w-full border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center text-gray-700 focus:ring-2 focus:ring-blue-500">
                        <Select.Value placeholder="Select an agent" />
                        <Select.Icon>
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </Select.Icon>
                      </Select.Trigger>
                      <Select.Portal>
                        <Select.Content className="bg-white border border-gray-300 rounded-lg shadow-md">
                          <Select.ScrollUpButton className="flex justify-center items-center py-2">
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          </Select.ScrollUpButton>
                          <Select.Viewport className="p-2">
                            {agents
                              .sort((a, b) => a.name.localeCompare(b.name)) // 🔥 Sort alphabetically
                              .map((agent) => (
                              <Select.Item
                                key={agent.id}
                                value={agent.id}
                                className="cursor-pointer px-4 py-2 rounded-md hover:bg-blue-100 flex items-center"
                              >
                                <Select.ItemText>{agent.name}</Select.ItemText>
                                <Select.ItemIndicator>
                                  <Check className="w-4 h-4 text-blue-500 ml-2" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>

                      {/* 🔥 Add Validation Message Here */}
                      {form.formState.errors.agentName && (
                        <p className="text-sm text-red-500">{form.formState.errors.agentName.message}</p>
                      )}

                    </div>

                      <div className="space-y-2">
                        <Label htmlFor="reportDate">Report Date *</Label>
                        <Input
                          {...form.register('reportDate')}
                          type="date"
                        />
                        {form.formState.errors.reportDate && (
                          <p className="text-sm text-red-500">{form.formState.errors.reportDate.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-serif text-primary-dark">Client Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientFirstName">First Name *</Label>
                        <Input
                          {...form.register('clientFirstName')}
                          placeholder="Enter first name"
                        />
                        {form.formState.errors.clientFirstName && (
                          <p className="text-sm text-red-500">{form.formState.errors.clientFirstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientLastName">Last Name *</Label>
                        <Input
                          {...form.register('clientLastName')}
                          placeholder="Enter last name"
                        />
                        {form.formState.errors.clientLastName && (
                          <p className="text-sm text-red-500">{form.formState.errors.clientLastName.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientEmail">Email</Label>
                        <Input
                          {...form.register('clientEmail')}
                          placeholder="Enter email or NA"
                          type="email"
                        />
                        {form.formState.errors.clientEmail && (
                          <p className="text-sm text-red-500">{form.formState.errors.clientEmail.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientPhone">Phone</Label>
                        <Input
                          {...form.register('clientPhone')}
                          placeholder="Enter phone or NA"
                        />
                        {form.formState.errors.clientPhone && (
                          <p className="text-sm text-red-500">{form.formState.errors.clientPhone.message}</p>
                        )}
                      </div>

                    <div className="space-y-2">
                      <Label htmlFor="relatedContact">Related Contact</Label>
                      <Input
                        {...form.register('relatedContact')}
                        placeholder="Enter any related contacts (optional)"
                      />
                    </div>
                    <div className="space-y-2">

                      <Label htmlFor="relationshipType">Type of relationship</Label>
                      <Input
                        {...form.register('relationshipType')}
                        placeholder="Indicate the type of relationship (spouce, friend, other.)"
                      />   
                    </div>               
                  </div>



                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Additional Information</Label>
                      <Textarea
                        {...form.register('additionalInfo')}
                        placeholder="Enter any additional information about the lead"
                      />
                    </div>

                  </div>
                  {/* Property Information */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-serif text-primary-dark">Property Information</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Lead is looking to: *</Label>
                        <RadioGroup
                          value={form.watch("leadType")} // ✅ Sync with form
                          onValueChange={(value) => form.setValue("leadType", value as 'sell' | 'rent' | 'sell or rent')}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sell" id="sell" />
                            <Label htmlFor="sell">Sell</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rent" id="rent" />
                            <Label htmlFor="rent">Rent</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="sell or rent" id="sell or rent" />
                            <Label htmlFor="sell or rent">Sell or rent</Label>
                          </div>
                        </RadioGroup>

                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="propertyAddress">Property Address *</Label>
                        <Input
                          {...form.register('propertyAddress')}
                          placeholder="Enter exact property address"
                        />
                        {form.formState.errors.propertyAddress && (
                          <p className="text-sm text-red-500">{form.formState.errors.propertyAddress.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="community">Community</Label>
                        <Input
                          {...form.register('community')}
                          placeholder="Enter community name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="propertyDetails">Property Details</Label>
                        <Textarea
                          {...form.register('propertyDetails')}
                          placeholder="Enter important property characteristics"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Status */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-serif text-primary-dark">Contact Status</h2>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Status *</Label>
                        <RadioGroup
                          key={form.watch("contactStatus")} // ✅ Forces re-render on reset
                          value={form.watch("contactStatus")}
                          onValueChange={(value) => form.setValue("contactStatus", value as 'Pending' | 'Contacted')}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Pending" id="pending" />
                            <Label htmlFor="pending">Pending Contact</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Contacted" id="contacted" />
                            <Label htmlFor="contacted">Contacted</Label>
                          </div>
                        </RadioGroup>

                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="agentNotes">Agent Notes</Label>
                        <Textarea
                          {...form.register('agentNotes')}
                          placeholder="Enter any additional notes"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end items-center gap-4">
                    {/* 🔥 Show error message when required fields are missing */}
                    {hasSubmitAttempt && !form.formState.isValid && (
                      <p className="text-red-500 text-sm font-medium">
                        ⚠️ Please fill in all required fields.
                      </p>
                    )}                  
                    <Button 
                      type="submit"
                      className="w-full md:w-auto bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Lead'}
                    </Button>
                  </div>

                </form>
              </Form>
            </div>
          </TabsContent>


          <TabsContent value="placeholder" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-serif text-primary-dark mb-2">Lead Alerts Configuration</h2>
                <p className="text-primary-medium">Set up your lead notification preferences</p>
              </div>
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-4 text-primary-dark">Notification Settings</h3>
                  <p className="text-sm text-gray-600 mb-4">This feature is coming soon. You will be able to:</p>
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

      {/* Success modal*/}
      <Dialog.Root open={showSuccessModal} onOpenChange={setShowSuccessModal}>
      <Dialog.Portal>
          {/* 🔥 Ensure Overlay Covers Everything */}
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
              <p className="text-gray-700 mt-2">Your lead was successfully registered.</p>
              <Dialog.Close asChild>
                <button className="mt-4 w-full bg-accent-gold hover:bg-accent-gold-light text-primary-dark font-semibold py-2 rounded">
                  OK
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Error modal*/}
      <Dialog.Root open={showErrorModal} onOpenChange={setShowErrorModal}>
        <Dialog.Portal>
          {/* 🔥 Ensure Overlay Covers Everything */}
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
  )
}