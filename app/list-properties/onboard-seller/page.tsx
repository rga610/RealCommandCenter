'use client'

import { useState } from 'react'
import { Breadcrumb } from '@/components/default/breadcrumb'
import { Card } from '@/components/default/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/default/tabs'
import { Button } from '@/components/default/button'
import { 
  ClipboardCheck, 
  Calendar, 
  Building2, 
  Download,
  FileText,
  ArrowRight,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

export default function OnboardSeller() {
  const [selectedDate, setSelectedDate] = useState<string>('')
  
  const breadcrumbItems = [
    { label: 'List a Property', href: '/list-properties' },
    { label: 'Onboard Seller', href: '/list-properties/onboard-seller' }
  ]

  const handleScheduleVisit = () => {
    // TODO: Integrate with Google Calendar
    toast.success('Site visit scheduled successfully')
  }

  const handleSendPacket = () => {
    toast.success('Information packet sent successfully')
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Onboard Seller</h1>
        <p className="text-primary-medium mt-2">Guide sellers through the onboarding process</p>
      </div>

      <div className="relative">
        <Tabs defaultValue="introduction" className="space-y-8">
          <div className="sticky top-0 z-10">
            <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2">
                <TabsTrigger 
                  value="introduction" 
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    <span className="font-medium">Get To Know Us</span>
                  </div>
                  <p className="text-sm text-left">Share LLCR information with clients</p>
                </TabsTrigger>

                <TabsTrigger 
                  value="checklist" 
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    <span className="font-medium">Onboarding Checklist</span>
                  </div>
                  <p className="text-sm text-left">Track required documents and agreements</p>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="scheduling" 
                  className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="font-medium">Schedule Site Visit</span>
                  </div>
                  <p className="text-sm text-left">Set up the initial property visit</p>
                </TabsTrigger>
              </div>
            </TabsList>
          </div>

          <TabsContent value="introduction" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-serif text-primary-dark mb-2">Get To Know LLCR</h2>
                <p className="text-primary-medium">Share our company information with new clients</p>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="p-6">
                    <h3 className="text-lg font-medium text-primary-dark mb-4">Company Overview</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-primary-dark">Mission Statement</h4>
                        <p className="text-sm text-gray-600">Delivering exceptional luxury real estate experiences in Costa Rica through expertise, integrity, and personalized service.</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-primary-dark">Forbes Global Properties</h4>
                        <p className="text-sm text-gray-600">Exclusive member of Forbes Global Properties network, connecting luxury properties with discerning buyers worldwide.</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-primary-dark">Market Leadership</h4>
                        <p className="text-sm text-gray-600">Leading luxury real estate firm in Costa Rica with extensive market knowledge and proven results.</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-lg font-medium text-primary-dark mb-4">Welcome Package</h3>
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">Send our comprehensive information packet to new clients:</p>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Company Profile & History
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Services & Expertise
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Client Testimonials
                        </li>
                        <li className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          Market Insights
                        </li>
                        </ul>
                        <div className="flex justify-center">
                        <Button 
                          onClick={handleSendPacket}
                          className="w-auto mt-4 flex items-center justify-center gap-2 bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                        >
                          <Mail className="h-4 w-4" />
                          Send Welcome Package
                        </Button>
                        </div>
                      </div>
                    </Card>
                </div>

                <Card className="p-6">
                  <h3 className="text-lg font-medium text-primary-dark mb-4">Additional Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <span>Service Brochure</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      <span>Success Stories</span>
                    </Button>
                    <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                      <ArrowRight className="h-5 w-5" />
                      <span>Next Steps Guide</span>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="checklist" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-serif text-primary-dark mb-2">Required Documents</h2>
                <p className="text-primary-medium">Track and manage required documentation for new sellers</p>
              </div>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary-dark">Essential Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4 border-l-4 border-yellow-500">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium mb-1">Government ID</h4>
                          <p className="text-sm text-gray-600">Valid identification document</p>
                        </div>
                        <AlertCircle className="text-yellow-500" />
                      </div>
                    </Card>

                    <Card className="p-4 border-l-4 border-green-500">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium mb-1">Property Registration</h4>
                          <p className="text-sm text-gray-600">Official property documents</p>
                        </div>
                        <CheckCircle2 className="text-green-500" />
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-primary-dark">Document Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <FileText className="h-8 w-8 text-primary-dark mb-3" />
                      <h4 className="font-medium mb-2">Listing Agreement</h4>
                      <p className="text-sm text-gray-600 mb-4">Standard listing contract template</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email to Client
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <FileText className="h-8 w-8 text-primary-dark mb-3" />
                      <h4 className="font-medium mb-2">NDA Template</h4>
                      <p className="text-sm text-gray-600 mb-4">Confidentiality agreement</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email to Client
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <FileText className="h-8 w-8 text-primary-dark mb-3" />
                      <h4 className="font-medium mb-2">Property Disclosure</h4>
                      <p className="text-sm text-gray-600 mb-4">Property condition disclosure form</p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" className="w-full flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email to Client
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scheduling" className="bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-serif text-primary-dark mb-2">Schedule Initial Site Visit</h2>
                <p className="text-primary-medium">Set up the first property visit with Google Calendar integration</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-medium text-primary-dark mb-4">Quick Schedule</h3>
                  <p className="text-sm text-gray-600 mb-6">Select a date and time for the site visit</p>
                  
                  <div className="space-y-4">
                    <input
                      type="datetime-local"
                      className="w-full p-2 border rounded-lg"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    <Button 
                      onClick={handleScheduleVisit}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Schedule Visit
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-medium text-primary-dark mb-4">Visit Guidelines</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-light text-white flex items-center justify-center flex-shrink-0">1</div>
                      <p className="text-sm text-gray-600">Schedule at least 48 hours in advance</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-light text-white flex items-center justify-center flex-shrink-0">2</div>
                      <p className="text-sm text-gray-600">Prepare property documentation beforehand</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-light text-white flex items-center justify-center flex-shrink-0">3</div>
                      <p className="text-sm text-gray-600">Allow 1-2 hours for thorough assessment</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}