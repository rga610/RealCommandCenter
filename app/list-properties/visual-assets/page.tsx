'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from 'sonner'
import { 
  Camera,
  FileImage,
  Video,
  Calendar,
  Clock,
  FolderOpen,
  Download,
  ExternalLink,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Plus
} from 'lucide-react'

const photoRequestSchema = z.object({
  propertyName: z.string().min(1, 'Property name is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  requestType: z.enum(['photo', 'video', 'both'], {
    required_error: 'Request type is required',
  }),
  contactName: z.string().min(1, 'Contact name is required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  contactEmail: z.string().email('Invalid email format').optional(),
  contactRole: z.string().min(1, 'Contact role is required'),
  contactNotes: z.string().optional(),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  preferredTime: z.string().min(1, 'Preferred time is required'),
  alternateDate: z.string().optional(),
  alternateTime: z.string().optional(),
  specialInstructions: z.string().optional(),
  requiredShots: z.array(z.string()).min(1, 'At least one shot type is required'),
  agentNotes: z.string().optional(),
})

type PhotoRequest = z.infer<typeof photoRequestSchema>

type Asset = {
  id: string
  type: 'photo' | 'video'
  url: string
  thumbnail: string
  title: string
  propertyName: string
  uploadedAt: string
  size: string
  dimensions?: string
  status: 'processing' | 'ready' | 'error'
}

