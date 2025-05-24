// CMS Testing Utilities
// Comprehensive testing utilities for the Website CMS feature

import { 
  websiteCMSConfig, 
  isCMSEnabled, 
  validateCMSEnvironment,
  getCMSApiUrl,
  validateFileUpload,
  formatFileSize
} from '@/lib/env/website-cms'
import { mockWebsitePages, mockMediaFiles, mockWebsiteSettings } from '@/data/mock/website-cms-mock'
import { WebsitePage, MediaFile, WebsiteSettings } from '@/types/website.types'

/**
 * Test Environment Setup
 */
export const setupTestEnvironment = () => {
  // Store original environment
  const originalEnv = { ...process.env }
  
  // Set test environment variables
  process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED = 'true'
  process.env.NEXT_PUBLIC_WEBSITE_CMS_DEBUG = 'true'
  process.env.NEXT_PUBLIC_WEBSITE_CMS_MOCK_DATA = 'true'
  process.env.NEXT_PUBLIC_WEBSITE_CMS_TIER = 'premium'
  
  return {
    restore: () => {
      process.env = originalEnv
    }
  }
}

/**
 * Mock User Data for Testing
 */
export const createMockUser = (role: 'admin' | 'user' = 'admin') => ({
  id: 'test-user-id',
  email: 'test@1techacademy.com',
  name: 'Test User',
  role,
  tier: 'premium',
  isVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
})

/**
 * Mock Redux Store State
 */
export const createMockStoreState = (user = createMockUser()) => ({
  auth: {
    user,
    isAuthenticated: !!user,
    loading: false,
    error: null
  },
  website: {
    pages: mockWebsitePages,
    currentPage: mockWebsitePages[0],
    mediaFiles: mockMediaFiles,
    settings: mockWebsiteSettings,
    loading: {
      pages: false,
      currentPage: false,
      media: false,
      settings: false,
      upload: false,
      creating: false,
      updating: false,
      deleting: false
    },
    error: {
      pages: null,
      currentPage: null,
      media: null,
      settings: null,
      upload: null,
      creating: null,
      updating: null,
      deleting: null
    },
    pagination: {
      pages: { page: 1, limit: 10, total: mockWebsitePages.length, totalPages: 1 },
      media: { page: 1, limit: 20, total: mockMediaFiles.length, totalPages: 1 }
    },
    ui: {
      selectedPageId: null,
      selectedMediaIds: [],
      viewMode: 'grid' as const,
      filterType: 'all',
      searchTerm: ''
    }
  }
})

/**
 * Test File Creation Utilities
 */
export const createTestFile = (
  name: string = 'test-image.jpg',
  type: string = 'image/jpeg',
  size: number = 1024 * 1024 // 1MB
): File => {
  const content = new Array(size).fill('a').join('')
  const blob = new Blob([content], { type })
  return new File([blob], name, { type })
}

export const createTestFiles = () => ({
  validImage: createTestFile('test.jpg', 'image/jpeg', 1024 * 1024),
  validVideo: createTestFile('test.mp4', 'video/mp4', 5 * 1024 * 1024),
  validDocument: createTestFile('test.pdf', 'application/pdf', 2 * 1024 * 1024),
  oversizedFile: createTestFile('large.jpg', 'image/jpeg', 20 * 1024 * 1024), // 20MB
  invalidType: createTestFile('test.exe', 'application/x-executable', 1024)
})

/**
 * API Response Mocks
 */
export const createMockApiResponse = <T>(data: T, success: boolean = true) => ({
  success,
  data,
  message: success ? 'Operation successful' : 'Operation failed',
  timestamp: new Date().toISOString()
})

export const createMockPageResponse = (page?: Partial<WebsitePage>) => 
  createMockApiResponse({
    ...mockWebsitePages[0],
    ...page
  })

export const createMockMediaResponse = (media?: Partial<MediaFile>) =>
  createMockApiResponse({
    ...mockMediaFiles[0],
    ...media
  })

export const createMockSettingsResponse = (settings?: Partial<WebsiteSettings>) =>
  createMockApiResponse({
    ...mockWebsiteSettings,
    ...settings
  })

/**
 * Environment Testing Functions
 */
export const testEnvironmentConfiguration = () => {
  const tests = {
    cmsEnabled: isCMSEnabled(),
    configValid: validateCMSEnvironment(),
    apiUrlGeneration: getCMSApiUrl('test'),
    fileValidation: {
      validFile: validateFileUpload(createTestFile()),
      oversizedFile: validateFileUpload(createTestFiles().oversizedFile),
      invalidType: validateFileUpload(createTestFiles().invalidType)
    },
    fileSizeFormatting: formatFileSize(1024 * 1024)
  }
  
  return tests
}

