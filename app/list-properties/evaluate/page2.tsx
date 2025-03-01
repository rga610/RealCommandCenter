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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/default/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/default/dialog"
import { toast } from 'sonner'
import { 
  FileText, 
  Send,
  Share2,
  Pencil,
  ExternalLink,
  Copy,
  Mail,
  Upload,
  FolderOpen,
  Download,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ArrowUpRight,
  Trash2,
  Plus
} from 'lucide-react'

// Schema for CMA Report
const cmaReportSchema = z.object({
  id: z.string(),
  propertyName: z.string().min(1, 'Property name is required'),
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  bedrooms: z.string().min(1, 'Bedrooms is required'),
  bathrooms: z.string().min(1, 'Bathrooms is required'),
  totalArea: z.string().min(1, 'Total area is required'),
  yearBuilt: z.string().optional(),
  linkedCompAnalysis: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['draft', 'in_review', 'approved']),
  createdAt: z.string(),
  updatedAt: z.string()
})

// Update the Manual Comps Analysis schema
const manualCompsAnalysisSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Analysis name is required'),
  propertyType: z.string().min(1, 'Property type is required'),
  location: z.string().min(1, 'Location is required'),
  status: z.enum(['active', 'archived']),
  createdAt: z.string(),
  updatedAt: z.string(),
  properties: z.array(z.object({
    id: z.string(),
    address: z.string().min(1, 'Address is required'),
    price: z.number().min(0, 'Price must be positive'),
    area: z.number().min(0, 'Area must be positive'),
    status: z.enum(['active', 'pending', 'sold']),
    bedrooms: z.number().min(0, 'Number of bedrooms must be positive'),
    bathrooms: z.number().min(0, 'Number of bathrooms must be positive'),
    features: z.string().optional(),
    notes: z.string().optional(),
    listingUrl: z.string().url().optional()
  }))
})

type CMAReport = z.infer<typeof cmaReportSchema>
type ManualCompsAnalysis = z.infer<typeof manualCompsAnalysisSchema>
type CompProperty = ManualCompsAnalysis['properties'][0]

