// app/marketing/page.tsx

'use client'

import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  Users, Presentation, ClipboardList, UserPlus, Search,
  Eye, LineChart, FileCheck, FileText,
  DollarSign, MessageSquare, ArrowLeft
} from 'lucide-react'

export default function Marketing() {
  const breadcrumbItems = [
    { label: 'Marketing', href: '/marketing' }
  ]

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbItems} />
      
      <nav className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-serif text-primary-dark">Marketing</h1>
          <p className="text-primary-medium mt-2">Market our brand and specific listings</p>
        </div>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Client Reports */}
        <a href="/marketing/client-reports" className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <Presentation className="w-8 h-8 text-primary-dark mb-4 group-hover:text-primary-light transition-colors" />
          <h2 className="text-xl font-serif mb-2 text-primary-dark group-hover:text-primary-light">Client Reports</h2>
          <p className="text-primary-medium">Generate digital marketing client reports</p>
        </a>


      </div>
    </main>
  )
}