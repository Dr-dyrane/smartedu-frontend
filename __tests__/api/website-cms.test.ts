// API Integration Tests for Website CMS
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { NextRequest, NextResponse } from 'next/server'
import { setupTestEnvironment, createMockApiResponse } from '../utils/cms-test-utils'

// Mock the environment functions
jest.mock('@/lib/env/website-cms', () => ({
  isCMSEnabled: jest.fn(() => true),
  shouldUseMockData: jest.fn(() => true),
  validateCMSEnvironment: jest.fn(() => ({ valid: true, errors: [] }))
}))

describe('Website CMS API Endpoints', () => {
  let envRestore: () => void

  beforeEach(() => {
    const env = setupTestEnvironment()
    envRestore = env.restore
  })

  afterEach(() => {
    envRestore()
    jest.clearAllMocks()
  })

  describe('Health Check Endpoint', () => {
    it('should return healthy status when CMS is enabled', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/website/health'
      })

      // Mock the health endpoint
      const mockHealthResponse = {
        status: 'healthy',
        timestamp: expect.any(String),
        cms: {
          enabled: true,
          debugMode: false,
          mockData: true,
          environment: 'development'
        },
        validation: {
          isValid: true,
          errors: []
        },
        stats: {
          pages: expect.any(Number),
          publishedPages: expect.any(Number),
          draftPages: expect.any(Number),
          mediaFiles: expect.any(Number),
          totalSections: expect.any(Number)
        },
        features: {
          pagesAPI: true,
          mediaAPI: true,
          settingsAPI: true,
          fileUpload: 'mock'
        }
      }

      // Simulate API call
      const response = await fetch('/api/website/health')
      expect(response.status).toBe(200)
    })

    it('should return disabled status when CMS is disabled', async () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(false)

      const { req, res } = createMocks({
        method: 'GET',
        url: '/api/website/health'
      })

      // Should return 503 status when disabled
      const response = await fetch('/api/website/health')
      expect(response.status).toBe(503)
    })

    it('should handle OPTIONS requests for CORS', async () => {
      const { req, res } = createMocks({
        method: 'OPTIONS',
        url: '/api/website/health'
      })

      const response = await fetch('/api/website/health', { method: 'OPTIONS' })
      expect(response.status).toBe(200)
    })
  })

  describe('Pages API Endpoints', () => {
    describe('GET /api/website/pages', () => {
      it('should return list of pages', async () => {
        const response = await fetch('/api/website/pages')
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
        expect(Array.isArray(data.data)).toBe(true)
        expect(data.pagination).toBeDefined()
      })

      it('should handle pagination parameters', async () => {
        const response = await fetch('/api/website/pages?page=1&limit=5')
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.pagination.page).toBe(1)
        expect(data.pagination.limit).toBe(5)
      })

      it('should handle search parameters', async () => {
        const response = await fetch('/api/website/pages?search=landing')
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
      })

      it('should handle status filtering', async () => {
        const response = await fetch('/api/website/pages?status=published')
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
      })
    })

    describe('GET /api/website/pages/[id]', () => {
      it('should return specific page', async () => {
        const response = await fetch('/api/website/pages/landing')
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.data.id).toBeDefined()
      })

      it('should return 404 for non-existent page', async () => {
        const response = await fetch('/api/website/pages/non-existent')
        expect(response.status).toBe(404)
      })
    })

    describe('POST /api/website/pages', () => {
      it('should create new page with valid data', async () => {
        const pageData = {
          title: 'Test Page',
          slug: '/test-page',
          status: 'draft',
          sections: []
        }

        const response = await fetch('/api/website/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageData)
        })

        expect(response.status).toBe(201)
        
        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.data.title).toBe(pageData.title)
      })

      it('should validate required fields', async () => {
        const invalidData = {
          slug: '/test-page'
          // Missing required title
        }

        const response = await fetch('/api/website/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(invalidData)
        })

        expect(response.status).toBe(400)
      })

      it('should handle duplicate slugs', async () => {
        const pageData = {
          title: 'Test Page',
          slug: '/', // Duplicate of landing page
          status: 'draft',
          sections: []
        }

        const response = await fetch('/api/website/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(pageData)
        })

        expect(response.status).toBe(409) // Conflict
      })
    })

    describe('PUT /api/website/pages/[id]', () => {
      it('should update existing page', async () => {
        const updateData = {
          title: 'Updated Title',
          status: 'published'
        }

        const response = await fetch('/api/website/pages/landing', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })

        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.data.title).toBe(updateData.title)
      })

      it('should return 404 for non-existent page', async () => {
        const response = await fetch('/api/website/pages/non-existent', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Updated' })
        })

        expect(response.status).toBe(404)
      })
    })

    describe('DELETE /api/website/pages/[id]', () => {
      it('should delete existing page', async () => {
        const response = await fetch('/api/website/pages/test-page', {
          method: 'DELETE'
        })

        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
      })

      it('should prevent deletion of landing page', async () => {
        const response = await fetch('/api/website/pages/landing', {
          method: 'DELETE'
        })

        expect(response.status).toBe(403) // Forbidden
      })
    })
  })

  describe('Media API Endpoints', () => {
    describe('GET /api/website/media', () => {
      it('should return list of media files', async () => {
        const response = await fetch('/api/website/media')
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
        expect(Array.isArray(data.data)).toBe(true)
      })

      it('should handle type filtering', async () => {
        const response = await fetch('/api/website/media?type=image')
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
      })
    })

    describe('POST /api/website/media/upload', () => {
      it('should handle file upload', async () => {
        const formData = new FormData()
        const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
        formData.append('file', file)

        const response = await fetch('/api/website/media/upload', {
          method: 'POST',
          body: formData
        })

        expect(response.status).toBe(201)
        
        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.data.name).toBe('test.jpg')
      })

      it('should validate file types', async () => {
        const formData = new FormData()
        const file = new File(['test content'], 'test.exe', { type: 'application/x-executable' })
        formData.append('file', file)

        const response = await fetch('/api/website/media/upload', {
          method: 'POST',
          body: formData
        })

        expect(response.status).toBe(400)
      })

      it('should validate file size', async () => {
        const formData = new FormData()
        const largeContent = new Array(20 * 1024 * 1024).fill('a').join('') // 20MB
        const file = new File([largeContent], 'large.jpg', { type: 'image/jpeg' })
        formData.append('file', file)

        const response = await fetch('/api/website/media/upload', {
          method: 'POST',
          body: formData
        })

        expect(response.status).toBe(400)
      })
    })

    describe('DELETE /api/website/media/[id]', () => {
      it('should delete media file', async () => {
        const response = await fetch('/api/website/media/test-media-id', {
          method: 'DELETE'
        })

        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
      })

      it('should return 404 for non-existent media', async () => {
        const response = await fetch('/api/website/media/non-existent', {
          method: 'DELETE'
        })

        expect(response.status).toBe(404)
      })
    })
  })

  describe('Settings API Endpoints', () => {
    describe('GET /api/website/settings', () => {
      it('should return website settings', async () => {
        const response = await fetch('/api/website/settings')
        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.data.siteName).toBeDefined()
      })
    })

    describe('PUT /api/website/settings', () => {
      it('should update website settings', async () => {
        const settingsData = {
          siteName: 'Updated Site Name',
          contactEmail: 'updated@example.com'
        }

        const response = await fetch('/api/website/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsData)
        })

        expect(response.status).toBe(200)
        
        const data = await response.json()
        expect(data.success).toBe(true)
        expect(data.data.siteName).toBe(settingsData.siteName)
      })

      it('should validate email format', async () => {
        const settingsData = {
          contactEmail: 'invalid-email'
        }

        const response = await fetch('/api/website/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsData)
        })

        expect(response.status).toBe(400)
      })

      it('should validate URL format', async () => {
        const settingsData = {
          siteUrl: 'invalid-url'
        }

        const response = await fetch('/api/website/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsData)
        })

        expect(response.status).toBe(400)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle CMS disabled state', async () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(false)

      const response = await fetch('/api/website/pages')
      expect(response.status).toBe(503)
      
      const data = await response.json()
      expect(data.success).toBe(false)
      expect(data.message).toContain('disabled')
    })

    it('should handle malformed JSON', async () => {
      const response = await fetch('/api/website/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'invalid json'
      })

      expect(response.status).toBe(400)
    })

    it('should handle missing content type', async () => {
      const response = await fetch('/api/website/pages', {
        method: 'POST',
        body: JSON.stringify({ title: 'Test' })
      })

      expect(response.status).toBe(400)
    })
  })

  describe('Performance', () => {
    it('should respond quickly to health checks', async () => {
      const start = performance.now()
      const response = await fetch('/api/website/health')
      const end = performance.now()

      expect(response.status).toBe(200)
      expect(end - start).toBeLessThan(100) // Should respond in under 100ms
    })

    it('should handle concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, () => 
        fetch('/api/website/health')
      )

      const start = performance.now()
      const responses = await Promise.all(requests)
      const end = performance.now()

      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      expect(end - start).toBeLessThan(500) // All requests in under 500ms
    })
  })
})
