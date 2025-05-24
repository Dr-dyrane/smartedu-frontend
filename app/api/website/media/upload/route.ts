import { NextRequest, NextResponse } from 'next/server'
import { 
  MediaFile, 
  MediaFileResponse 
} from '@/types/website.types'
import { mockMediaFiles } from '@/data/mock/website-cms-mock'
import { 
  shouldUseMockData, 
  isCMSEnabled, 
  validateFileUpload,
  formatFileSize 
} from '@/lib/env/website-cms'

/**
 * POST /api/website/media/upload
 * Upload a new media file
 */
export async function POST(request: NextRequest): Promise<NextResponse<MediaFileResponse>> {
  try {
    // Check if CMS is enabled
    if (!isCMSEnabled()) {
      return NextResponse.json({
        success: false,
        message: 'Website CMS is currently disabled'
      }, { status: 503 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string || ''
    const caption = formData.get('caption') as string || ''
    const folder = formData.get('folder') as string || ''

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file provided'
      }, { status: 400 })
    }

    // Validate file upload constraints
    const validation = validateFileUpload(file)
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        message: validation.error
      }, { status: 400 })
    }

    if (shouldUseMockData()) {
      // Simulate file upload with mock data
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const fileName = file.name
      
      // Determine file type based on extension
      let fileType: 'image' | 'video' | 'document' = 'document'
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension || '')) {
        fileType = 'image'
      } else if (['mp4', 'webm', 'avi', 'mov'].includes(fileExtension || '')) {
        fileType = 'video'
      }

      // Generate mock dimensions for images and videos
      let dimensions: { width: number; height: number } | undefined
      if (fileType === 'image' || fileType === 'video') {
        dimensions = {
          width: Math.floor(Math.random() * 1920) + 480, // Random width between 480-2400
          height: Math.floor(Math.random() * 1080) + 320  // Random height between 320-1400
        }
      }

      // Create new media file entry
      const newMediaFile: MediaFile = {
        id: `media-${Date.now()}`,
        name: fileName,
        type: fileType,
        url: `/uploads/${folder ? folder + '/' : ''}${fileName}`, // Mock URL
        size: file.size,
        dimensions,
        alt: alt || undefined,
        caption: caption || undefined,
        uploadedAt: new Date().toISOString(),
        usedIn: []
      }

      // Add to mock data
      mockMediaFiles.unshift(newMediaFile) // Add to beginning for recent files first

      return NextResponse.json({
        success: true,
        data: newMediaFile,
        message: 'File uploaded successfully'
      }, { status: 201 })

    } else {
      // TODO: Implement actual file upload
      // This would involve:
      // 1. Uploading file to cloud storage (AWS S3, Cloudinary, etc.)
      // 2. Processing image/video metadata
      // 3. Generating thumbnails if needed
      // 4. Saving file information to database
      
      return NextResponse.json({
        success: false,
        message: 'File upload integration not yet implemented'
      }, { status: 501 })
    }

  } catch (error) {
    console.error('Error uploading file:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('File too large')) {
        return NextResponse.json({
          success: false,
          message: 'File size exceeds maximum allowed size'
        }, { status: 413 })
      }
      
      if (error.message.includes('Invalid file type')) {
        return NextResponse.json({
          success: false,
          message: 'File type not supported'
        }, { status: 415 })
      }
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to upload file'
    }, { status: 500 })
  }
}

/**
 * OPTIONS /api/website/media/upload
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
