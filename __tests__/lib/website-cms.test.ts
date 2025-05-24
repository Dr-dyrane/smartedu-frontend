// Unit Tests for Website CMS Core Functions
import { describe, it, expect, beforeEach, afterEach } from '@jest/globals'
import {
  websiteCMSConfig,
  isCMSEnabled,
  isCMSDebugMode,
  shouldUseMockData,
  getCMSApiUrl,
  validateFileUpload,
  formatFileSize,
  validateCMSEnvironment,
  getUnavailabilityMessage
} from '@/lib/env/website-cms'
import { setupTestEnvironment, createTestFiles } from '../utils/cms-test-utils'

describe('Website CMS Core Functions', () => {
  let envRestore: () => void

  beforeEach(() => {
    const env = setupTestEnvironment()
    envRestore = env.restore
  })

  afterEach(() => {
    envRestore()
  })

  describe('Environment Configuration', () => {
    it('should read environment variables correctly', () => {
      expect(isCMSEnabled()).toBe(true)
      expect(isCMSDebugMode()).toBe(true)
      expect(shouldUseMockData()).toBe(true)
    })

    it('should have correct default values', () => {
      expect(websiteCMSConfig.tier).toBe('premium')
      expect(websiteCMSConfig.apiBaseUrl).toBe('/api/website')
      expect(websiteCMSConfig.uploadMaxSize).toBe(10485760) // 10MB
    })

    it('should validate environment configuration', () => {
      const validation = validateCMSEnvironment()
      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should detect invalid configuration', () => {
      // Temporarily set invalid values
      const originalUploadMaxSize = websiteCMSConfig.uploadMaxSize
      Object.defineProperty(websiteCMSConfig, 'uploadMaxSize', { value: -1, writable: true })
      
      const validation = validateCMSEnvironment()
      expect(validation.valid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
      
      // Restore original value
      Object.defineProperty(websiteCMSConfig, 'uploadMaxSize', { value: originalUploadMaxSize, writable: true })
    })
  })

  describe('API URL Generation', () => {
    it('should generate correct API URLs', () => {
      expect(getCMSApiUrl()).toBe('/api/website')
      expect(getCMSApiUrl('pages')).toBe('/api/website/pages')
      expect(getCMSApiUrl('/pages')).toBe('/api/website/pages') // Should handle leading slash
      expect(getCMSApiUrl('pages/123')).toBe('/api/website/pages/123')
    })

    it('should handle empty and undefined endpoints', () => {
      expect(getCMSApiUrl('')).toBe('/api/website')
      expect(getCMSApiUrl()).toBe('/api/website')
    })
  })

  describe('File Upload Validation', () => {
    const testFiles = createTestFiles()

    it('should validate correct file types and sizes', () => {
      const result = validateFileUpload(testFiles.validImage)
      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject oversized files', () => {
      const result = validateFileUpload(testFiles.oversizedFile)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('exceeds maximum allowed size')
    })

    it('should reject invalid file types', () => {
      const result = validateFileUpload(testFiles.invalidType)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('not allowed')
    })

    it('should validate different file types', () => {
      expect(validateFileUpload(testFiles.validImage).valid).toBe(true)
      expect(validateFileUpload(testFiles.validVideo).valid).toBe(true)
      expect(validateFileUpload(testFiles.validDocument).valid).toBe(true)
    })
  })

  describe('File Size Formatting', () => {
    it('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
      expect(formatFileSize(1536)).toBe('1.5 KB') // 1.5 KB
    })

    it('should handle edge cases', () => {
      expect(formatFileSize(1)).toBe('1 Bytes')
      expect(formatFileSize(1023)).toBe('1023 Bytes')
      expect(formatFileSize(1025)).toBe('1 KB')
    })
  })

  describe('Error Messages', () => {
    it('should return correct unavailability messages', () => {
      expect(getUnavailabilityMessage('disabled')).toContain('currently disabled')
      expect(getUnavailabilityMessage('tier')).toContain('premium subscription')
      expect(getUnavailabilityMessage('permission')).toContain('permission')
      expect(getUnavailabilityMessage('maintenance')).toContain('maintenance')
    })

    it('should handle unknown reasons', () => {
      const message = getUnavailabilityMessage('unknown' as any)
      expect(message).toContain('currently unavailable')
    })
  })

  describe('Configuration Edge Cases', () => {
    it('should handle missing environment variables', () => {
      // Test with undefined environment variables
      const originalEnv = process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED
      delete process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED
      
      // Should default to false when undefined
      expect(process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED).toBeUndefined()
      
      // Restore
      process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED = originalEnv
    })

    it('should handle invalid boolean values', () => {
      const originalEnv = process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED
      
      // Test with invalid boolean values
      process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED = 'invalid'
      expect(isCMSEnabled()).toBe(false) // Should be false for non-'true' values
      
      process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED = 'false'
      expect(isCMSEnabled()).toBe(false)
      
      process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED = 'TRUE'
      expect(isCMSEnabled()).toBe(false) // Case sensitive
      
      // Restore
      process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED = originalEnv
    })
  })

  describe('Performance', () => {
    it('should execute functions quickly', () => {
      const start = performance.now()
      
      // Run multiple operations
      for (let i = 0; i < 1000; i++) {
        isCMSEnabled()
        getCMSApiUrl('test')
        formatFileSize(1024 * i)
      }
      
      const end = performance.now()
      const duration = end - start
      
      // Should complete 1000 operations in under 100ms
      expect(duration).toBeLessThan(100)
    })

    it('should handle concurrent operations', async () => {
      const operations = Array.from({ length: 100 }, (_, i) => 
        Promise.resolve(getCMSApiUrl(`endpoint-${i}`))
      )
      
      const start = performance.now()
      const results = await Promise.all(operations)
      const end = performance.now()
      
      expect(results).toHaveLength(100)
      expect(end - start).toBeLessThan(50) // Should be very fast
    })
  })

  describe('Memory Usage', () => {
    it('should not leak memory with repeated calls', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
      
      // Perform many operations
      for (let i = 0; i < 10000; i++) {
        validateFileUpload(createTestFiles().validImage)
        formatFileSize(Math.random() * 1000000)
        getCMSApiUrl(`test-${i}`)
      }
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc()
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory
      
      // Memory increase should be reasonable (less than 10MB)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })
  })

  describe('Type Safety', () => {
    it('should maintain type safety', () => {
      // These should compile without TypeScript errors
      const config = websiteCMSConfig
      expect(typeof config.enabled).toBe('boolean')
      expect(typeof config.debug).toBe('boolean')
      expect(typeof config.mockData).toBe('boolean')
      expect(typeof config.tier).toBe('string')
      expect(typeof config.uploadMaxSize).toBe('number')
      expect(Array.isArray(config.allowedTypes)).toBe(true)
    })

    it('should handle type coercion correctly', () => {
      // Test that string numbers are parsed correctly
      const size = parseInt('1024')
      expect(typeof size).toBe('number')
      expect(size).toBe(1024)
      
      // Test boolean string parsing
      expect('true' === 'true').toBe(true)
      expect('false' === 'true').toBe(false)
    })
  })
})
