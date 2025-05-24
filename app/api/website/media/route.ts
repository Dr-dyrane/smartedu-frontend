import { NextRequest, NextResponse } from 'next/server'
import { 
  MediaFile, 
  MediaFilesResponse,
  MediaFileResponse 
} from '@/types/website.types'
import { 
  getMockMediaFiles, 
  mockMediaFiles 
} from '@/data/mock/website-cms-mock'
import { shouldUseMockData, isCMSEnabled } from '@/lib/env/website-cms'

/**
 * GET /api/website/media
 * Retrieve media files with filtering and pagination
 */
export async function GET(request: NextRequest): Promise<NextResponse<MediaFilesResponse>> {
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
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type') as 'image' | 'video' | 'document' | undefined
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
      result = getMockMediaFiles({ type, page, limit, search })
    } else {
      // TODO: Replace with actual database call
      // const result = await databaseService.getMediaFiles({ type, page, limit, search })
      
      // For now, fallback to mock data
      result = getMockMediaFiles({ type, page, limit, search })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })

  } catch (error) {
    console.error('Error fetching media files:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch media files'
    }, { status: 500 })
  }
}

/**
 * DELETE /api/website/media/[id]
 * Delete a specific media file
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<MediaFileResponse>> {
  try {
    // Check if CMS is enabled
    if (!isCMSEnabled()) {
      return NextResponse.json({
        success: false,
        message: 'Website CMS is currently disabled'
      }, { status: 503 })
    }

    const mediaId = params.id

    if (!mediaId) {
      return NextResponse.json({
        success: false,
        message: 'Media ID is required'
      }, { status: 400 })
    }

    if (shouldUseMockData()) {
      // Find media file by ID in mock data
      const mediaIndex = mockMediaFiles.findIndex(m => m.id === mediaId)

      if (mediaIndex === -1) {
        return NextResponse.json({
          success: false,
          message: 'Media file not found'
        }, { status: 404 })
      }

      // Check if media is being used
      const mediaFile = mockMediaFiles[mediaIndex]
      if (mediaFile.usedIn.length > 0) {
        return NextResponse.json({
          success: false,
          message: `Cannot delete media file. It is currently used in: ${mediaFile.usedIn.join(', ')}`
        }, { status: 400 })
      }

      // Remove media file from mock data
      const deletedMedia = mockMediaFiles.splice(mediaIndex, 1)[0]

      return NextResponse.json({
        success: true,
        data: deletedMedia,
        message: 'Media file deleted successfully'
      })

    } else {
      // TODO: Replace with actual database call
      // const deletedMedia = await databaseService.deleteMediaFile(mediaId)
      
      return NextResponse.json({
        success: false,
        message: 'Database integration not yet implemented'
      }, { status: 501 })
    }

  } catch (error) {
    console.error('Error deleting media file:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to delete media file'
    }, { status: 500 })
  }
}

/**
 * OPTIONS /api/website/media
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
