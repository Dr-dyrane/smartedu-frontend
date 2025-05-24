"use client"

import { useState } from "react"
import Link from "next/link"
import { DyraneButton } from "@/components/dyrane-ui/dyrane-button"
import { PageHeader } from "@/components/layout/page-header"
import { 
  Save, 
  Eye, 
  ArrowLeft,
  Plus,
  Edit3,
  Move,
  Settings,
  Image as ImageIcon,
  Type,
  Layout
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function LandingPageEditor() {
  const [pageData, setPageData] = useState({
    title: "Landing Page",
    slug: "/",
    status: "published",
    metaDescription: "Awaken Your Tech Future with 1Tech Academy - Empowering tomorrow's tech leaders",
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        type: "hero",
        enabled: true,
        data: {
          title: "Awaken Your Tech Future with 1Tech Academy.",
          subtitle: "Empowering tomorrow's tech leaders through real-world projects, professional certifications, and a transformative learning environment.",
          primaryCTA: { text: "Enroll Now", href: "/signup" },
          secondaryCTA: { text: "Learn More", href: "#courses" },
          backgroundImage: "/hero-bg.jpg"
        }
      },
      {
        id: "about",
        name: "About Us Section",
        type: "content",
        enabled: true,
        data: {
          title: "About 1Tech Academy",
          description: "We are a community where creativity thrives, innovation takes shape, and transformation begins.",
          content: "Here, you'll build problem-solving skills, grow your professional network, and gain the confidence to turn ideas into reality."
        }
      },
      {
        id: "why-us",
        name: "Why Choose Us",
        type: "features",
        enabled: true,
        data: {
          title: "Why Choose 1Tech Academy",
          description: "At 1Tech Academy, you're not just learning, you're joining a network of like-minded professionals.",
          features: []
        }
      },
      {
        id: "courses",
        name: "Explore Our Courses",
        type: "courses",
        enabled: true,
        data: {
          title: "Explore Our Courses",
          description: "Unlock your potential with industry-leading tech courses taught by experts."
        }
      },
      {
        id: "technologies",
        name: "Technologies We Teach",
        type: "technologies",
        enabled: true,
        data: {
          title: "Technologies We Teach",
          description: "Master the tools and platforms shaping the future of tech."
        }
      },
      {
        id: "testimonials",
        name: "Testimonials",
        type: "testimonials",
        enabled: true,
        data: {
          title: "What Our Clients Say",
          description: "Hear from students, educators, and partners who've transformed their learning journey."
        }
      },
      {
        id: "contact",
        name: "Contact Us",
        type: "contact",
        enabled: true,
        data: {
          title: "Ready to Get in Touch?",
          description: "Fill out the form or reach out directly through any of the following methods.",
          address: "17 Aje Street, Sabo Yaba Lagos.",
          phone: "+2347074693513",
          email: "info@1techacademy.com"
        }
      }
    ]
  })

  const handleSectionToggle = (sectionId: string, enabled: boolean) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, enabled } : section
      )
    }))
  }

  const handleSectionDataUpdate = (sectionId: string, field: string, value: string) => {
    setPageData(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId 
          ? { ...section, data: { ...section.data, [field]: value } }
          : section
      )
    }))
  }

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'hero': return Layout
      case 'content': return Type
      case 'features': return Settings
      case 'courses': return Layout
      case 'technologies': return Settings
      case 'testimonials': return Type
      case 'contact': return Type
      default: return Layout
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Edit Landing Page"
        subheading="Customize your landing page content and sections"
        actions={
          <div className="flex gap-2">
            <DyraneButton variant="outline" asChild>
              <Link href="/admin/website/pages">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pages
              </Link>
            </DyraneButton>
            <DyraneButton variant="outline" asChild>
              <Link href="/" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Link>
            </DyraneButton>
            <DyraneButton>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </DyraneButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Page Settings */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
              <CardDescription>Basic page configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  value={pageData.title}
                  onChange={(e) => setPageData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="page-slug">URL Slug</Label>
                <Input
                  id="page-slug"
                  value={pageData.slug}
                  onChange={(e) => setPageData(prev => ({ ...prev, slug: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={pageData.metaDescription}
                  onChange={(e) => setPageData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="page-status"
                  checked={pageData.status === 'published'}
                  onCheckedChange={(checked) => 
                    setPageData(prev => ({ ...prev, status: checked ? 'published' : 'draft' }))
                  }
                />
                <Label htmlFor="page-status">Published</Label>
                <Badge variant={pageData.status === 'published' ? 'default' : 'secondary'}>
                  {pageData.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Page Sections */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Page Sections</CardTitle>
              <CardDescription>Configure each section of your landing page</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {pageData.sections.map((section) => {
                  const IconComponent = getSectionIcon(section.type)
                  return (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-4 w-4" />
                          <span>{section.name}</span>
                          <Badge variant={section.enabled ? 'default' : 'secondary'}>
                            {section.enabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={section.enabled}
                            onCheckedChange={(checked) => handleSectionToggle(section.id, checked)}
                          />
                          <Label>Enable this section</Label>
                        </div>

                        {section.enabled && (
                          <div className="space-y-4 pl-4 border-l-2 border-muted">
                            {section.data.title && (
                              <div>
                                <Label>Section Title</Label>
                                <Input
                                  value={section.data.title}
                                  onChange={(e) => handleSectionDataUpdate(section.id, 'title', e.target.value)}
                                />
                              </div>
                            )}

                            {section.data.subtitle && (
                              <div>
                                <Label>Subtitle</Label>
                                <Input
                                  value={section.data.subtitle}
                                  onChange={(e) => handleSectionDataUpdate(section.id, 'subtitle', e.target.value)}
                                />
                              </div>
                            )}

                            {section.data.description && (
                              <div>
                                <Label>Description</Label>
                                <Textarea
                                  value={section.data.description}
                                  onChange={(e) => handleSectionDataUpdate(section.id, 'description', e.target.value)}
                                  rows={3}
                                />
                              </div>
                            )}

                            {section.data.content && (
                              <div>
                                <Label>Content</Label>
                                <Textarea
                                  value={section.data.content}
                                  onChange={(e) => handleSectionDataUpdate(section.id, 'content', e.target.value)}
                                  rows={4}
                                />
                              </div>
                            )}

                            {section.type === 'hero' && (
                              <>
                                <div>
                                  <Label>Primary CTA Text</Label>
                                  <Input
                                    value={section.data.primaryCTA?.text || ''}
                                    onChange={(e) => handleSectionDataUpdate(section.id, 'primaryCTA', JSON.stringify({
                                      ...section.data.primaryCTA,
                                      text: e.target.value
                                    }))}
                                  />
                                </div>
                                <div>
                                  <Label>Primary CTA Link</Label>
                                  <Input
                                    value={section.data.primaryCTA?.href || ''}
                                    onChange={(e) => handleSectionDataUpdate(section.id, 'primaryCTA', JSON.stringify({
                                      ...section.data.primaryCTA,
                                      href: e.target.value
                                    }))}
                                  />
                                </div>
                              </>
                            )}

                            {section.type === 'contact' && (
                              <>
                                <div>
                                  <Label>Address</Label>
                                  <Input
                                    value={section.data.address || ''}
                                    onChange={(e) => handleSectionDataUpdate(section.id, 'address', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Phone</Label>
                                  <Input
                                    value={section.data.phone || ''}
                                    onChange={(e) => handleSectionDataUpdate(section.id, 'phone', e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label>Email</Label>
                                  <Input
                                    value={section.data.email || ''}
                                    onChange={(e) => handleSectionDataUpdate(section.id, 'email', e.target.value)}
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  )
                })}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
