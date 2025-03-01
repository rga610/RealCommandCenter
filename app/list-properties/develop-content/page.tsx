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
import { Checkbox } from '@/components/default/checkbox'
import { toast } from 'sonner'
import { 
  FileText, 
  BookOpen,
  CheckCircle2,
  Share2,
  Save,
  Upload,
  X,
  Sparkles,
  MessageSquare
} from 'lucide-react'

const contentSchema = z.object({
  propertyName: z.string().min(1, 'Property name is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  bedrooms: z.string().min(1, 'Number of bedrooms is required'),
  bathrooms: z.string().min(1, 'Number of bathrooms is required'),
  parkingSpots: z.string().min(1, 'Number of parking spots is required'),
  totalArea: z.string().min(1, 'Total area is required'),
  locationDetails: z.string().min(1, 'Location details are required'),
  features: z.array(z.string()).min(1, 'At least one feature is required'),
  otherKeyFeatures: z.string().optional(),
  generatedContent: z.string().optional()
})

type PropertyImage = {
  id: string
  file: File
  preview: string
}

export default function DevelopContent() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [propertyImages, setPropertyImages] = useState<PropertyImage[]>([])
  
  const breadcrumbItems = [
    { label: 'List a Property', href: '/list-properties' },
    { label: 'Develop Listing Content', href: '/list-properties/develop-content' }
  ]

  const form = useForm<z.infer<typeof contentSchema>>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      features: []
    }
  })

  const features = [
    'Ocean View',
    'Mountain View',
    'Private Pool',
    'Garden',
    'Terrace',
    'Garage',
    'Security System',
    'Smart Home',
    'Solar Panels',
    'Wine Cellar',
    'Home Theater',
    'Gym'
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file)
      }))
      setPropertyImages(prev => [...prev, ...newImages])
    }
  }

  const removeImage = (id: string) => {
    setPropertyImages(prev => {
      const filtered = prev.filter(img => img.id !== id)
      const removed = prev.find(img => img.id === id)
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
      return filtered
    })
  }

  const handleGenerateContent = async () => {
    try {
      setIsGenerating(true)
      // TODO: Integrate with AI service
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      form.setValue('generatedContent', `Experience luxury living at its finest in this stunning ${form.getValues('propertyType')} featuring ${form.getValues('bedrooms')} bedrooms and ${form.getValues('bathrooms')} bathrooms. This exceptional property spans ${form.getValues('totalArea')} square meters of meticulously designed living space.

Located in ${form.getValues('locationDetails')}, this residence offers the perfect blend of comfort and sophistication. The property includes ${form.getValues('parkingSpots')} parking spots and boasts an array of premium amenities.

Key Features:
${form.getValues('features').map(feature => `• ${feature}`).join('\n')}

${form.getValues('otherKeyFeatures')}

Don't miss this extraordinary opportunity to own a piece of paradise. Contact us today to schedule a private viewing.`)
      toast.success('Content generated successfully')
    } catch (error) {
      toast.error('Error generating content')
    } finally {
      setIsGenerating(false)
    }
  }

  async function onSubmit(values: z.infer<typeof contentSchema>) {
    try {
      // TODO: Save to database
      console.log(values)
      toast.success('Content saved successfully')
    } catch (error) {
      toast.error('Error saving content')
    }
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Develop Listing Content</h1>
        <p className="text-primary-medium mt-2">Create and manage property listing descriptions</p>
      </div>

      <Tabs defaultValue="ai-generator" className="space-y-8">
        <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2">
            <TabsTrigger 
              value="ai-generator" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">AI Copy Generator</span>
              </div>
              <p className="text-sm text-left">Generate listing descriptions with AI</p>
            </TabsTrigger>
            
            <TabsTrigger 
              value="best-practices" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <span className="font-medium">Best Practices</span>
              </div>
              <p className="text-sm text-left">Writing guidelines and examples</p>
            </TabsTrigger>
            
            <TabsTrigger 
              value="approval" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Approval Workflow</span>
              </div>
              <p className="text-sm text-left">Review and approve content</p>
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="ai-generator" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">AI Copy Generator</h2>
              <p className="text-primary-medium">Generate professional listing descriptions with AI assistance</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Property Details Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Property Details</h3>
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
                      <Label htmlFor="bedrooms">Bedrooms *</Label>
                      <Input
                        {...form.register('bedrooms')}
                        type="number"
                        min="0"
                        placeholder="Number of bedrooms"
                        className="placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms *</Label>
                      <Input
                        {...form.register('bathrooms')}
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="Number of bathrooms"
                        className="placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parkingSpots">Parking Spots *</Label>
                      <Input
                        {...form.register('parkingSpots')}
                        type="number"
                        min="0"
                        placeholder="Number of parking spots"
                        className="placeholder:text-gray-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="totalArea">Total Area (m²) *</Label>
                      <Input
                        {...form.register('totalArea')}
                        type="number"
                        min="0"
                        placeholder="Total area in square meters"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location Information</h3>
                  <div className="space-y-2">
                    <Label htmlFor="locationDetails">About the Location *</Label>
                    <Textarea
                      {...form.register('locationDetails')}
                      placeholder="Describe the location, nearby amenities, and neighborhood features"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Key Features Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Key Features & Selling Points</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          onCheckedChange={(checked) => {
                            const current = form.getValues('features')
                            if (checked) {
                              form.setValue('features', [...current, feature])
                            } else {
                              form.setValue(
                                'features',
                                current.filter((value) => value !== feature)
                              )
                            }
                          }}
                        />
                        <Label htmlFor={feature}>{feature}</Label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otherKeyFeatures">Other Key Features</Label>
                    <Textarea
                      {...form.register('otherKeyFeatures')}
                      placeholder="List any additional important features or amenities"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Property Images Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Property Images</h3>
                  <p className="text-sm text-gray-600">Upload property images to enhance AI-generated descriptions</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {propertyImages.map((image) => (
                      <div key={image.id} className="relative aspect-square">
                        <img
                          src={image.preview}
                          alt="Property"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="relative aspect-square cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-dark transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                        <Upload className="h-8 w-8 mb-2" />
                        <span className="text-sm">Add Photos</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Generated Content Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Generated Content</h3>
                    <Button
                      type="button"
                      onClick={handleGenerateContent}
                      disabled={isGenerating}
                      className="bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      {isGenerating ? 'Generating...' : 'Generate Description'}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Textarea
                      {...form.register('generatedContent')}
                      placeholder="Generated content will appear here"
                      className="min-h-[300px]"
                    />
                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Share2 className="h-4 w-4" />
                        Share for Review
                      </Button>
                      <Button
                        type="submit"
                        className="flex items-center gap-2 bg-accent-gold hover:bg-accent-gold-light text-primary-dark"
                      >
                        <Save className="h-4 w-4" />
                        Save Content
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="best-practices" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">Best Practices & Examples</h2>
              <p className="text-primary-medium">Guidelines for creating effective luxury property descriptions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Writing Guidelines</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Use Descriptive Language</p>
                      <p className="text-sm text-gray-600">Paint a picture with words that evoke emotion and luxury</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Highlight Unique Features</p>
                      <p className="text-sm text-gray-600">Emphasize what makes the property special and distinctive</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Include Location Benefits</p>
                      <p className="text-sm text-gray-600">Describe the lifestyle and amenities the location offers</p>
                    </div>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Example Description</h3>
                <div className="prose prose-sm">
                  <p className="text-gray-600">
                    "Welcome to Villa Paraíso, an architectural masterpiece nestled in the prestigious hills of Peninsula Papagayo. This stunning 5-bedroom residence seamlessly blends indoor and outdoor living, offering breathtaking 180-degree ocean views from its infinity pool and expansive terraces.
                  </p>
                  <p className="text-gray-600 mt-4">
                    Meticulously designed with premium finishes, the villa features soaring ceilings, floor-to-ceiling windows, and a gourmet kitchen equipped with top-of-the-line appliances. The primary suite is a private sanctuary with a spa-like bathroom and private balcony.
                  </p>
                  <p className="text-gray-600 mt-4">
                    Located just minutes from world-class golf courses and luxury resorts, this property represents the pinnacle of Costa Rican luxury living."
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="approval" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-serif text-primary-dark mb-2">Content Approval Workflow</h2>
              <p className="text-primary-medium">Review and approve listing content</p>
            </div>

            <div className="text-center py-8">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No content pending review</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}