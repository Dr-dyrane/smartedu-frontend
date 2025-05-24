import { NextRequest, NextResponse } from 'next/server'
import {
  WebsitePage,
  UpdatePageRequest,
  WebsitePageResponse
} from '@/types/website.types'
import {
  getMockPage,
  mockWebsitePages
} from '@/data/mock/website-cms-mock'
import { shouldUseMockData, isCMSEnabled } from '@/lib/env/website-cms'

/**
 * GET /api/website/pages/[id]
 * Retrieve a specific website page by ID or slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<WebsitePageResponse>> {
  try {
    // Check if CMS is enabled
    if (!isCMSEnabled()) {
      return NextResponse.json({
        success: false,
        message: 'Website CMS is currently disabled'
      }, { status: 503 })
    }

    const pageId = params.id

    if (!pageId) {
      return NextResponse.json({
        success: false,
        message: 'Page ID is required'
      }, { status: 400 })
    }

    let page: WebsitePage | undefined

    if (shouldUseMockData()) {
      // Use centralized mock data
      page = getMockPage(pageId)
    } else {
      // TODO: Replace with actual database call
      // page = await databaseService.getPageById(pageId)

      // For now, fallback to mock data
      page = getMockPage(pageId)
    }

    if (!page) {
      return NextResponse.json({
        success: false,
        message: 'Page not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: page
    })

  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch page'
    }, { status: 500 })
  }
}

/**
 * PUT /api/website/pages/[id]
 * Update a specific website page
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<WebsitePageResponse>> {
  try {
    // Check if CMS is enabled
    if (!isCMSEnabled()) {
      return NextResponse.json({
        success: false,
        message: 'Website CMS is currently disabled'
      }, { status: 503 })
    }

    const pageId = params.id
    const body: UpdatePageRequest = await request.json()

    if (!pageId) {
      return NextResponse.json({
        success: false,
        message: 'Page ID is required'
      }, { status: 400 })
    }

    if (shouldUseMockData()) {
      // Find page by ID in mock data
      const pageIndex = mockWebsitePages.findIndex(p => p.id === pageId)

      if (pageIndex === -1) {
        return NextResponse.json({
          success: false,
          message: 'Page not found'
        }, { status: 404 })
      }

      // If updating slug, check for conflicts
      if (body.slug && body.slug !== mockWebsitePages[pageIndex].slug) {
        const existingPage = mockWebsitePages.find(p => p.slug === body.slug && p.id !== pageId)
        if (existingPage) {
          return NextResponse.json({
            success: false,
            message: 'A page with this slug already exists'
          }, { status: 409 })
        }

        // Validate slug format
        const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
        if (body.slug !== '/' && !slugRegex.test(body.slug.replace(/^\//, ''))) {
          return NextResponse.json({
            success: false,
            message: 'Slug must contain only lowercase letters, numbers, and hyphens'
          }, { status: 400 })
        }
      }

      // Update page in mock data
      const updatedPage: WebsitePage = {
        ...mockWebsitePages[pageIndex],
        ...body,
        updatedAt: new Date().toISOString()
      }

      mockWebsitePages[pageIndex] = updatedPage

      return NextResponse.json({
        success: true,
        data: updatedPage,
        message: 'Page updated successfully'
      })

    } else {
      // TODO: Replace with actual database call
      // const updatedPage = await databaseService.updatePage(pageId, body)

      return NextResponse.json({
        success: false,
        message: 'Database integration not yet implemented'
      }, { status: 501 })
    }

  } catch (error) {
    console.error('Error updating page:', error)

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON in request body'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to update page'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/website/pages/[id]
 * Delete a specific website page
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<WebsitePageResponse>> {
  try {
    // Check if CMS is enabled
    if (!isCMSEnabled()) {
      return NextResponse.json({
        success: false,
        message: 'Website CMS is currently disabled'
      }, { status: 503 })
    }

    const pageId = params.id

    if (!pageId) {
      return NextResponse.json({
        success: false,
        message: 'Page ID is required'
      }, { status: 400 })
    }

    if (shouldUseMockData()) {
      // Find page by ID in mock data
      const pageIndex = mockWebsitePages.findIndex(p => p.id === pageId)

      if (pageIndex === -1) {
        return NextResponse.json({
          success: false,
          message: 'Page not found'
        }, { status: 404 })
      }

      // Prevent deletion of landing page
      if (mockWebsitePages[pageIndex].slug === '/') {
        return NextResponse.json({
          success: false,
          message: 'Cannot delete the landing page'
        }, { status: 400 })
      }

      // Remove page from mock data
      const deletedPage = mockWebsitePages.splice(pageIndex, 1)[0]

      return NextResponse.json({
        success: true,
        data: deletedPage,
        message: 'Page deleted successfully'
      })

    } else {
      // TODO: Replace with actual database call
      // const deletedPage = await databaseService.deletePage(pageId)

      return NextResponse.json({
        success: false,
        message: 'Database integration not yet implemented'
      }, { status: 501 })
    }

  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete page'
    }, { status: 500 })
  }
}
