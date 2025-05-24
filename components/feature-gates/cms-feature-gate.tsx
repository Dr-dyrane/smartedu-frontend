"use client"

import React from 'react'
import { useAppSelector } from '@/store/hooks'
import { 
  isCMSEnabled, 
  websiteCMSConfig, 
  getUnavailabilityMessage,
  type FeatureUnavailableReason,
  type CMSAvailabilityStatus 
} from '@/lib/env/website-cms'
import { DyraneCard } from '@/components/dyrane-ui/dyrane-card'
import { DyraneButton } from '@/components/dyrane-ui/dyrane-button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Lock, 
  Crown, 
  AlertTriangle, 
  Settings, 
  Zap,
  ArrowRight,
  Info
} from 'lucide-react'

interface CMSFeatureGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiresTier?: 'basic' | 'premium'
  feature?: string
  showUpgradePrompt?: boolean
  className?: string
}

/**
 * Feature gate component that controls access to CMS features
 * based on environment configuration, user tier, and permissions
 */
export function CMSFeatureGate({ 
  children, 
  fallback, 
  requiresTier = 'premium',
  feature = 'Website CMS',
  showUpgradePrompt = true,
  className 
}: CMSFeatureGateProps) {
  const { user } = useAppSelector((state) => state.auth)
  const availability = useCMSAvailability(requiresTier)
  
  // If feature is available, render children
  if (availability.isAvailable) {
    return <>{children}</>
  }
  
  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>
  }
  
  // Default fallback based on unavailability reason
  return (
    <div className={className}>
      <CMSUnavailableNotice 
        availability={availability}
        feature={feature}
        showUpgradePrompt={showUpgradePrompt}
      />
    </div>
  )
}

/**
 * Hook to check CMS feature availability
 */
export function useCMSAvailability(requiresTier: 'basic' | 'premium' = 'premium'): CMSAvailabilityStatus {
  const { user } = useAppSelector((state) => state.auth)
  
  // Check if CMS is enabled via environment
  if (!isCMSEnabled()) {
    return {
      isAvailable: false,
      reason: 'disabled',
      message: getUnavailabilityMessage('disabled')
    }
  }
  
  // Check if user is authenticated and is admin
  if (!user || user.role !== 'admin') {
    return {
      isAvailable: false,
      reason: 'permission',
      message: getUnavailabilityMessage('permission')
    }
  }
  
  // Check user tier (for future subscription system)
  const hasRequiredTier = checkUserTier(user, requiresTier)
  if (!hasRequiredTier) {
    return {
      isAvailable: false,
      reason: 'tier',
      message: getUnavailabilityMessage('tier'),
      upgradeRequired: true
    }
  }
  
  // All checks passed
  return {
    isAvailable: true,
    reason: 'available'
  }
}

/**
 * Check if user has required tier
 * Currently returns true for all admins, but can be extended for subscription system
 */
function checkUserTier(user: any, requiredTier: 'basic' | 'premium'): boolean {
  // For now, all admin users have premium access
  // This can be extended when subscription system is implemented
  if (user.role === 'admin') {
    return true
  }
  
  // Future implementation would check user.subscription.tier
  // const tierHierarchy = { basic: 1, premium: 2 }
  // return tierHierarchy[user.subscription?.tier || 'basic'] >= tierHierarchy[requiredTier]
  
  return false
}

/**
 * Notice component shown when CMS features are unavailable
 */
interface CMSUnavailableNoticeProps {
  availability: CMSAvailabilityStatus
  feature: string
  showUpgradePrompt: boolean
}