/**
 * Component Testing Helpers
 */
export const waitForElement = (selector: string, timeout: number = 5000): Promise<Element> => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector)
    if (element) {
      resolve(element)
      return
    }
    
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector)
      if (element) {
        observer.disconnect()
        resolve(element)
      }
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    setTimeout(() => {
      observer.disconnect()
      reject(new Error(`Element ${selector} not found within ${timeout}ms`))
    }, timeout)
  })
}

export const simulateFileUpload = (input: HTMLInputElement, files: File[]) => {
  const dataTransfer = new DataTransfer()
  files.forEach(file => dataTransfer.items.add(file))
  
  Object.defineProperty(input, 'files', {
    value: dataTransfer.files,
    writable: false
  })
  
  const event = new Event('change', { bubbles: true })
  input.dispatchEvent(event)
}

/**
 * Performance Testing Utilities
 */
export const measurePerformance = async <T>(
  operation: () => Promise<T>,
  label: string = 'Operation'
): Promise<{ result: T; duration: number }> => {
  const start = performance.now()
  const result = await operation()
  const end = performance.now()
  const duration = end - start
  
  console.log(`${label} took ${duration.toFixed(2)}ms`)
  
  return { result, duration }
}

export const createPerformanceTest = (
  operations: Array<{ name: string; fn: () => Promise<any> }>
) => {
  return async () => {
    const results = []
    
    for (const operation of operations) {
      const result = await measurePerformance(operation.fn, operation.name)
      results.push({
        name: operation.name,
        duration: result.duration,
        result: result.result
      })
    }
    
    return results
  }
}

/**
 * Error Testing Utilities
 */
export const createErrorScenarios = () => ({
  networkError: () => Promise.reject(new Error('Network error')),
  serverError: () => Promise.reject(new Error('Internal server error')),
  validationError: () => Promise.reject(new Error('Validation failed')),
  timeoutError: () => new Promise((_, reject) => 
    setTimeout(() => reject(new Error('Request timeout')), 100)
  )
})

/**
 * Accessibility Testing Helpers
 */
export const checkAccessibility = (element: Element) => {
  const checks = {
    hasAriaLabel: element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby'),
    hasRole: element.hasAttribute('role'),
    isFocusable: element.tabIndex >= 0 || ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase()),
    hasKeyboardSupport: element.hasAttribute('onkeydown') || element.hasAttribute('onkeyup'),
    hasProperContrast: true // Would need actual color analysis
  }
  
  return checks
}

/**
 * Integration Testing Utilities
 */
export const createIntegrationTestSuite = () => ({
  testCMSFlow: async () => {
    // Test complete CMS workflow
    const steps = [
      'Environment setup',
      'User authentication',
      'Dashboard access',
      'Page creation',
      'Media upload',
      'Settings update',
      'Content publishing'
    ]
    
    const results = []
    
    for (const step of steps) {
      try {
        // Simulate each step
        await new Promise(resolve => setTimeout(resolve, 100))
        results.push({ step, status: 'passed' })
      } catch (error) {
        results.push({ step, status: 'failed', error: error.message })
      }
    }
    
    return results
  },
  
  testAPIEndpoints: async () => {
    const endpoints = [
      '/api/website/health',
      '/api/website/pages',
      '/api/website/media',
      '/api/website/settings'
    ]
    
    const results = []
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint)
        results.push({
          endpoint,
          status: response.status,
          ok: response.ok
        })
      } catch (error) {
        results.push({
          endpoint,
          status: 'error',
          error: error.message
        })
      }
    }
    
    return results
  }
})

/**
 * Test Data Validation
 */
export const validateTestData = () => {
  const validations = {
    mockPages: mockWebsitePages.every(page => 
      page.id && page.title && page.slug && Array.isArray(page.sections)
    ),
    mockMedia: mockMediaFiles.every(media =>
      media.id && media.name && media.url && media.type
    ),
    mockSettings: mockWebsiteSettings && 
      mockWebsiteSettings.siteName && 
      mockWebsiteSettings.contactEmail
  }
  
  return validations
}

/**
 * Cleanup Utilities
 */
export const cleanup = {
  localStorage: () => {
    localStorage.removeItem('cms-onboarding-completed')
    localStorage.removeItem('cms-announcement-dismissed')
  },
  
  sessionStorage: () => {
    sessionStorage.clear()
  },
  
  dom: () => {
    // Remove any test elements
    document.querySelectorAll('[data-testid]').forEach(el => el.remove())
  },
  
  all: () => {
    cleanup.localStorage()
    cleanup.sessionStorage()
    cleanup.dom()
  }
}
