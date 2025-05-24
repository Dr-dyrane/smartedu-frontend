// Jest Setup for Website CMS Testing
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    }
  },
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }) => {
    return React.createElement('a', { href, ...props }, children)
  }
})

// Mock Next.js Image component
jest.mock('next/image', () => {
  return ({ src, alt, ...props }) => {
    return React.createElement('img', { src, alt, ...props })
  }
})

// Mock environment variables
process.env.NEXT_PUBLIC_WEBSITE_CMS_ENABLED = 'true'
process.env.NEXT_PUBLIC_WEBSITE_CMS_DEBUG = 'true'
process.env.NEXT_PUBLIC_WEBSITE_CMS_MOCK_DATA = 'true'
process.env.NEXT_PUBLIC_WEBSITE_CMS_TIER = 'premium'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.sessionStorage = sessionStorageMock

// Mock fetch
global.fetch = jest.fn()

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock MutationObserver
global.MutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock File and FileReader
global.File = class File {
  constructor(chunks, filename, options = {}) {
    this.chunks = chunks
    this.name = filename
    this.size = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
    this.type = options.type || ''
    this.lastModified = Date.now()
  }
}

global.FileReader = class FileReader {
  constructor() {
    this.readyState = 0
    this.result = null
    this.error = null
    this.onload = null
    this.onerror = null
    this.onabort = null
  }
  
  readAsDataURL(file) {
    setTimeout(() => {
      this.readyState = 2
      this.result = `data:${file.type};base64,mock-base64-data`
      if (this.onload) this.onload({ target: this })
    }, 0)
  }
  
  readAsText(file) {
    setTimeout(() => {
      this.readyState = 2
      this.result = 'mock file content'
      if (this.onload) this.onload({ target: this })
    }, 0)
  }
}

// Mock DataTransfer for drag and drop
global.DataTransfer = class DataTransfer {
  constructor() {
    this.files = []
    this.items = {
      add: (file) => this.files.push(file),
      clear: () => { this.files = [] },
      length: 0
    }
  }
}

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-object-url')
global.URL.revokeObjectURL = jest.fn()

// Mock performance API
global.performance = {
  ...global.performance,
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByName: jest.fn(() => []),
  getEntriesByType: jest.fn(() => []),
}

// Mock console methods for cleaner test output
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
  
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
       args[0].includes('componentWillUpdate'))
    ) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Global test utilities
global.testUtils = {
  // Wait for async operations
  waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Create mock event
  createMockEvent: (type, properties = {}) => ({
    type,
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: { value: '' },
    ...properties
  }),
  
  // Create mock file
  createMockFile: (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
    const content = new Array(size).fill('a').join('')
    return new File([content], name, { type })
  },
  
  // Mock API response
  mockApiResponse: (data, success = true) => ({
    ok: success,
    status: success ? 200 : 400,
    json: () => Promise.resolve({
      success,
      data,
      message: success ? 'Success' : 'Error'
    })
  })
}

// Setup and teardown for each test
beforeEach(() => {
  // Clear all mocks
  jest.clearAllMocks()
  
  // Reset localStorage and sessionStorage
  localStorageMock.getItem.mockReturnValue(null)
  sessionStorageMock.getItem.mockReturnValue(null)
  
  // Reset fetch mock
  fetch.mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve({ success: true, data: {} })
  })
})

afterEach(() => {
  // Clean up any side effects
  jest.restoreAllMocks()
})
