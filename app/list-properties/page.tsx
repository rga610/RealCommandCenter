'use client'

import { Breadcrumb } from '@/components/ui/breadcrumb'
import { 
  ClipboardList, Users, UserPlus, Database, Calculator,
  Camera, FileText, Globe, LineChart, Settings,
  ArrowLeft
} from 'lucide-react'

export default function ListProperties() {
  const breadcrumbItems = [
    { label: 'List Properties', href: '/list-properties' }
  ]

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <nav className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-serif text-primary-dark">List a Property</h1>
          <p className="text-primary-medium mt-2">Manage your property listings from start to finish</p>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Generate Seller Inquiries */}
        <a href="/list-properties/generate-inquiries" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Users className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Generate Seller Inquiries</h2>
          <p className="text-primary-medium">Access marketing assets and see new leads</p>
        </a>

        {/* Capture Seller Inquiries */}
        <a href="/list-properties/capture-inquiries" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <ClipboardList className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Capture Seller Inquiries</h2>
          <p className="text-primary-medium">Report and manage new seller leads</p>
        </a>

        {/* Onboard Seller */}
        <a href="/list-properties/onboard-seller" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <UserPlus className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Onboard Seller</h2>
          <p className="text-primary-medium">Guide sellers through the onboarding process</p>
        </a>

        {/* Collect Listing Data */}
        <a href="/list-properties/collect-data" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Database className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Collect Listing Data</h2>
          <p className="text-primary-medium">Gather and manage property information</p>
        </a>

        {/* Evaluate Property */}
        <a href="/list-properties/evaluate" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Calculator className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Evaluate Property</h2>
          <p className="text-primary-medium">Conduct property evaluation and CMA</p>
        </a>

        {/* Create Visual Assets */}
        <a href="/list-properties/visual-assets" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Camera className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Create Visual Assets</h2>
          <p className="text-primary-medium">Manage property photography and media</p>
        </a>

        {/* Develop Listing Content */}
        <a href="/list-properties/develop-content" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <FileText className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Develop Listing Content</h2>
          <p className="text-primary-medium">Create and manage listing descriptions</p>
        </a>

        {/* Activate Listing */}
        <a href="/list-properties/activate" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Globe className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Activate Listing</h2>
          <p className="text-primary-medium">Publish and manage active listings</p>
        </a>

        {/* Monitor Listing Performance */}
        <a href="/list-properties/monitor" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <LineChart className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Monitor Performance</h2>
          <p className="text-primary-medium">Track listing metrics and performance</p>
        </a>

        {/* Optimize Listing */}
        <a href="/list-properties/optimize" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Settings className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Optimize Listing</h2>
          <p className="text-primary-medium">Update and optimize listing performance</p>
        </a>
      </div>
    </main>
  )
}