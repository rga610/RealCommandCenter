'use client'

import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  Users, ClipboardList, UserPlus, Search,
  Eye, LineChart, FileCheck, FileText,
  DollarSign, MessageSquare, ArrowLeft
} from 'lucide-react'

export default function SellProperties() {
  const breadcrumbItems = [
    { label: 'Sell Properties', href: '/sell-properties' }
  ]

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <nav className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-serif text-primary-dark">Sell a Property</h1>
          <p className="text-primary-medium mt-2">Guide buyers through their property purchase journey</p>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Generate Buyer Inquiries */}
        <a href="/sell-properties/generate-inquiries" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Users className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Generate Buyer Inquiries</h2>
          <p className="text-primary-medium">Manage and track buyer leads</p>
        </a>

        {/* Capture Buyer Inquiries */}
        <a href="/sell-properties/capture-inquiries" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <ClipboardList className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Capture Buyer Inquiries</h2>
          <p className="text-primary-medium">Qualify and process buyer leads</p>
        </a>

        {/* Onboard Buyer */}
        <a href="/sell-properties/onboard-buyer" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <UserPlus className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Onboard Buyer</h2>
          <p className="text-primary-medium">Guide buyers through onboarding</p>
        </a>

        {/* Conduct Property Search */}
        <a href="/sell-properties/property-search" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Search className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Property Search</h2>
          <p className="text-primary-medium">Search and shortlist properties</p>
        </a>

        {/* Conduct Property Viewings */}
        <a href="/sell-properties/viewings" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Eye className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Property Viewings</h2>
          <p className="text-primary-medium">Schedule and manage property viewings</p>
        </a>

        {/* Evaluate Viewings */}
        <a href="/sell-properties/evaluate-viewings" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <LineChart className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Evaluate Viewings</h2>
          <p className="text-primary-medium">Review and analyze property viewings</p>
        </a>

        {/* Manage Offer Submissions */}
        <a href="/sell-properties/offers" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <FileCheck className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Manage Offers</h2>
          <p className="text-primary-medium">Handle and track property offers</p>
        </a>

        {/* Coordinate Transaction Documentation */}
        <a href="/sell-properties/transaction" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <FileText className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Transaction Docs</h2>
          <p className="text-primary-medium">Manage transaction documentation</p>
        </a>

        {/* Close Deal */}
        <a href="/sell-properties/close-deal" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <DollarSign className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Close Deal</h2>
          <p className="text-primary-medium">Finalize the sale and manage comissions</p>
        </a>

        {/* Post-Sale Follow-Up */}
        <a href="/sell-properties/follow-up" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <MessageSquare className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Post-Sale Follow-Up</h2>
          <p className="text-primary-medium">Maintain client relationships</p>
        </a>
      </div>
    </main>
  )
}