function CMSUnavailableNotice({ 
  availability, 
  feature, 
  showUpgradePrompt 
}: CMSUnavailableNoticeProps) {
  const getIcon = () => {
    switch (availability.reason) {
      case 'disabled':
        return <Settings className="h-6 w-6" />
      case 'tier':
        return <Crown className="h-6 w-6" />
      case 'permission':
        return <Lock className="h-6 w-6" />
      case 'maintenance':
        return <AlertTriangle className="h-6 w-6" />
      default:
        return <Info className="h-6 w-6" />
    }
  }
  
  const getVariant = () => {
    switch (availability.reason) {
      case 'disabled':
      case 'maintenance':
        return 'destructive' as const
      case 'tier':
        return 'default' as const
      case 'permission':
        return 'secondary' as const
      default:
        return 'default' as const
    }
  }
  
  return (
    <DyraneCard className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        {/* Icon */}
        <div className={`p-3 rounded-full ${
          availability.reason === 'tier' ? 'bg-primary/10 text-primary' :
          availability.reason === 'disabled' ? 'bg-destructive/10 text-destructive' :
          'bg-muted text-muted-foreground'
        }`}>
          {getIcon()}
        </div>
        
        {/* Title */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {availability.reason === 'tier' ? `${feature} - Premium Feature` :
             availability.reason === 'disabled' ? `${feature} - Currently Disabled` :
             availability.reason === 'permission' ? `${feature} - Access Restricted` :
             `${feature} - Unavailable`}
          </h3>
          
          {/* Status Badge */}
          <Badge variant={getVariant()} className="mx-auto">
            {availability.reason === 'tier' ? 'Premium Required' :
             availability.reason === 'disabled' ? 'Disabled' :
             availability.reason === 'permission' ? 'Admin Only' :
             availability.reason === 'maintenance' ? 'Maintenance' :
             'Unavailable'}
          </Badge>
        </div>
        
        {/* Message */}
        <p className="text-muted-foreground max-w-md">
          {availability.message}
        </p>
        
        {/* Upgrade Prompt for Tier Issues */}
        {availability.reason === 'tier' && showUpgradePrompt && (
          <div className="space-y-4 pt-4">
            <Alert>
              <Zap className="h-4 w-4" />
              <AlertDescription>
                Unlock powerful content management features with our premium plan. 
                Edit your website content, manage media files, and customize your site 
                without any technical knowledge required.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <DyraneButton>
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Premium
                <ArrowRight className="ml-2 h-4 w-4" />
              </DyraneButton>
              <DyraneButton variant="outline">
                Learn More
              </DyraneButton>
            </div>
          </div>
        )}
        
        {/* Contact Support for Other Issues */}
        {availability.reason !== 'tier' && (
          <div className="pt-4">
            <DyraneButton variant="outline">
              Contact Support
            </DyraneButton>
          </div>
        )}
        
        {/* Debug Information (Development Only) */}
        {websiteCMSConfig.debug && (
          <details className="mt-4 text-left w-full">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Debug Information
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {JSON.stringify({
                cmsEnabled: isCMSEnabled(),
                reason: availability.reason,
                tier: websiteCMSConfig.tier,
                debug: websiteCMSConfig.debug,
                mockData: websiteCMSConfig.mockData
              }, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </DyraneCard>
  )
}

/**
 * Simplified component for inline feature unavailable messages
 */
interface CMSFeatureUnavailableProps {
  reason: FeatureUnavailableReason
  feature?: string
  compact?: boolean
}

export function CMSFeatureUnavailable({ 
  reason, 
  feature = 'This feature', 
  compact = false 
}: CMSFeatureUnavailableProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        <span>{feature} requires premium access</span>
      </div>
    )
  }
  
  return (
    <Alert>
      <Lock className="h-4 w-4" />
      <AlertDescription>
        {getUnavailabilityMessage(reason)}
      </AlertDescription>
    </Alert>
  )
}

/**
 * HOC for wrapping components with CMS feature gate
 */
export function withCMSFeatureGate<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    requiresTier?: 'basic' | 'premium'
    feature?: string
    fallback?: React.ComponentType
  } = {}
) {
  const WrappedComponent = (props: P) => {
    return (
      <CMSFeatureGate
        requiresTier={options.requiresTier}
        feature={options.feature}
        fallback={options.fallback ? <options.fallback /> : undefined}
      >
        <Component {...props} />
      </CMSFeatureGate>
    )
  }
  
  WrappedComponent.displayName = `withCMSFeatureGate(${Component.displayName || Component.name})`
  
  return WrappedComponent
}
