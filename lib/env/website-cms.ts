// Website CMS Environment Configuration
// This file handles all environment-based configuration for the CMS feature

/**
 * Website CMS Configuration
 * Centralized configuration for all CMS-related environment variables
 */
export const websiteCMSConfig = {
  // Feature Control
  enabled: process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED === 'true',
  tier: (process.env.NEXT_PUBLIC_WEBSITE_CMS_TIER as 'basic' | 'premium') || 'premium',
  debug: process.env.NEXT_PUBLIC_WEBSITE_CMS_DEBUG === 'true',
  mockData: process.env.NEXT_PUBLIC_WEBSITE_CMS_MOCK_DATA === 'true',

  // API Configuration
  apiBaseUrl: process.env.NEXT_PUBLIC_WEBSITE_CMS_API_BASE_URL || '/api/website',
  uploadMaxSize: parseInt(process.env.NEXT_PUBLIC_WEBSITE_CMS_UPLOAD_MAX_SIZE || '10485760'), // 10MB default
  allowedTypes: process.env.NEXT_PUBLIC_WEBSITE_CMS_ALLOWED_TYPES?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'text/plain'
  ],

  // Cache Configuration
  cache: {
    enabled: process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLE_CACHE !== 'false', // Default to true
    ttl: parseInt(process.env.NEXT_PUBLIC_WEBSITE_CMS_CACHE_TTL || '3600'), // 1 hour default
    maxSize: parseInt(process.env.NEXT_PUBLIC_WEBSITE_CMS_CACHE_MAX_SIZE || '100') // Max cached items
  },

  // Performance Settings
  performance: {
    maxConcurrentUploads: parseInt(process.env.NEXT_PUBLIC_WEBSITE_CMS_MAX_CONCURRENT_UPLOADS || '3'),
    apiTimeout: parseInt(process.env.NEXT_PUBLIC_WEBSITE_CMS_API_TIMEOUT || '30000'), // 30 seconds
    retryAttempts: parseInt(process.env.NEXT_PUBLIC_WEBSITE_CMS_RETRY_ATTEMPTS || '3')
  }
} as const

/**
 * Quick access functions for common checks
 */
export const isCMSEnabled = (): boolean => websiteCMSConfig.enabled

export const isCMSDebugMode = (): boolean => websiteCMSConfig.debug

export const shouldUseMockData = (): boolean => websiteCMSConfig.mockData

export const getCMSApiUrl = (endpoint: string = ''): string => {
  const baseUrl = websiteCMSConfig.apiBaseUrl
  return endpoint ? `${baseUrl}/${endpoint.replace(/^\//, '')}` : baseUrl
}

/**
 * Validate file upload constraints
 */
export const validateFileUpload = (file: File): { valid: boolean; error?: string } => {
  // Check file size
  if (file.size > websiteCMSConfig.uploadMaxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${formatFileSize(websiteCMSConfig.uploadMaxSize)}`
    }
  }

  // Check file type
  if (!websiteCMSConfig.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${websiteCMSConfig.allowedTypes.join(', ')}`
    }
  }

  return { valid: true }
}

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Get cache key for CMS data
 */
export const getCacheKey = (type: string, id?: string): string => {
  const prefix = 'cms'
  return id ? `${prefix}:${type}:${id}` : `${prefix}:${type}`
}

/**
 * Check if caching is enabled and should be used
 */
export const shouldUseCache = (): boolean => {
  return websiteCMSConfig.cache.enabled && !websiteCMSConfig.debug
}

/**
 * Get environment-specific configuration
 */
export const getEnvironmentInfo = () => {
  return {
    environment: process.env.NODE_ENV || 'development',
    cmsEnabled: websiteCMSConfig.enabled,
    debugMode: websiteCMSConfig.debug,
    mockData: websiteCMSConfig.mockData,
    tier: websiteCMSConfig.tier,
    version: process.env.npm_package_version || '1.0.0'
  }
}

/**
 * Feature availability reasons
 */
export type FeatureUnavailableReason =
  | 'disabled'      // Feature is disabled via environment
  | 'tier'          // User doesn't have required tier
  | 'permission'    // User doesn't have permission
  | 'maintenance'   // Feature is under maintenance
  | 'available'     // Feature is available

/**
 * CMS Feature availability status
 */
export interface CMSAvailabilityStatus {
  isAvailable: boolean
  reason: FeatureUnavailableReason
  message?: string
  upgradeRequired?: boolean
}

/**
 * Default error messages for unavailable features
 */
export const getUnavailabilityMessage = (reason: FeatureUnavailableReason): string => {
  switch (reason) {
    case 'disabled':
      return 'Website CMS is currently disabled. Please contact support for more information.'
    case 'tier':
      return 'Website CMS requires a premium subscription. Upgrade your plan to access this feature.'
    case 'permission':
      return 'You do not have permission to access the Website CMS. Admin access is required.'
    case 'maintenance':
      return 'Website CMS is temporarily unavailable for maintenance. Please try again later.'
    default:
      return 'Website CMS is currently unavailable.'
  }
}

/**
 * Log CMS configuration on startup (debug mode only)
 */
export const logCMSConfiguration = (): void => {
  if (!websiteCMSConfig.debug) return

  console.log('🎨 Website CMS Configuration:', {
    enabled: websiteCMSConfig.enabled,
    tier: websiteCMSConfig.tier,
    debug: websiteCMSConfig.debug,
    mockData: websiteCMSConfig.mockData,
    apiBaseUrl: websiteCMSConfig.apiBaseUrl,
    uploadMaxSize: formatFileSize(websiteCMSConfig.uploadMaxSize),
    allowedTypes: websiteCMSConfig.allowedTypes,
    cache: websiteCMSConfig.cache
  })
}

/**
 * Validate environment configuration
 */
export const validateCMSEnvironment = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Validate upload max size
  if (websiteCMSConfig.uploadMaxSize <= 0) {
    errors.push('WEBSITE_CMS_UPLOAD_MAX_SIZE must be a positive number')
  }

  // Validate cache TTL
  if (websiteCMSConfig.cache.ttl <= 0) {
    errors.push('WEBSITE_CMS_CACHE_TTL must be a positive number')
  }

  // Validate API timeout
  if (websiteCMSConfig.performance.apiTimeout <= 0) {
    errors.push('WEBSITE_CMS_API_TIMEOUT must be a positive number')
  }

  // Validate tier
  if (!['basic', 'premium'].includes(websiteCMSConfig.tier)) {
    errors.push('WEBSITE_CMS_TIER must be either "basic" or "premium"')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Initialize configuration validation and logging
if (typeof window === 'undefined') { // Server-side only
  const validation = validateCMSEnvironment()
  if (!validation.valid) {
    console.error('❌ Website CMS Environment Validation Failed:', validation.errors)
  }

  logCMSConfiguration()
}
