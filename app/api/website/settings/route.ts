import { NextRequest, NextResponse } from 'next/server'
import { 
  WebsiteSettings, 
  WebsiteSettingsResponse 
} from '@/types/website.types'
import { mockWebsiteSettings } from '@/data/mock/website-cms-mock'
import { shouldUseMockData, isCMSEnabled } from '@/lib/env/website-cms'

// In-memory storage for mock settings (in real app, this would be in database)
let currentSettings = { ...mockWebsiteSettings }

/**
 * GET /api/website/settings
 * Retrieve website global settings
 */
export async function GET(request: NextRequest): Promise<NextResponse<WebsiteSettingsResponse>> {
  try {
    // Check if CMS is enabled
    if (!isCMSEnabled()) {
      return NextResponse.json({
        success: false,
        message: 'Website CMS is currently disabled'
      }, { status: 503 })
    }

    let settings: WebsiteSettings

    if (shouldUseMockData()) {
      // Use mock settings
      settings = currentSettings
    } else {
      // TODO: Replace with actual database call
      // settings = await databaseService.getWebsiteSettings()
      
      // For now, fallback to mock data
      settings = currentSettings
    }

    return NextResponse.json({
      success: true,
      data: settings
    })

  } catch (error) {
    console.error('Error fetching website settings:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch website settings'
    }, { status: 500 })
  }
}

/**
 * PUT /api/website/settings
 * Update website global settings
 */
export async function PUT(request: NextRequest): Promise<NextResponse<WebsiteSettingsResponse>> {
  try {
    // Check if CMS is enabled
    if (!isCMSEnabled()) {
      return NextResponse.json({
        success: false,
        message: 'Website CMS is currently disabled'
      }, { status: 503 })
    }

    const body: Partial<WebsiteSettings> = await request.json()

    // Validate required fields if they're being updated
    if (body.siteName !== undefined && !body.siteName.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Site name is required'
      }, { status: 400 })
    }

    if (body.contactEmail !== undefined && body.contactEmail && !isValidEmail(body.contactEmail)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email format'
      }, { status: 400 })
    }

    if (body.siteUrl !== undefined && body.siteUrl && !isValidUrl(body.siteUrl)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid URL format'
      }, { status: 400 })
    }

    // Validate color formats if appearance settings are being updated
    if (body.appearance?.primaryColor && !isValidColor(body.appearance.primaryColor)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid primary color format'
      }, { status: 400 })
    }

    if (body.appearance?.secondaryColor && !isValidColor(body.appearance.secondaryColor)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid secondary color format'
      }, { status: 400 })
    }

    if (shouldUseMockData()) {
      // Update mock settings
      currentSettings = {
        ...currentSettings,
        ...body,
        // Deep merge nested objects
        socialMedia: body.socialMedia ? { ...currentSettings.socialMedia, ...body.socialMedia } : currentSettings.socialMedia,
        features: body.features ? { ...currentSettings.features, ...body.features } : currentSettings.features,
        appearance: body.appearance ? { ...currentSettings.appearance, ...body.appearance } : currentSettings.appearance,
        analytics: body.analytics ? { ...currentSettings.analytics, ...body.analytics } : currentSettings.analytics
      }

      return NextResponse.json({
        success: true,
        data: currentSettings,
        message: 'Settings updated successfully'
      })

    } else {
      // TODO: Replace with actual database call
      // const updatedSettings = await databaseService.updateWebsiteSettings(body)
      
      return NextResponse.json({
        success: false,
        message: 'Database integration not yet implemented'
      }, { status: 501 })
    }

  } catch (error) {
    console.error('Error updating website settings:', error)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in request body'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update website settings'
    }, { status: 500 })
  }
}

/**
 * Utility functions for validation
 */

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function isValidColor(color: string): boolean {
  // Check for hex color format (#RRGGBB or #RGB)
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  
  // Check for rgb/rgba format
  const rgbRegex = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+)?\s*\)$/
  
  // Check for hsl/hsla format
  const hslRegex = /^hsla?\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(,\s*[\d.]+)?\s*\)$/
  
  return hexRegex.test(color) || rgbRegex.test(color) || hslRegex.test(color)
}

/**
 * OPTIONS /api/website/settings
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
