"use client"

import { useState } from "react"
import Link from "next/link"
import { DyraneButton } from "@/components/dyrane-ui/dyrane-button"
import { PageHeader } from "@/components/layout/page-header"
import { 
  Plus, 
  Edit3, 
  Copy, 
  Trash2, 
  Layout,
  Type,
  Image as ImageIcon,
  Settings,
  Users,
  Star,
  Phone,
  Search,
  Filter
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function SectionsManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const [sections] = useState([
    {
      id: "hero-default",
      name: "Default Hero Section",
      type: "hero",
      description: "Standard hero section with title, subtitle, and CTA buttons",
      usedIn: ["Landing Page"],
      lastModified: "2024-01-15",
      status: "active"
    },
    {
      id: "about-mission-vision",
      name: "Mission & Vision Cards",
      type: "content",
      description: "Two-column layout with mission and vision cards",
      usedIn: ["Landing Page", "About Page"],
      lastModified: "2024-01-14",
      status: "active"
    },
    {
      id: "features-grid",
      name: "Features Grid",
      type: "features",
      description: "Grid layout for displaying features with icons",
      usedIn: ["Landing Page"],
      lastModified: "2024-01-12",
      status: "active"
    },
    {
      id: "courses-showcase",
      name: "Courses Showcase",
      type: "courses",
      description: "Dynamic course display with filtering",
      usedIn: ["Landing Page", "Courses Page"],
      lastModified: "2024-01-10",
      status: "active"
    },
    {
      id: "tech-display",
      name: "Technology Display",
      type: "technologies",
      description: "Apple-style technology showcase with icons",
      usedIn: ["Landing Page"],
      lastModified: "2024-01-08",
      status: "active"
    },
    {
      id: "testimonials-carousel",
      name: "Testimonials Carousel",
      type: "testimonials",
      description: "Sliding testimonials with user photos",
      usedIn: ["Landing Page"],
      lastModified: "2024-01-05",
      status: "active"
    },
    {
      id: "contact-form",
      name: "Contact Form Section",
      type: "contact",
      description: "Contact form with company information",
      usedIn: ["Landing Page", "Contact Page"],
      lastModified: "2024-01-03",
      status: "active"
    },
    {
      id: "cta-banner",
      name: "Call to Action Banner",
      type: "cta",
      description: "Full-width banner with call to action",
      usedIn: [],
      lastModified: "2024-01-01",
      status: "draft"
    }
  ])

  const filteredSections = sections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || section.type === filterType
    return matchesSearch && matchesType
  })

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return Layout
      case 'content': return Type
      case 'features': return Settings
      case 'courses': return Layout
      case 'technologies': return Settings
      case 'testimonials': return Users
      case 'contact': return Phone
      case 'cta': return Star
      default: return Layout
    }
  }

  const getSectionTypeColor = (type: string) => {
    switch (type) {
      case 'hero': return 'bg-blue-500'
      case 'content': return 'bg-green-500'
      case 'features': return 'bg-purple-500'
      case 'courses': return 'bg-orange-500'
      case 'technologies': return 'bg-cyan-500'
      case 'testimonials': return 'bg-pink-500'
      case 'contact': return 'bg-indigo-500'
      case 'cta': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const stats = {
    totalSections: sections.length,
    activeSections: sections.filter(s => s.status === 'active').length,
    draftSections: sections.filter(s => s.status === 'draft').length,
    reusableSections: sections.filter(s => s.usedIn.length > 1).length
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Section Management"
        subheading="Create and manage reusable page sections"
        actions={
          <DyraneButton asChild>
            <Link href="/admin/website/sections/new">
              <Plus className="mr-2 h-4 w-4" />
              New Section
            </Link>
          </DyraneButton>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sections</CardTitle>
            <Layout className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeSections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Edit3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.draftSections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reusable</CardTitle>
            <Copy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.reusableSections}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sections Library */}
      <Card>
        <CardHeader>
          <CardTitle>Section Library</CardTitle>
          <CardDescription>Manage your reusable page sections</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hero">Hero</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="features">Features</SelectItem>
                <SelectItem value="courses">Courses</SelectItem>
                <SelectItem value="technologies">Technologies</SelectItem>
                <SelectItem value="testimonials">Testimonials</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="cta">Call to Action</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSections.map((section) => {
              const SectionIcon = getSectionIcon(section.type)
              return (
                <Card key={section.id} className="group hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${getSectionTypeColor(section.type)} text-white`}>
                        <SectionIcon className="h-6 w-6" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/website/sections/${section.id}`}>
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{section.name}</h3>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant={section.status === 'active' ? 'default' : 'secondary'}>
                          {section.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {section.type}
                        </Badge>
                      </div>

                      {section.usedIn.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Used in:</p>
                          <div className="flex flex-wrap gap-1">
                            {section.usedIn.slice(0, 2).map((page, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {page}
                              </Badge>
                            ))}
                            {section.usedIn.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{section.usedIn.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          Modified {section.lastModified}
                        </span>
                        <DyraneButton variant="outline" size="sm" asChild>
                          <Link href={`/admin/website/sections/${section.id}`}>
                            <Edit3 className="h-4 w-4" />
                          </Link>
                        </DyraneButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
