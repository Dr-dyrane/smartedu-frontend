import { NextRequest, NextResponse } from 'next/server'
import { 
  isCMSEnabled, 
  isCMSDebugMode, 
  shouldUseMockData,
  getEnvironmentInfo,
  validateCMSEnvironment
} from '@/lib/env/website-cms'
import { getMockWebsiteStats } from '@/data/mock/website-cms-mock'

/**
 * GET /api/website/health
 * Health check endpoint for Website CMS
 */
export async function GET(request: NextRequest) {
  try {
    const envValidation = validateCMSEnvironment()
    const stats = getMockWebsiteStats()
    const envInfo = getEnvironmentInfo()

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      cms: {
        enabled: isCMSEnabled(),
        debugMode: isCMSDebugMode(),
        mockData: shouldUseMockData(),
        environment: envInfo.environment
      },
      validation: {
        isValid: envValidation.valid,
        errors: envValidation.errors
      },
      stats: {
        pages: stats.totalPages,
        publishedPages: stats.publishedPages,
        draftPages: stats.draftPages,
        mediaFiles: stats.mediaFiles,
        totalSections: stats.totalSections
      },
      features: {
        pagesAPI: true,
        mediaAPI: true,
        settingsAPI: true,
        fileUpload: shouldUseMockData() ? 'mock' : 'not_implemented'
      }
    }

    // Determine overall health status
    let status = 200
    if (!isCMSEnabled()) {
      healthData.status = 'disabled'
      status = 503
    } else if (!envValidation.valid) {
      healthData.status = 'degraded'
      status = 500
    }

    return NextResponse.json(healthData, { status })

  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * OPTIONS /api/website/health
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
