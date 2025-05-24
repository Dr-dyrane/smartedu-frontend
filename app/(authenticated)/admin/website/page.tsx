"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DyraneButton } from "@/components/dyrane-ui/dyrane-button"
import { PageHeader } from "@/components/layout/page-header"
import { CMSFeatureGate } from "@/components/feature-gates/cms-feature-gate"
import { WebsiteStats } from "@/components/website/website-stats"
import { CMSFeatureAnnouncement, CMSStatusAlert } from "@/components/website/cms-feature-announcement"
import { CMSOnboarding } from "@/components/website/cms-onboarding"
import { useWebsitePages } from "@/hooks/useWebsiteData"
import {
  Globe,
  FileText,
  Image as ImageIcon,
  Settings,
  Eye,
  Edit3,
  Plus,
  Layout,
  Upload,
  AlertTriangle,
  HelpCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function WebsiteManagementPage() {
  const { pages, loading, error, loadPages } = useWebsitePages()
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)

  // Load pages on mount
  useEffect(() => {
    loadPages({ limit: 5 }) // Load recent pages
  }, [])

  // Check if user should see onboarding or announcement
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('cms-onboarding-completed')
    const announcementDismissed = localStorage.getItem('cms-announcement-dismissed')

    if (!onboardingCompleted) {
      setShowOnboarding(true)
    } else if (!announcementDismissed) {
      setShowAnnouncement(true)
    }
  }, [])

  const quickActions = [
    {
      title: "Edit Landing Page",
      description: "Modify hero section, features, and content",
      icon: Edit3,
      href: "/admin/website/pages/landing",
      color: "bg-blue-500"
    },
    {
      title: "Manage Pages",
      description: "Create and edit website pages",
      icon: FileText,
      href: "/admin/website/pages",
      color: "bg-green-500"
    },
    {
      title: "Media Library",
      description: "Upload and organize images and videos",
      icon: Upload,
      href: "/admin/website/media",
      color: "bg-purple-500"
    },
    {
      title: "Website Settings",
      description: "Global settings and configurations",
      icon: Settings,
      href: "/admin/website/settings",
      color: "bg-orange-500"
    },
    {
      title: "Help & Documentation",
      description: "Learn how to use the CMS effectively",
      icon: HelpCircle,
      href: "/admin/website/help",
      color: "bg-gray-500"
    }
  ]

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`

    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`

    return date.toLocaleDateString()
  }

  return (
    <CMSFeatureGate>
      <div className="space-y-6">
        {/* Feature Announcement */}
        {showAnnouncement && (
          <CMSFeatureAnnouncement
            variant="banner"
            onDismiss={() => setShowAnnouncement(false)}
          />
        )}

        {/* CMS Status Alert */}
        <CMSStatusAlert />
        <PageHeader
          heading="Website Management"
          subheading="Manage your public website content, pages, and media"
          actions={
            <div className="flex gap-2">
              <DyraneButton variant="outline" asChild>
                <Link href="/" target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Site
                </Link>
              </DyraneButton>
              <DyraneButton asChild>
                <Link href="/admin/website/pages/new">
                  <Plus className="mr-2 h-4 w-4" />
                  New Page
                </Link>
              </DyraneButton>
            </div>
          }
        />

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <DyraneButton
                variant="ghost"
                size="sm"
                onClick={() => loadPages({ limit: 5 })}
                className="ml-2"
              >
                Retry
              </DyraneButton>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <WebsiteStats />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card key={action.title} className="p-6 hover:shadow-md transition-shadow">
                <Link href={action.href} className="block">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </Card>
            )
          })}
        </div>

        {/* Recent Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Pages</CardTitle>
            <CardDescription>Recently modified website pages</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-5 w-5" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Pages Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first page to get started with the CMS
                </p>
                <DyraneButton asChild>
                  <Link href="/admin/website/pages/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Page
                  </Link>
                </DyraneButton>
              </div>
            ) : (
              <div className="space-y-4">
                {pages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{page.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {page.sections.length} sections • Last modified {formatRelativeTime(page.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                        {page.status}
                      </Badge>
                      <DyraneButton variant="outline" size="sm" asChild>
                        <Link href={`/admin/website/pages/${page.id}`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </DyraneButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Onboarding Modal */}
        {showOnboarding && (
          <CMSOnboarding
            onComplete={() => setShowOnboarding(false)}
            onSkip={() => setShowOnboarding(false)}
          />
        )}
      </div>
    </CMSFeatureGate>
  )
}