type RequestHistory = {
  id: string
  propertyName: string
  propertyAddress: string
  requestType: 'photo' | 'video' | 'both'
  requestDate: string
  realizedDate: string | null
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export default function VisualAssets() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  
  const breadcrumbItems = [
    { label: 'List Properties', href: '/list-properties' },
    { label: 'Create Visual Assets', href: '/list-properties/visual-assets' }
  ]

  const [assets] = useState<Asset[]>([
    {
      id: '1',
      type: 'photo',
      url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      title: 'Front Exterior',
      propertyName: 'Villa Paradise',
      uploadedAt: '2023-10-15',
      size: '2.4 MB',
      dimensions: '3840 x 2160',
      status: 'ready'
    },
    {
      id: '2',
      type: 'video',
      url: 'https://example.com/video.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80',
      title: 'Property Tour',
      propertyName: 'Villa Paradise',
      uploadedAt: '2023-10-15',
      size: '24.8 MB',
      status: 'processing'
    }
  ])

  const [requestHistory] = useState<RequestHistory[]>([
    {
      id: '1',
      propertyName: 'Villa Paradise',
      propertyAddress: '123 Ocean View Dr',
      requestType: 'both',
      requestDate: '2023-10-15',
      realizedDate: '2023-10-18',
      status: 'completed',
      notes: 'All shots completed as requested'
    },
    {
      id: '2',
      propertyName: 'Sunset Villa',
      propertyAddress: '456 Mountain View Rd',
      requestType: 'photo',
      requestDate: '2023-10-16',
      realizedDate: null,
      status: 'scheduled',
      notes: 'Scheduled for next week'
    },
    {
      id: '3',
      propertyName: 'Ocean View Estate',
      propertyAddress: '789 Coastal Hwy',
      requestType: 'video',
      requestDate: '2023-10-14',
      realizedDate: null,
      status: 'pending',
      notes: 'Awaiting photographer confirmation'
    }
  ])

  const form = useForm<PhotoRequest>({
    resolver: zodResolver(photoRequestSchema),
    defaultValues: {
      requestType: 'photo',
      requiredShots: []
    }
  })

  const shotTypes = [
    'Front Exterior',
    'Back Exterior',
    'Living Room',
    'Kitchen',
    'Master Bedroom',
    'Master Bathroom',
    'Aerial View',
    'Pool Area',
    'Garden',
    'Ocean View'
  ]

  async function onSubmit(values: PhotoRequest) {
    try {
      setIsSubmitting(true)
      // TODO: Integrate with Airtable
      console.log(values)
      toast.success('Photo request submitted successfully')
      form.reset()
    } catch (error) {
      toast.error('Error submitting photo request')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId)
    if (asset) {
      window.open(asset.url, '_blank')
    }
  }

  const handleDelete = (assetId: string) => {
    toast.success('Asset deleted successfully')
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Create Visual Assets</h1>
        <p className="text-primary-medium mt-2">Manage property photography and media assets</p>
      </div>

      <Tabs defaultValue="request-form" className="space-y-8">
        <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2">
            <TabsTrigger 
              value="request-form" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                <span className="font-medium">Request Photos/Videos</span>
              </div>
              <p className="text-sm text-left">Submit photography and videography requests</p>
            </TabsTrigger>
            
            <TabsTrigger 
              value="request-history" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Request History</span>
              </div>
              <p className="text-sm text-left">Track and manage media requests</p>
            </TabsTrigger>
            
            <TabsTrigger 
              value="asset-library" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                <span className="font-medium">Asset Library</span>
              </div>
              <p className="text-sm text-left">Browse and manage property media assets</p>
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="request-form" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">Photography/Videography Request</h2>
              <p className="text-primary-medium">Submit a request for professional property media</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Request Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="propertyName">Property Name *</Label>
                        <Input
                          {...form.register('propertyName')}
                          placeholder="Enter property name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="propertyAddress">Property Address *</Label>
                        <Input
                          {...form.register('propertyAddress')}
                          placeholder="Enter property address"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Request Type *</Label>
                      <Select
                        onValueChange={(value) => form.setValue('requestType', value as 'photo' | 'video' | 'both')}
                        defaultValue={form.getValues('requestType')}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select request type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="photo" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-primary-dark outline-none">Photography Only</SelectItem>
                          <SelectItem value="video" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-primary-dark outline-none">Videography Only</SelectItem>
                          <SelectItem value="both" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-primary-dark outline-none">Both Photo & Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredDate">Preferred Date *</Label>
                        <Input
                          {...form.register('preferredDate')}
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredTime">Preferred Time *</Label>
                        <Input
                          {...form.register('preferredTime')}
                          type="time"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alternateDate">Alternate Date</Label>
                        <Input
                          {...form.register('alternateDate')}
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="alternateTime">Alternate Time</Label>
                        <Input
                          {...form.register('alternateTime')}
                          type="time"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Required Shots *</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {shotTypes.map((shot) => (
                          <div key={shot} className="flex items-center space-x-2">
                            <Checkbox
                              id={shot}
                              onCheckedChange={(checked) => {
                                const current = form.getValues('requiredShots')
                                if (checked) {
                                  form.setValue('requiredShots', [...current, shot])
                                } else {
                                  form.setValue(
                                    'requiredShots',
                                    current.filter((value) => value !== shot)
                                  )
                                }
                              }}
                            />
                            <Label htmlFor={shot}>{shot}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        {...form.register('contactName')}
                        placeholder="Name of on-site contact"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone *</Label>
                      <Input
                        {...form.register('contactPhone')}
                        placeholder="Phone number"
                        type="tel"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        {...form.register('contactEmail')}
                        placeholder="Email address (optional)"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactRole">Contact Role *</Label>
                      <Select
                        onValueChange={(value) => form.setValue('contactRole', value)}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="owner" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-primary-dark outline-none">Property Owner</SelectItem>
                          <SelectItem value="manager" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-primary-dark outline-none">Property Manager</SelectItem>
                          <SelectItem value="agent" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-primary-dark outline-none">Real Estate Agent</SelectItem>
                          <SelectItem value="caretaker" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-primary-dark outline-none">Caretaker</SelectItem>
                          <SelectItem value="other" className="cursor-pointer hover:bg-gray-100 focus:bg-gray-100 focus:text-primary-dark outline-none">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactNotes">Contact Notes</Label>
                    <Textarea
                      {...form.register('contactNotes')}
                      placeholder="Any additional notes about contacting or accessing the property"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialInstructions">Special Instructions</Label>
                      <Textarea
                        {...form.register('specialInstructions')}
                        placeholder="Enter any special instructions or requirements"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agentNotes">Agent Notes</Label>
                      <Textarea
                        {...form.register('agentNotes')}
                        placeholder="Add any additional notes"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="request-history" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">Request History</h2>
              <p className="text-primary-medium">Track and manage media requests</p>
            </div>

            <div className="space-y-4">
              {requestHistory.map((request) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-lg mb-1">{request.propertyName}</h3>
                      <p className="text-sm text-gray-600">{request.propertyAddress}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Type:</span>{' '}
                          {request.requestType.charAt(0).toUpperCase() + request.requestType.slice(1)}
                        </div>
                        <div>
                          <span className="font-medium">Requested:</span>{' '}
                          {request.requestDate}
                        </div>
                        <div>
                          <span className="font-medium">Realized:</span>{' '}
                          {request.realizedDate || 'Pending'}
                        </div>
                        {request.notes && (
                          <div>
                            <span className="font-medium">Notes:</span>{' '}
                            {request.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        request.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                      {request.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={() => setSelectedAsset(request.id)}
                        >
                          <ImageIcon className="h-4 w-4" />
                          View Assets
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="asset-library" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">Asset Library</h2>
              <p className="text-primary-medium">Browse and manage property media assets</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assets.map((asset) => (
                <Card key={asset.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={asset.thumbnail}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                    {asset.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                    )}
                    {asset.status === 'processing' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="text-white text-center">
                          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                          <p>Processing...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium">{asset.title}</h3>
                        <p className="text-sm text-gray-600">{asset.propertyName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        asset.status === 'ready'
                          ? 'bg-green-100 text-green-800'
                          : asset.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Uploaded: {asset.uploadedAt}</p>
                      <p>Size: {asset.size}</p>
                      {asset.dimensions && <p>Dimensions: {asset.dimensions}</p>}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleDownload(asset.id)}
                        disabled={asset.status !== 'ready'}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleDelete(asset.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <Card className="flex items-center justify-center aspect-video cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Upload New Asset</p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}