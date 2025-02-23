'use client'

import { useParams } from 'next/navigation'
import { Breadcrumb } from '@/components/ui/breadcrumb'

const moduleNames: { [key: string]: string } = {
  'generate-inquiries': 'Generate Buyer Inquiries',
  'capture-inquiries': 'Capture Buyer Inquiries',
  'onboard-buyer': 'Onboard Buyer',
  'property-search': 'Property Search',
  'viewings': 'Property Viewings',
  'evaluate-viewings': 'Evaluate Viewings',
  'offers': 'Manage Offers',
  'transaction': 'Transaction Documentation',
  'close-deal': 'Close Deal',
  'follow-up': 'Post-Sale Follow-Up'
}

export default function SellPropertyModule() {
  const params = useParams()
  const moduleName = moduleNames[params.module as string] || 'Module'

  const breadcrumbItems = [
    { label: 'Sell a Property', href: '/sell-properties' },
    { label: moduleName, href: `/sell-properties/${params.module}` }
  ]

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <nav className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-serif text-primary-dark">{moduleName}</h1>
          <p className="text-primary-medium mt-2">This module is under development</p>
        </div>
      </nav>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <p className="text-primary-medium">
          The features for this module are currently being implemented. Check back soon for updates.
        </p>
      </div>
    </main>
  )
}