export default function EvaluateProperty() {
  // State for active CMA report and manual comps analysis
  const [selectedCMAReport, setSelectedCMAReport] = useState<string | null>(null)
  const [selectedCompsAnalysis, setSelectedCompsAnalysis] = useState<string | null>(null)
  
  // Mock data for CMA reports
  const [cmaReports, setCMAReports] = useState<CMAReport[]>([
    {
      id: '1',
      propertyName: 'Sunset Villa',
      propertyAddress: '123 Ocean View Dr',
      propertyType: 'Villa',
      bedrooms: '4',
      bathrooms: '3.5',
      totalArea: '3500',
      yearBuilt: '2020',
      linkedCompAnalysis: '1',
      notes: 'Luxury villa with ocean views',
      status: 'draft',
      createdAt: '2023-10-15',
      updatedAt: '2023-10-15'
    }
  ])

  // Update mock data for manual comps analyses
  const [manualCompsAnalyses, setManualCompsAnalyses] = useState<ManualCompsAnalysis[]>([
    {
      id: '1',
      name: 'Ocean View Villas Q4 2023',
      propertyType: 'Villa',
      location: 'Playa Hermosa',
      status: 'active',
      createdAt: '2023-10-15',
      updatedAt: '2023-10-15',
      properties: [
        {
          id: '1',
          address: '123 Ocean View Dr',
          price: 2500000,
          area: 3500,
          status: 'active',
          bedrooms: 4,
          bathrooms: 3.5,
          features: 'Pool, Garden, Ocean View',
          notes: 'Recently renovated',
          listingUrl: 'https://example.com/listing/123'
        }
      ]
    }
  ])

  // Search states
  const [cmaSearchTerm, setCMASearchTerm] = useState('')
  const [compsSearchTerm, setCompsSearchTerm] = useState('')
  const [shareUrl, setShareUrl] = useState('')

  const breadcrumbItems = [
    { label: 'List a Property', href: '/list-properties' },
    { label: 'Evaluate Property', href: '/list-properties/evaluate' }
  ]

  // Filter functions
  const filteredCMAReports = cmaReports.filter(report =>
    report.propertyName.toLowerCase().includes(cmaSearchTerm.toLowerCase()) ||
    report.propertyAddress.toLowerCase().includes(cmaSearchTerm.toLowerCase())
  )

  const filteredCompsAnalyses = manualCompsAnalyses.filter(analysis =>
    analysis.name.toLowerCase().includes(compsSearchTerm.toLowerCase()) ||
    analysis.location.toLowerCase().includes(compsSearchTerm.toLowerCase())
  )

  // Handlers
  const handleCreateCMAReport = () => {
    const newReport: CMAReport = {
      id: (cmaReports.length + 1).toString(),
      propertyName: '',
      propertyAddress: '',
      propertyType: '',
      bedrooms: '',
      bathrooms: '',
      totalArea: '',
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    setCMAReports([...cmaReports, newReport])
    setSelectedCMAReport(newReport.id)
  }

  const handleCreateCompsAnalysis = () => {
    const newAnalysis: ManualCompsAnalysis = {
      id: (manualCompsAnalyses.length + 1).toString(),
      name: '',
      propertyType: '',
      location: '',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      properties: []
    }
    setManualCompsAnalyses([...manualCompsAnalyses, newAnalysis])
    setSelectedCompsAnalysis(newAnalysis.id)
  }

  const handleLinkCompsAnalysis = (cmaId: string, analysisId: string) => {
    setCMAReports(reports =>
      reports.map(report =>
        report.id === cmaId
          ? { ...report, linkedCompAnalysis: analysisId }
          : report
      )
    )
    toast.success('Comps analysis linked successfully')
  }

  const handleUpdateReport = (reportId: string, values: Partial<CMAReport>) => {
    setCMAReports(reports =>
      reports.map(report =>
        report.id === reportId
          ? {
              ...report,
              ...values,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : report
      )
    )
  }

  const handleUpdateAnalysis = (analysisId: string, values: Partial<Omit<ManualCompsAnalysis, 'properties'>>) => {
    setManualCompsAnalyses(analyses =>
      analyses.map(analysis =>
        analysis.id === analysisId
          ? {
              ...analysis,
              ...values,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : analysis
      )
    )
  }

  const handleAddProperty = (analysisId: string, property: Omit<CompProperty, 'id'>) => {
    setManualCompsAnalyses(analyses =>
      analyses.map(analysis =>
        analysis.id === analysisId
          ? {
              ...analysis,
              properties: [
                ...analysis.properties,
                {
                  ...property,
                  id: (analysis.properties.length + 1).toString()
                }
              ],
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : analysis
      )
    )
  }

  const handleUpdateProperty = (analysisId: string, propertyId: string, values: Partial<CompProperty>) => {
    setManualCompsAnalyses(analyses =>
      analyses.map(analysis =>
        analysis.id === analysisId
          ? {
              ...analysis,
              properties: analysis.properties.map(prop =>
                prop.id === propertyId
                  ? { ...prop, ...values }
                  : prop
              ),
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : analysis
      )
    )
  }

  const handleRemoveProperty = (analysisId: string, propertyId: string) => {
    setManualCompsAnalyses(analyses =>
      analyses.map(analysis =>
        analysis.id === analysisId
          ? {
              ...analysis,
              properties: analysis.properties.filter(prop => prop.id !== propertyId),
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : analysis
      )
    )
  }

  // Get the selected report
  const selectedReport = selectedCMAReport 
    ? cmaReports.find(report => report.id === selectedCMAReport)
    : null

  // Get the selected analysis
  const selectedAnalysis = selectedCompsAnalysis 
    ? manualCompsAnalyses.find(analysis => analysis.id === selectedCompsAnalysis)
    : null

  const form = useForm<z.infer<typeof manualCompsAnalysisSchema>>({
    resolver: zodResolver(manualCompsAnalysisSchema)
  })

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-primary-dark">Evaluate Property</h1>
        <p className="text-primary-medium mt-2">Conduct property evaluation and comparative market analysis</p>
      </div>

      <Tabs defaultValue="cma-report" className="space-y-8">
        <TabsList className="w-full border-b p-0 h-auto bg-white rounded-t-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full p-2">
            <TabsTrigger 
              value="cma-report" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <span className="font-medium">CMA Report</span>
              </div>
              <p className="text-sm text-left">Create and manage CMA reports</p>
            </TabsTrigger>
            
            <TabsTrigger 
              value="manual-comps" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                <span className="font-medium">Manual Comps</span>
              </div>
              <p className="text-sm text-left">Manage comparable properties</p>
            </TabsTrigger>
            
            <TabsTrigger 
              value="collaboration" 
              className="w-full data-[state=active]:border-b-2 data-[state=active]:border-accent-gold data-[state=active]:hover:bg-gray-100 data-[state=active]:hover:text-primary-dark hover:bg-primary-light hover:text-white transition-colors flex flex-col items-start p-4 gap-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                <span className="font-medium">Collaboration</span>
              </div>
              <p className="text-sm text-left">Request and track CMA reviews</p>
            </TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="cma-report" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-serif text-primary-dark mb-2">CMA Reports</h2>
                <p className="text-primary-medium">Create and manage property analysis reports</p>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1 md:w-64">
                  <Input
                    placeholder="Search reports..."
                    value={cmaSearchTerm}
                    onChange={(e) => setCMASearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={handleCreateCMAReport}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Report
                </Button>
              </div>
            </div>

            {selectedCMAReport && selectedReport ? (
              <div className="space-y-6">
                {/* Selected CMA Report Details */}
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-medium">Report Details</h3>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCMAReport(null)}
                    >
                      Back to List
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Property Name</Label>
                        <Input 
                          value={selectedReport.propertyName}
                          onChange={(e) => handleUpdateReport(selectedReport.id, {
                            propertyName: e.target.value
                          })}
                          placeholder="Enter property name"
                        />
                      </div>
                      <div>
                        <Label>Property Address</Label>
                        <Input 
                          value={selectedReport.propertyAddress}
                          onChange={(e) => handleUpdateReport(selectedReport.id, {
                            propertyAddress: e.target.value
                          })}
                          placeholder="Enter property address"
                        />
                      </div>
                      <div>
                        <Label>Property Type</Label>
                        <Input 
                          value={selectedReport.propertyType}
                          onChange={(e) => handleUpdateReport(selectedReport.id, {
                            propertyType: e.target.value
                          })}
                          placeholder="e.g., Villa, House"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Bedrooms</Label>
                          <Input 
                            type="number"
                            min="0"
                            value={selectedReport.bedrooms}
                            onChange={(e) => handleUpdateReport(selectedReport.id, {
                              bedrooms: e.target.value
                            })}
                          />
                        </div>
                        <div>
                          <Label>Bathrooms</Label>
                          <Input 
                            type="number"
                            min="0"
                            step="0.5"
                            value={selectedReport.bathrooms}
                            onChange={(e) => handleUpdateReport(selectedReport.id, {
                              bathrooms: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Total Area (sqft)</Label>
                        <Input 
                          type="number"
                          min="0"
                          value={selectedReport.totalArea}
                          onChange={(e) => handleUpdateReport(selectedReport.id, {
                            totalArea: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label>Year Built</Label>
                        <Input 
                          type="number"
                          value={selectedReport.yearBuilt}
                          onChange={(e) => handleUpdateReport(selectedReport.id, {
                            yearBuilt: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <Label>Linked Comps Analysis</Label>
                        <Select
                          value={selectedReport.linkedCompAnalysis}
                          onValueChange={(value) => handleLinkCompsAnalysis(selectedReport.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select analysis" />
                          </SelectTrigger>
                          <SelectContent>
                            {manualCompsAnalyses.map(analysis => (
                              <SelectItem 
                                key={analysis.id} 
                                value={analysis.id}
                              >
                                {analysis.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label>Notes</Label>
                    <Textarea 
                      className="mt-2"
                      value={selectedReport.notes}
                      onChange={(e) => handleUpdateReport(selectedReport.id, {
                        notes: e.target.value
                      })}
                      placeholder="Add any additional notes"
                    />
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline">Save Draft</Button>
                    <Button>Request Review</Button>
                  </div>
                </Card>

                {/* Market Analysis Section */}
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-6">Market Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Average List Price</h4>
                      <p className="text-2xl font-bold text-primary-dark">$2,500,000</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Price per Sqft</h4>
                      <p className="text-2xl font-bold text-primary-dark">$714</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Days on Market</h4>
                      <p className="text-2xl font-bold text-primary-dark">45</p>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCMAReports.map((report) => (
                  <Card key={report.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg mb-1">{report.propertyName}</h3>
                        <p className="text-sm text-gray-600">{report.propertyAddress}</p>
                        <div className="flex gap-4 mt-1">
                          <p className="text-sm text-gray-600">Type: {report.propertyType}</p>
                          <p className="text-sm text-gray-600">Created: {report.createdAt}</p>
                          <p className="text-sm text-gray-600">Updated: {report.updatedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          report.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'in_review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedCMAReport(report.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="manual-comps" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-serif text-primary-dark mb-2">Manual Comps</h2>
                <p className="text-primary-medium">Manage comparable property analyses</p>
              </div>
              <div className="flex gap-4">
                <div className="relative flex-1 md:w-64">
                  <Input
                    placeholder="Search analyses..."
                    value={compsSearchTerm}
                    onChange={(e) => setCompsSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleCreateCompsAnalysis}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  New Analysis
                </Button>
              </div>
            </div>

            {selectedCompsAnalysis && selectedAnalysis ? (
              <div className="space-y-6">
                {/* Analysis Details */}
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-lg font-medium">Analysis Details</h3>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedCompsAnalysis(null)}
                    >
                      Back to List
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label>Analysis Name</Label>
                      <Input
                        value={selectedAnalysis.name}
                        onChange={(e) => handleUpdateAnalysis(selectedAnalysis.id, {
                          name: e.target.value
                        })}
                        placeholder="Enter analysis name"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Property Type</Label>
                      <Input
                        value={selectedAnalysis.propertyType}
                        onChange={(e) => handleUpdateAnalysis(selectedAnalysis.id, {
                          propertyType: e.target.value
                        })}
                        placeholder="e.g., Villa, House"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Location</Label>
                      <Input
                        value={selectedAnalysis.location}
                        onChange={(e) => handleUpdateAnalysis(selectedAnalysis.id, {
                          location: e.target.value
                        })}
                        placeholder="Enter location"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={selectedAnalysis.status}
                        onValueChange={(value) => handleUpdateAnalysis(selectedAnalysis.id, {
                          status: value as 'active' | 'archived'
                        })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Comparable Properties */}
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium">Comparable Properties</h3>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Add Property
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Comparable Property</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit((values) => {
                            handleAddProperty(selectedAnalysis.id, {
                              address: values.properties[0].address,
                              price: values.properties[0].price,
                              area: values.properties[0].area,
                              status: values.properties[0].status,
                              bedrooms: values.properties[0].bedrooms,
                              bathrooms: values.properties[0].bathrooms,
                              features: values.properties[0].features,
                              notes: values.properties[0].notes,
                              listingUrl: values.properties[0].listingUrl
                            })
                            form.reset()
                          })} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Address</Label>
                                <Input {...form.register('properties.0.address')} placeholder="Enter property address" />
                              </div>
                              <div className="space-y-2">
                                <Label>Price</Label>
                                <Input {...form.register('properties.0.price')} type="number" min="0" placeholder="Enter price" />
                              </div>
                              <div className="space-y-2">
                                <Label>Area (sqft)</Label>
                                <Input {...form.register('properties.0.area')} type="number" min="0" placeholder="Enter area" />
                              </div>
                              <div className="space-y-2">
                                <Label>Status</Label>
                                <Select onValueChange={(value) => form.setValue('properties.0.status', value as 'active' | 'pending' | 'sold')}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="sold">Sold</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Bedrooms</Label>
                                <Input {...form.register('properties.0.bedrooms')} type="number" min="0" placeholder="Number of bedrooms" />
                              </div>
                              <div className="space-y-2">
                                <Label>Bathrooms</Label>
                                <Input {...form.register('properties.0.bathrooms')} type="number" min="0" step="0.5" placeholder="Number of bathrooms" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Features</Label>
                              <Textarea {...form.register('properties.0.features')} placeholder="Enter property features" />
                            </div>
                            <div className="space-y-2">
                              <Label>Notes</Label>
                              <Textarea {...form.register('properties.0.notes')} placeholder="Enter any additional notes" />
                            </div>
                            <div className="space-y-2">
                              <Label>Listing URL</Label>
                              <Input {...form.register('properties.0.listingUrl')} type="url" placeholder="Enter listing URL" />
                            </div>
                            <div className="flex justify-end gap-4">
                              <DialogTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                               </DialogTrigger>
                              <Button type="submit">Add Property</Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-4">
                    {selectedAnalysis.properties.map((property) => (
                      <Card key={property.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium mb-1">{property.address}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                              <p>Price: ${property.price.toLocaleString()}</p>
                              <p>Area: {property.area} sqft</p>
                              <p>Beds: {property.bedrooms}</p>
                              <p>Baths: {property.bathrooms}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {property.listingUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(property.listingUrl, '_blank')}
                                className="flex items-center gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View Listing
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveProperty(selectedAnalysis.id, property.id)}
                              className="flex items-center gap-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCompsAnalyses.map((analysis) => (
                  <Card key={analysis.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg mb-1">{analysis.name}</h3>
                        <p className="text-sm text-gray-600">{analysis.location}</p>
                        <div className="flex gap-4 mt-1">
                          <p className="text-sm text-gray-600">Type: {analysis.propertyType}</p>
                          <p className="text-sm text-gray-600">Created: {analysis.createdAt}</p>
                          <p className="text-sm text-gray-600">Updated: {analysis.updatedAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          analysis.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                        </span>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedCompsAnalysis(analysis.id)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="collaboration" className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-serif text-primary-dark mb-2">Collaboration</h2>
                <p className="text-primary-medium">Track and manage CMA review requests</p>
              </div>
            </div>

            <div className="p-4 text-center text-gray-500">
              No active review requests
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}