import { NextRequest, NextResponse } from 'next/server'
import {
  WebsitePage,
  CreatePageRequest,
  WebsitePagesResponse,
  WebsitePageResponse
} from '@/types/website.types'
import {
  getMockPages,
  mockWebsitePages
} from '@/data/mock/website-cms-mock'
import { shouldUseMockData, isCMSEnabled } from '@/lib/env/website-cms'

// All mock data is now centralized in /data/mock/website-cms-mock.ts

/**
 * GET /api/website/pages
 * Retrieve website pages with filtering and pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse<WebsitePagesResponse>> {
  try {
    // Check if CMS is enabled
    if (!isCMSEnabled()) {
      return NextResponse.json({
        success: false,
        message: 'Website CMS is currently disabled'
      }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') as 'published' | 'draft' | undefined
    const search = searchParams.get('search') || undefined

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({
        success: false,
        message: 'Invalid pagination parameters'
      }, { status: 400 })
    }

    let result

    if (shouldUseMockData()) {
      // Use centralized mock data
      result = getMockPages({ status, page, limit, search })
    } else {
      // TODO: Replace with actual database call
      // const result = await databaseService.getPages({ status, page, limit, search })

      // For now, fallback to mock data
      result = getMockPages({ status, page, limit, search })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })

  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch pages'
    }, { status: 500 })
  }
}

/**
 * POST /api/website/pages
 * Create a new website page
 */
export async function POST(request: NextRequest): Promise<NextResponse<WebsitePageResponse>> {
  try {
    // Check if CMS is enabled
    if (!isCMSEnabled()) {
      return NextResponse.json({
        success: false,
        message: 'Website CMS is currently disabled'
      }, { status: 503 })
    }

    const body: CreatePageRequest = await request.json()

    // Validate required fields
    if (!body.title || !body.slug) {
      return NextResponse.json({
        success: false,
        message: 'Title and slug are required'
      }, { status: 400 })
    }

    // Validate slug format
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (body.slug !== '/' && !slugRegex.test(body.slug.replace(/^\//, ''))) {
      return NextResponse.json({
        success: false,
        message: 'Slug must contain only lowercase letters, numbers, and hyphens'
      }, { status: 400 })
    }

    if (shouldUseMockData()) {
      // Check if slug already exists in mock data
      const existingPage = mockWebsitePages.find(p => p.slug === body.slug)
      if (existingPage) {
        return NextResponse.json({
          success: false,
          message: 'A page with this slug already exists'
        }, { status: 409 })
      }

      // Create new page with mock data
      const newPage: WebsitePage = {
        id: `page-${Date.now()}`,
        title: body.title,
        slug: body.slug,
        status: body.status || 'draft',
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        metaKeywords: body.metaKeywords,
        sections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: "Admin", // TODO: Get from authenticated user
        views: 0
      }

      // Add to mock data (in real app, save to database)
      mockWebsitePages.push(newPage)

      return NextResponse.json({
        success: true,
        data: newPage,
        message: 'Page created successfully'
      }, { status: 201 })

    } else {
      // TODO: Replace with actual database call
      // const newPage = await databaseService.createPage(body)

      // For now, fallback to mock implementation
      return NextResponse.json({
        success: false,
        message: 'Database integration not yet implemented'
      }, { status: 501 })
    }

  } catch (error) {
    console.error('Error creating page:', error)

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in request body'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create page'
    }, { status: 500 })
  }
}
