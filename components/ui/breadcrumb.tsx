'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/"
            className="text-primary-medium hover:text-primary-dark transition-colors flex items-center hover:bg-gray-100 p-2 rounded-xl"
          >
            <Home size={20} />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight size={18} className="text-gray-400 mx-1" />
            {index === items.length - 1 ? (
              <span className="text-primary-dark font-medium p-1 border-b-2 rounded-b-md border-accent-gold-light">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-primary-medium hover:text-primary-dark transition-colors  hover:bg-gray-100 p-2 rounded-xl"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}