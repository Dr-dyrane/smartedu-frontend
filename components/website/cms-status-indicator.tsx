"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { isCMSEnabled, isCMSDebugMode } from '@/lib/env/website-cms'
import { Settings, Eye, AlertTriangle } from 'lucide-react'

interface CMSStatusIndicatorProps {
  isUsingDynamicContent?: boolean
  className?: string
}

/**
 * CMS Status Indicator Component
 * Shows the current CMS status and content source
 * Only visible in debug mode or for admin users
 */
export function CMSStatusIndicator({ 
  isUsingDynamicContent = false, 
  className 
}: CMSStatusIndicatorProps) {
  const cmsEnabled = isCMSEnabled()
  const debugMode = isCMSDebugMode()

  // Only show in debug mode
  if (!debugMode) {
    return null
  }

  const getStatusInfo = () => {
    if (!cmsEnabled) {
      return {
        label: 'CMS Disabled',
        variant: 'secondary' as const,
        icon: <AlertTriangle className="h-3 w-3" />,
        description: 'Using static content'
      }
    }

    if (isUsingDynamicContent) {
      return {
        label: 'Dynamic Content',
        variant: 'default' as const,
        icon: <Settings className="h-3 w-3" />,
        description: 'Content from CMS'
      }
    }

    return {
      label: 'Static Fallback',
      variant: 'outline' as const,
      icon: <Eye className="h-3 w-3" />,
      description: 'No CMS data available'
    }
  }

  const status = getStatusInfo()

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <Badge 
        variant={status.variant}
        className="flex items-center gap-1 px-2 py-1 text-xs"
      >
        {status.icon}
        {status.label}
      </Badge>
    </div>
  )
}
