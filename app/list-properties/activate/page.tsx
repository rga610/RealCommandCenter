'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Breadcrumb } from '@/components/default/breadcrumb'
import { Card } from '@/components/default/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/default/tabs'
import { Form } from '@/components/default/form'
import { Input } from '@/components/default/input'
import { Button } from '@/components/default/button'
import { Textarea } from '@/components/default/textarea'
import { Label } from '@/components/default/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/default/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/default/dialog"
import { toast } from 'sonner'
import { 
  Globe,
  FileText,
  History,
  Send,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
  Share2,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

const activationSchema = z.object({
  propertyName: z.string().min(1, 'Property name is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  listingPrice: z.string().min(1, 'Listing price is required'),
  description: z.string().min(1, 'Description is required'),
  mainImage: z.string().min(1, 'Main image is required'),
  galleryImages: z.array(z.string()).min(1, 'At least one gallery image is required'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  status: z.enum(['draft', 'ready', 'published', 'archived']),
  marketingNotes: z.string().optional(),
  seoKeywords: z.string().optional(),
  publishDate: z.string().optional()
})

type ListingActivation = z.infer<typeof activationSchema>

type PublishedPortal = {
  name: string
  url: string
  publishDate: string
  status: 'active' | 'pending' | 'inactive'
}

type PublicationHistory = {
  id: string
  propertyName: string
  publishedUrl: string
  publishDate: string
  status: 'active' | 'inactive'
  views: number
  inquiries: number
  lastUpdated: string
  portals: PublishedPortal[]
}

export default function ActivateListing() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const [expandedListings, setExpandedListings] = useState<string[]>([])
  
  const breadcrumbItems = [
    { label: 'List a Property', href: '/list-properties' },
    { label: 'Activate Listing', href: '/list-properties/activate' }
  ]

  const [publicationHistory] = useState<PublicationHistory[]>([
    {
      id: '1',
      propertyName: 'Villa Paradise',
      publishedUrl: 'https://costaricaluxury.com/villa-paradise',
      publishDate: '2023-10-15',
      status: 'active',
      views: 245,
      inquiries: 12,
      lastUpdated: '2023-10-18',
      portals: [
        {
          name: 'Costa Rica Luxury',
          url: 'https://costaricaluxury.com/villa-paradise',
          publishDate: '2023-10-15',
          status: 'active'
        },
        {
          name: 'Forbes Global Properties',
          url: 'https://forbesglobalproperties.com/villa-paradise',
          publishDate: '2023-10-16',
          status: 'active'
        },
        {
          name: 'Luxury Portfolio International',
          url: 'https://luxuryportfolio.com/villa-paradise',
          publishDate: '2023-10-17',
          status: 'active'
        },
        {
          name: 'Mansion Global',
          url: 'https://mansionglobal.com/villa-paradise',
          publishDate: '2023-10-18',
          status: 'pending'
        }
      ]
    },
    {
      id: '2',
      propertyName: 'Ocean View Estate',
      publishedUrl: 'https://costaricaluxury.com/ocean-view-estate',
      publishDate: '2023-10-10',
      status: 'inactive',
      views: 189,
      inquiries: 8,
      lastUpdated: '2023-10-15',
      portals: [
        {
          name: 'Costa Rica Luxury',
          url: 'https://costaricaluxury.com/ocean-view-estate',
          publishDate: '2023-10-10',
          status: 'inactive'
        },
        {
          name: 'Forbes Global Properties',
          url: 'https://forbesglobalproperties.com/ocean-view-estate',
          publishDate: '2023-10-11',
          status: 'inactive'
        }
      ]
    }
  ])

  const form = useForm<ListingActivation>({
    resolver: zodResolver(activationSchema),
    defaultValues: {
      status: 'draft',
      features: []
    }
  })

  async function onSubmit(values: ListingActivation) {
    try {
      setIsSubmitting(true)
      // TODO: Integrate with Airtable
      console.log(values)
      toast.success('Listing activation request submitted successfully')
      form.reset()
    } catch (error) {
      toast.error('Error submitting activation request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }

  const handleShareListing = (id: string) => {
    // TODO: Implement sharing functionality
    toast.success('Sharing options opened')
  }

  const handleExportLinks = (listing: PublicationHistory) => {
    const content = `
Property: ${listing.propertyName}
Published: ${listing.publishDate}
Last Updated: ${listing.lastUpdated}

Publication Links:
${listing.portals.map(portal => `
${portal.name}
URL: ${portal.url}
Status: ${portal.status.charAt(0).toUpperCase() + portal.status.slice(1)}
Published: ${portal.publishDate}
`).join('\n')}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${listing.propertyName.toLowerCase().replace(/\s+/g, '-')}-links.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Links exported successfully')
  }

  const toggleListingExpansion = (listingId: string) => {
    setExpandedListings(prev => 
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    )
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Activate Listing</h1>
        <p className="text-primary-medium mt-2">Submit and manage listing activation requests</p>
      </div>

      <Tabs defaultValue="activation-form" className="space-y-8">
        <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full p-2">
            <TabsTrigger 
              value="activation-form" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span className="font-medium">Listing Activation</span>
              </div>
              <p className="text-sm text-left">Submit new listing activation requests</p>
            </TabsTrigger>
            
            <TabsTrigger 
              value="publication-history" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <History className="h-5 w-5" />
                <span className="font-medium">Publication History</span>
              </div>
              <p className="text-sm text-left">Track published listings and performance</p>
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="activation-form" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">Listing Activation Request</h2>
              <p className="text-primary-medium">Submit a new listing for publication</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="propertyName">Property Name *</Label>
                      <Input
                        {...form.register('propertyName')}
                        placeholder="Enter property name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Input
                        {...form.register('propertyType')}
                        placeholder="e.g., Villa, House, Apartment"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="propertyAddress">Property Address *</Label>
                      <Input
                        {...form.register('propertyAddress')}
                        placeholder="Enter complete address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="listingPrice">Listing Price *</Label>
                      <Input
                        {...form.register('listingPrice')}
                        placeholder="Enter listing price"
                        type="number"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Content Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Content Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Property Description *</Label>
                      <Textarea
                        {...form.register('description')}
                        placeholder="Enter the approved property description"
                        className="min-h-[200px]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seoKeywords">SEO Keywords</Label>
                      <Input
                        {...form.register('seoKeywords')}
                        placeholder="Enter SEO keywords separated by commas"
                      />
                    </div>
                  </div>
                </div>

                {/* Marketing Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Marketing Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="marketingNotes">Marketing Notes</Label>
                      <Textarea
                        {...form.register('marketingNotes')}
                        placeholder="Add any special marketing instructions or notes"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publishDate">Preferred Publish Date</Label>
                      <Input
                        {...form.register('publishDate')}
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="submit"
                    className="bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : 'Submit for Publication'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="publication-history" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">Publication History</h2>
              <p className="text-primary-medium">Track and manage published listings</p>
            </div>

            <div className="space-y-4">
              {publicationHistory.map((listing) => (
                <Card key={listing.id} className="p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleListingExpansion(listing.id)}
                  >
                    <div>
                      <h3 className="font-medium text-lg mb-1">{listing.propertyName}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Published:</span>{' '}
                          {listing.publishDate}
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span>{' '}
                          {listing.lastUpdated}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        listing.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExportLinks(listing)
                          }}
                          className="flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Export Links
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShareListing(listing.id)
                          }}
                          className="flex items-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </Button>
                        {expandedListings.includes(listing.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {expandedListings.includes(listing.id) && (
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-3">Published Portals</h4>
                      <div className="space-y-3">
                        {listing.portals.map((portal, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-1.5 rounded-full ${
                                portal.status === 'active'
                                  ? 'bg-green-100'
                                  : portal.status === 'pending'
                                  ? 'bg-yellow-100'
                                  : 'bg-gray-100'
                              }`}>
                                {portal.status === 'active' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : portal.status === 'pending' ? (
                                  <Clock className="h-4 w-4 text-yellow-600" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-gray-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{portal.name}</p>
                                <p className="text-sm text-gray-600">Published: {portal.publishDate}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyUrl(portal.url)}
                                className="flex items-center gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                Copy URL
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(portal.url, '_blank')}
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}