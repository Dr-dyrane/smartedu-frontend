"use client"

import { useEffect, useState } from 'react'
import { PageSection } from "@/types/website.types"
import { DynamicSectionRenderer } from "@/components/website/dynamic-section-renderer"
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Shield, FileText, Cookie, Lock, Scale, HelpCircle } from 'lucide-react'

interface CMSPageRendererProps {
  pageType: 'privacy-policy' | 'terms-conditions' | 'cookies-policy' | 'data-protection-policy' | 'help-support'
  fallbackContent?: React.ReactNode
}

const pageIcons = {
  'privacy-policy': Shield,
  'terms-conditions': Scale,
  'cookies-policy': Cookie,
  'data-protection-policy': Lock,
  'help-support': HelpCircle
}

const pageTitles = {
  'privacy-policy': 'Privacy Policy',
  'terms-conditions': 'Terms & Conditions',
  'cookies-policy': 'Cookies Policy',
  'data-protection-policy': 'Data Protection Policy',
  'help-support': 'Help & Support'
}

export function CMSPageRenderer({ pageType, fallbackContent }: CMSPageRendererProps) {
  const [sections, setSections] = useState<PageSection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if CMS is enabled
  const cmsEnabled = process.env.NEXT_PUBLIC_CMS_ENABLED === 'true'

  useEffect(() => {
    if (!cmsEnabled) {
      setLoading(false)
      return
    }

    const fetchPageData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/cms/pages/${pageType}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch page data: ${response.statusText}`)
        }
        
        const data = await response.json()
        setSections(data.sections || [])
      } catch (err) {
        console.error(`Error fetching ${pageType} page:`, err)
        setError(err instanceof Error ? err.message : 'Failed to load page')
      } finally {
        setLoading(false)
      }
    }

    fetchPageData()
  }, [pageType, cmsEnabled])

  // If CMS is disabled, show fallback content
  if (!cmsEnabled) {
    return (
      <div className="container mx-auto px-4 py-8">
        {fallbackContent}
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading page content...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Error Loading Page</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          {fallbackContent && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-4">Showing fallback content:</p>
              {fallbackContent}
            </div>
          )}
        </Card>
      </div>
    )
  }

  // No sections found
  if (!sections.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-4">No content sections found for this page.</p>
          {fallbackContent && (
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-4">Showing fallback content:</p>
              {fallbackContent}
            </div>
          )}
        </Card>
      </div>
    )
  }

  const Icon = pageIcons[pageType]
  const title = pageTitles[pageType]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <Icon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-center">{title}</h1>
      </div>

      {/* CMS Content */}
      <DynamicSectionRenderer sections={sections} />
    </div>
  )
}
