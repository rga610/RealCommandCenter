import React from 'react'
import ImageWrapper from './ImageWrapper'
import { BRANDING } from '@/public/images/branding/branding'

export interface CoverPageProps {
  property: {
    title: string
  }
  coverImage: string
  pdfMode?: boolean
}

const CoverPage = ({ property, coverImage, pdfMode = false }: CoverPageProps) => {
  return (
    <>
      {/* Top Section with Background */}
      <div className="bg-primary-dark text-white text-center rounded-t-lg">
        {/* Container */}
        <div className="mx-auto max-w-3xl px-4 py-52">
          {/* Logo */}
          <div className="flex justify-center mb-12">
            <ImageWrapper
              src={BRANDING.logos.horizontalWhiteGold}
              alt="Luxury Living Costa Rica Logo Lockup"
              width={350}
              height={100}
              pdfMode={pdfMode}
            />
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-display-lg font-serif font-bold text-accent-gold mb-2">
            {property.title}
          </h1>
          <p className="text-display-md text-gray-300">
            Social Media Performance Analysis
          </p>
        </div>
      </div>

      {/* Listing Image */}
      <div className={`relative w-full ${pdfMode ? 'h-auto' : 'h-[600px]'}`}>
        <ImageWrapper
          src={coverImage}
          alt="Luxury Condo Image"
          width={1200}
          height={600}
          pdfMode={pdfMode}
          className="object-cover w-full rounded-b-lg"
        />
      </div>
    </>
  )
}

export default CoverPage
