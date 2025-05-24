# Website CMS Testing Suite

This directory contains comprehensive tests for the Website CMS feature, including unit tests, integration tests, and end-to-end tests.

## Test Structure

```
__tests__/
├── utils/
│   └── cms-test-utils.ts          # Testing utilities and helpers
├── lib/
│   └── website-cms.test.ts        # Unit tests for core functions
├── components/
│   └── cms-feature-gate.test.tsx  # Component tests
├── api/
│   └── website-cms.test.ts        # API integration tests
├── e2e/
│   └── cms-workflow.test.ts       # End-to-end workflow tests
├── setup/
│   ├── global-setup.js            # Global test setup
│   └── global-teardown.js         # Global test teardown
└── README.md                      # This file
```

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Suites
```bash
# Unit tests only
npm run test:unit

# Component tests only
npm run test:components

# API tests only
npm run test:api

# E2E tests only
npm run test:e2e

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Categories

#### 1. Unit Tests (`lib/website-cms.test.ts`)
Tests core CMS functions in isolation:
- Environment configuration
- API URL generation
- File upload validation
- File size formatting
- Error message generation
- Performance and memory usage

#### 2. Component Tests (`components/cms-feature-gate.test.tsx`)
Tests React components:
- Access control logic
- Fallback content rendering
- Loading states
- Error handling
- Accessibility features
- Performance optimization

#### 3. API Integration Tests (`api/website-cms.test.ts`)
Tests API endpoints:
- Health check endpoint
- Pages CRUD operations
- Media upload and management
- Settings management
- Error handling
- Performance under load

#### 4. End-to-End Tests (`e2e/cms-workflow.test.ts`)
Tests complete user workflows:
- User onboarding flow
- Content management workflow
- API integration flow
- Navigation and UX
- Data consistency
- Performance and reliability

## Test Utilities

The `cms-test-utils.ts` file provides comprehensive utilities:

### Environment Setup
```typescript
const env = setupTestEnvironment()
// ... run tests
env.restore() // Clean up
```

### Mock Data Creation
```typescript
const user = createMockUser('admin')
const storeState = createMockStoreState(user)
const testFiles = createTestFiles()
```

### Performance Testing
```typescript
const result = await measurePerformance(
  () => someOperation(),
  'Operation Name'
)
```

### API Response Mocking
```typescript
const response = createMockApiResponse(data, true)
```

## Coverage Requirements

The test suite maintains high coverage standards:

- **Global Coverage**: 80% minimum
- **Critical Files**: 90% minimum
- **Branches**: 80% minimum
- **Functions**: 80% minimum
- **Lines**: 80% minimum
- **Statements**: 80% minimum

### Critical Files (90% coverage required):
- `lib/env/website-cms.ts`
- `components/feature-gates/cms-feature-gate.tsx`

## Test Environment

### Environment Variables
Tests run with these environment variables:
```bash
NEXT_PUBLIC_WEBSITE_CMS_ENABLED=true
NEXT_PUBLIC_WEBSITE_CMS_DEBUG=true
NEXT_PUBLIC_WEBSITE_CMS_MOCK_DATA=true
NEXT_PUBLIC_WEBSITE_CMS_TIER=premium
```

### Mocked Dependencies
- Next.js router and navigation
- localStorage and sessionStorage
- fetch API
- File and FileReader APIs
- ResizeObserver and IntersectionObserver
- Performance API

## Writing New Tests

### Test File Naming
- Unit tests: `*.test.ts`
- Component tests: `*.test.tsx`
- Integration tests: `*.integration.test.ts`
- E2E tests: `*.e2e.test.ts`

### Test Structure
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    // Setup for each test
  })

  afterEach(() => {
    // Cleanup after each test
  })

  describe('Specific Functionality', () => {
    it('should do something specific', () => {
      // Test implementation
    })
  })
})
```

### Best Practices

1. **Use Descriptive Names**: Test names should clearly describe what is being tested
2. **Test One Thing**: Each test should focus on a single behavior
3. **Use Arrange-Act-Assert**: Structure tests clearly
4. **Mock External Dependencies**: Isolate the code under test
5. **Test Edge Cases**: Include error conditions and boundary cases
6. **Keep Tests Fast**: Unit tests should run quickly
7. **Use Test Utilities**: Leverage the provided utilities for consistency

### Example Test
```typescript
import { describe, it, expect } from '@jest/globals'
import { isCMSEnabled } from '@/lib/env/website-cms'
import { setupTestEnvironment } from '../utils/cms-test-utils'

describe('CMS Environment', () => {
  it('should detect when CMS is enabled', () => {
    const env = setupTestEnvironment()
    
    expect(isCMSEnabled()).toBe(true)
    
    env.restore()
  })
})
```

## Debugging Tests

### Running Single Test
```bash
npm test -- --testNamePattern="specific test name"
```

### Debug Mode
```bash
npm test -- --verbose --no-coverage
```

### Watch Mode with Coverage
```bash
npm run test:watch -- --coverage
```

## Continuous Integration

Tests are configured to run in CI/CD pipelines with:
- Automatic test execution on pull requests
- Coverage reporting
- Performance benchmarking
- Accessibility testing

## Performance Benchmarks

The test suite includes performance benchmarks:
- API response times < 100ms
- Component render times < 50ms
- Memory usage monitoring
- Concurrent operation handling

## Accessibility Testing

Automated accessibility checks include:
- ARIA label validation
- Keyboard navigation testing
- Color contrast verification
- Screen reader compatibility

## Troubleshooting

### Common Issues

1. **Tests timing out**: Increase timeout in jest.config.js
2. **Mock not working**: Check mock setup in jest.setup.js
3. **Environment variables**: Verify .env.test file
4. **Coverage too low**: Add more test cases

### Getting Help

1. Check test output for specific error messages
2. Review test utilities documentation
3. Look at existing test examples
4. Check Jest and Testing Library documentation

## Contributing

When adding new CMS features:
1. Write tests first (TDD approach)
2. Ensure coverage requirements are met
3. Update test utilities if needed
4. Document any new testing patterns
5. Run full test suite before submitting
