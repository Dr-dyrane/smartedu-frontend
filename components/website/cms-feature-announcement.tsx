"use client"

import React, { useState, useEffect } from 'react'
import { DyraneButton } from '@/components/dyrane-ui/dyrane-button'
import { DyraneCard } from '@/components/dyrane-ui/dyrane-card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Sparkles, 
  Settings, 
  Image, 
  FileText, 
  X, 
  ArrowRight,
  CheckCircle,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { isCMSEnabled } from '@/lib/env/website-cms'

interface CMSFeatureAnnouncementProps {
  variant?: 'banner' | 'modal' | 'card'
  onDismiss?: () => void
  showOnce?: boolean
  className?: string
}

/**
 * CMS Feature Announcement Component
 * Communicates new CMS features to users with different display variants
 */
export function CMSFeatureAnnouncement({ 
  variant = 'banner',
  onDismiss,
  showOnce = true,
  className 
}: CMSFeatureAnnouncementProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const cmsEnabled = isCMSEnabled()

  // Check if user has already dismissed this announcement
  useEffect(() => {
    if (showOnce) {
      const dismissed = localStorage.getItem('cms-announcement-dismissed')
      if (dismissed === 'true') {
        setIsDismissed(true)
      }
    }
  }, [showOnce])

  const handleDismiss = () => {
    setIsDismissed(true)
    if (showOnce) {
      localStorage.setItem('cms-announcement-dismissed', 'true')
    }
    if (onDismiss) {
      onDismiss()
    }
  }

  // Don't show if dismissed or CMS is not enabled
  if (isDismissed || !cmsEnabled) {
    return null
  }

  const features = [
    {
      icon: <FileText className="h-4 w-4" />,
      title: "Dynamic Content Management",
      description: "Edit website content directly from the admin dashboard"
    },
    {
      icon: <Image className="h-4 w-4" />,
      title: "Media Library",
      description: "Upload and organize images, videos, and documents"
    },
    {
      icon: <Settings className="h-4 w-4" />,
      title: "Page Sections",
      description: "Customize page layouts and section visibility"
    }
  ]

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-b ${className}`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  New Feature
                </Badge>
              </div>
              <div className="hidden sm:block">
                <span className="font-medium">Website CMS is now available!</span>
                <span className="text-muted-foreground ml-2">
                  Manage your website content with our new WordPress-like interface.
                </span>
              </div>
              <div className="sm:hidden">
                <span className="font-medium">New CMS Available!</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DyraneButton variant="outline" size="sm" asChild>
                <Link href="/admin/website">
                  <Settings className="h-4 w-4 mr-1" />
                  Try Now
                </Link>
              </DyraneButton>
              <DyraneButton variant="ghost" size="sm" onClick={handleDismiss}>
                <X className="h-4 w-4" />
              </DyraneButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <DyraneCard className="max-w-lg w-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold">Introducing Website CMS</h2>
              </div>
              <DyraneButton variant="ghost" size="sm" onClick={handleDismiss}>
                <X className="h-4 w-4" />
              </DyraneButton>
            </div>

            <p className="text-muted-foreground mb-6">
              We've added a powerful content management system to help you manage your website content more efficiently.
            </p>

            <div className="space-y-3 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <DyraneButton asChild className="flex-1">
                <Link href="/admin/website">
                  <Settings className="h-4 w-4 mr-2" />
                  Explore CMS
                </Link>
              </DyraneButton>
              <DyraneButton variant="outline" onClick={handleDismiss}>
                Maybe Later
              </DyraneButton>
            </div>
          </div>
        </DyraneCard>
      </div>
    )
  }

  // Card variant
  return (
    <DyraneCard className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            New Feature
          </Badge>
        </div>
        <DyraneButton variant="ghost" size="sm" onClick={handleDismiss}>
          <X className="h-4 w-4" />
        </DyraneButton>
      </div>

      <h3 className="text-lg font-semibold mb-2">Website CMS Now Available</h3>
      <p className="text-muted-foreground mb-4">
        Take control of your website content with our new content management system.
      </p>

      <div className="grid grid-cols-1 gap-3 mb-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>{feature.title}</span>
          </div>
        ))}
      </div>

      <DyraneButton asChild className="w-full">
        <Link href="/admin/website">
          Get Started
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </DyraneButton>
    </DyraneCard>
  )
}

/**
 * CMS Status Alert Component
 * Shows current CMS status and any important information
 */
interface CMSStatusAlertProps {
  className?: string
}

export function CMSStatusAlert({ className }: CMSStatusAlertProps) {
  const cmsEnabled = isCMSEnabled()

  if (!cmsEnabled) {
    return (
      <Alert className={className}>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Website CMS is currently disabled. Contact your administrator to enable content management features.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className={`border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20 ${className}`}>
      <CheckCircle className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        Website CMS is active. You can now manage your website content through the admin dashboard.
      </AlertDescription>
    </Alert>
  )
}
