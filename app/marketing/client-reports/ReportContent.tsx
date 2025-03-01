import React from 'react'
import ReportLayout from '@/components/modules/marketing/tools/socialmedia-report/ReportLayout'
import CoverPage from '@/components/modules/marketing/tools/socialmedia-report/CoverPage'
import ImageWrapper from '@/components/modules/marketing/tools/socialmedia-report/ImageWrapper'
import MetricsCard from '@/components/modules/marketing/tools/socialmedia-report/MetricsCard'
import EmailMarketing from '@/components/modules/marketing/tools/socialmedia-report/EmailMarketing'
import ContentSection from '@/components/modules/marketing/tools/socialmedia-report/ContentSection'
import FancyDivider from '@/components/modules/marketing/tools/socialmedia-report/FancyDivider'

import { BRANDING } from '@/public/images/branding/branding'
import { LISTINGS } from '@/public/images/listings/listings'
import {
  Users,
  Activity,
  Eye,
  MousePointerClick,
  ThumbsUp,
  Bookmark,
  Share,
  Mail,
  BarChart,
} from 'lucide-react'

export interface Property {
  title: string
  socialReach: string
  socialInteractions: string
  emailSent: string
  emailOpenRate: string
  uniqueClicks: string
  paidReach: string
  paidImpressions: string
  paidLeads: string
  marketingNotes: string
}

interface ReportContentProps {
  property: Property
  pdfMode?: boolean
}

const ReportContent = ({ property, pdfMode = false }: ReportContentProps) => {
  return (
    <ReportLayout>
      {/* Cover Page */}
      <CoverPage
        property={property}
        coverImage={LISTINGS['20639'].imageA}
        pdfMode={pdfMode}
      />

      {/* Divider between Cover and Metrics */}
      <FancyDivider pdfMode={pdfMode} />
      {pdfMode && <div className="page-break"></div>}

      {/* Main Content Container */}
      <div className="mx-auto max-w-max p-20 bg-background rounded-lg">
        {/* Metrics Section */}
        <MetricsCard
          title="Post 1"
          metrics={[
            { icon: <Users />, label: 'Accounts Reached', value: property.socialReach },
            { icon: <Activity />, label: 'Accounts Engaged', value: property.socialInteractions },
            { icon: <Eye />, label: 'Total Impressions', value: '618' },
            { icon: <MousePointerClick />, label: 'Profile Visits', value: '7' },
            { icon: <ThumbsUp />, label: 'Likes', value: '29' },
            { icon: <Bookmark />, label: 'Saves', value: '6' },
            { icon: <Share />, label: 'Shares', value: '1' },
          ]}
          pdfMode={pdfMode}
        />

        <FancyDivider pdfMode={pdfMode} />
        {pdfMode && <div className="page-break"></div>}

        {/* Email Marketing Section */}
        <EmailMarketing
          title="Exclusive Properties Newsletter"
          stats={[
            { icon: <Mail />, label: 'Total Emails Sent', value: property.emailSent },
            { icon: <BarChart />, label: 'Open Rate (%)', value: property.emailOpenRate },
            { icon: <MousePointerClick />, label: 'Unique Clicks', value: property.uniqueClicks },
          ]}
          highlight="📌 Third most clicked property in the newsletter"
          insights={[
            'Strong Interest: The property received a good amount of clicks, proving organic demand.',
            'Room for Growth: With paid media, we can amplify reach beyond newsletter subscribers.',
            'Audience Targeting Works: The email engaged an exclusive, interested audience.',
          ]}
          pdfMode={pdfMode}
        />

        <FancyDivider pdfMode={pdfMode} />
        {pdfMode && <div className="page-break"></div>}

        {/* Content Group: Organic Reach, Paid Media, and Next Steps */}
        <div className="space-y-10">
          <ContentSection
            title="Proven Organic Reach"
            subtitle="Our organic social media presence is consistently delivering high reach and engagement. Here’s how our overall Instagram posts performed in 2024:"
            highlights={[
              { text: 'Total Audience Reached: 348,103 people', isBold: true },
              { text: 'Average Reach Per Post: 469 people', isBold: true },
              { text: 'Total Engagements: 21,696 interactions' },
              { text: 'Average Engagement Per Post: 29 interactions' },
              { text: 'Overall Engagement Rate: 6.23%' },
            ]}
            pdfMode={pdfMode}
          />

          <ContentSection
            title="Proven Paid Media Reach"
            subtitle="Our Meta Business paid campaigns have delivered excellent results, reaching high-net-worth potential buyers beyond our existing audience."
            highlights={[
              { text: 'Total Paid Campaigns: 31 active campaigns', isBold: true },
              { text: 'Total Audience Reached: 18,059 people', isBold: true },
              { text: 'Total Impressions: 31,428 views' },
              { text: 'Total Clicks: 766 clicks on property listings' },
              { text: 'Total Potential Clients (Leads): 95 interested buyers' },
            ]}
            pdfMode={pdfMode}
          />

          <ContentSection
            title="Next Steps"
            listItems={[
              'Create a marketing strategy for your property.',
              'Boost a paid campaign to reach high-net-worth buyers.',
              'Use a carousel or video ad to showcase your property’s best features.',
              'Add a clear Call-To-Action (CTA) for serious buyers.',
            ]}
            pdfMode={pdfMode}
          />
        </div>

        {pdfMode && <div className="page-break"></div>}

        {/* Footer Banner */}
        <div className="mt-8">
          <ImageWrapper
            src={BRANDING.banners.tallBanner}
            alt="Footer Banner"
            width={1200}
            height={300}
            pdfMode={pdfMode}
            className="mx-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </ReportLayout>
  )
}

export default ReportContent
