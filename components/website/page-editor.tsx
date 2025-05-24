"use client"

import React, { useState } from 'react'
import { useWebsitePage } from '@/hooks/useWebsiteData'
import { WebsitePage, PageSection } from '@/types/website.types'
import { DyraneButton } from '@/components/dyrane-ui/dyrane-button'
import { DyraneCard } from '@/components/dyrane-ui/dyrane-card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save, 
  Eye, 
  Settings, 
  Layout,
  Plus,
  Trash2,
  GripVertical,
  AlertTriangle,
  Globe,
  Search
} from 'lucide-react'
import { toast } from 'sonner'

interface PageEditorProps {
  pageId: string
  onSave?: (page: WebsitePage) => void
  onPreview?: (page: WebsitePage) => void
  className?: string
}

/**
 * Page Editor component for editing website pages
 * Provides tabs for content, sections, and SEO settings
 */
export function PageEditor({ 
  pageId, 
  onSave, 
  onPreview,
  className 
}: PageEditorProps) {
  const {
    page,
    loading,
    error,
    updateCurrentPage,
    clearPageError
  } = useWebsitePage(pageId)

  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('content')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'draft' as 'published' | 'draft',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  })

  // Update form data when page loads
  React.useEffect(() => {
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        status: page.status,
        metaTitle: page.metaTitle || '',
        metaDescription: page.metaDescription || '',
        metaKeywords: page.metaKeywords || ''
      })
    }
  }, [page])

  // Handle form field changes
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle save
  const handleSave = async () => {
    if (!page) return

    setSaving(true)
    try {
      await updateCurrentPage(formData)
      toast.success('Page saved successfully')
      if (onSave && page) {
        onSave({ ...page, ...formData })
      }
    } catch (error) {
      toast.error('Failed to save page')
    } finally {
      setSaving(false)
    }
  }

  // Handle preview
  const handlePreview = () => {
    if (page && onPreview) {
      onPreview({ ...page, ...formData })
    }
  }

  // Handle section toggle
  const handleSectionToggle = async (sectionId: string, enabled: boolean) => {
    if (!page) return

    const updatedSections = page.sections.map(section =>
      section.id === sectionId ? { ...section, enabled } : section
    )

    try {
      await updateCurrentPage({ sections: updatedSections })
      toast.success('Section updated')
    } catch (error) {
      toast.error('Failed to update section')
    }
  }

  if (loading) {
    return (
      <div className={className}>
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-64 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={className}>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <DyraneButton 
              variant="ghost" 
              size="sm" 
              onClick={clearPageError}
              className="ml-2"
            >
              Retry
            </DyraneButton>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!page) {
    return (
      <div className={className}>
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">Page Not Found</h3>
          <p className="text-muted-foreground">
            The requested page could not be found.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{page.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
              {page.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Last updated: {new Date(page.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DyraneButton variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </DyraneButton>
          <DyraneButton onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </DyraneButton>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">
            <Settings className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="sections">
            <Layout className="h-4 w-4 mr-2" />
            Sections
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6">
          <DyraneCard className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Page Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleFieldChange('title', e.target.value)}
                  placeholder="Enter page title"
                />
              </div>

              <div>
                <Label htmlFor="slug">Page Slug</Label>
                <div className="flex items-center">
                  <span className="text-sm text-muted-foreground mr-2">
                    {window.location.origin}
                  </span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleFieldChange('slug', e.target.value)}
                    placeholder="/page-url"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  The URL path for this page
                </p>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch
                    id="status"
                    checked={formData.status === 'published'}
                    onCheckedChange={(checked) => 
                      handleFieldChange('status', checked ? 'published' : 'draft')
                    }
                  />
                  <Label htmlFor="status">
                    {formData.status === 'published' ? 'Published' : 'Draft'}
                  </Label>
                </div>
              </div>
            </div>
          </DyraneCard>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Page Sections</h3>
            <DyraneButton size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </DyraneButton>
          </div>

          <div className="space-y-4">
            {page.sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onToggle={(enabled) => handleSectionToggle(section.id, enabled)}
                />
              ))}
          </div>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6">
          <DyraneCard className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => handleFieldChange('metaTitle', e.target.value)}
                  placeholder="SEO title for search engines"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.metaTitle.length}/60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => handleFieldChange('metaDescription', e.target.value)}
                  placeholder="Brief description for search engines"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) => handleFieldChange('metaKeywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate keywords with commas
                </p>
              </div>

              {/* SEO Preview */}
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Search Engine Preview</h4>
                <div className="space-y-1">
                  <div className="text-blue-600 text-lg">
                    {formData.metaTitle || formData.title}
                  </div>
                  <div className="text-green-600 text-sm">
                    {window.location.origin}{formData.slug}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {formData.metaDescription || 'No description available'}
                  </div>
                </div>
              </div>
            </div>
          </DyraneCard>
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * Individual section card component
 */
interface SectionCardProps {
  section: PageSection
  onToggle: (enabled: boolean) => void
}

function SectionCard({ section, onToggle }: SectionCardProps) {
  return (
    <DyraneCard className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
          <div>
            <h4 className="font-medium">{section.name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {section.type}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Order: {section.order}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={section.enabled}
            onCheckedChange={onToggle}
          />
          <DyraneButton variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </DyraneButton>
          <DyraneButton variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </DyraneButton>
        </div>
      </div>
    </DyraneCard>
  )
}
