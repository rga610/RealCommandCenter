'use client'

import { ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import { Breadcrumb } from '@/components/default/breadcrumb'

const moduleNames: { [key: string]: string } = {
  'generate-inquiries': 'Generate Seller Inquiries',
  'capture-inquiries': 'Capture Seller Inquiries',
  'onboard-seller': 'Onboard Seller',
  'collect-data': 'Collect Property Data',
  'evaluate': 'Evaluate Property',
  'visual-assets': 'Create Visual Assets',
  'develop-content': 'Develop Listing Content',
  'activate': 'Activate Listing',
  'monitor': 'Monitor Performance',
  'optimize': 'Optimize Listing'
}

export default function ListPropertyModule() {
  const params = useParams()
  const moduleName = moduleNames[params.module as string] || 'Module'

  const breadcrumbItems = [
    { label: 'List a Property', href: '/list-properties' },
    { label: moduleName, href: `/list-properties/${params.module}` }
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