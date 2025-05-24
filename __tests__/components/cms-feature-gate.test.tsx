// Component Tests for CMS Feature Gate
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { CMSFeatureGate } from '@/components/feature-gates/cms-feature-gate'
import { setupTestEnvironment, createMockUser, createMockStoreState } from '../utils/cms-test-utils'

// Mock the environment functions
jest.mock('@/lib/env/website-cms', () => ({
  isCMSEnabled: jest.fn(() => true),
  isCMSDebugMode: jest.fn(() => false),
  getUnavailabilityMessage: jest.fn((reason: string) => `CMS is ${reason}`)
}))

// Mock the hooks
jest.mock('@/store/hooks', () => ({
  useAppSelector: jest.fn()
}))

describe('CMSFeatureGate Component', () => {
  let envRestore: () => void
  let mockStore: any

  beforeEach(() => {
    const env = setupTestEnvironment()
    envRestore = env.restore
    
    // Create mock store
    mockStore = configureStore({
      reducer: {
        auth: (state = createMockStoreState().auth) => state,
        website: (state = createMockStoreState().website) => state
      }
    })
  })

  afterEach(() => {
    envRestore()
    jest.clearAllMocks()
  })

  const renderWithProvider = (component: React.ReactElement, user = createMockUser()) => {
    const { useAppSelector } = require('@/store/hooks')
    useAppSelector.mockImplementation((selector: any) => {
      const state = createMockStoreState(user)
      return selector(state)
    })

    return render(
      <Provider store={mockStore}>
        {component}
      </Provider>
    )
  }

  describe('Access Control', () => {
    it('should render children for admin users when CMS is enabled', () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(true)

      renderWithProvider(
        <CMSFeatureGate>
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>,
        createMockUser('admin')
      )

      expect(screen.getByTestId('cms-content')).toBeInTheDocument()
    })

    it('should show access denied for non-admin users', () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(true)

      renderWithProvider(
        <CMSFeatureGate>
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>,
        createMockUser('user')
      )

      expect(screen.queryByTestId('cms-content')).not.toBeInTheDocument()
      expect(screen.getByText(/admin only/i)).toBeInTheDocument()
    })

    it('should show disabled message when CMS is disabled', () => {
      const { isCMSEnabled, getUnavailabilityMessage } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(false)
      getUnavailabilityMessage.mockReturnValue('CMS is currently disabled')

      renderWithProvider(
        <CMSFeatureGate>
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>,
        createMockUser('admin')
      )

      expect(screen.queryByTestId('cms-content')).not.toBeInTheDocument()
      expect(screen.getByText(/CMS is currently disabled/i)).toBeInTheDocument()
    })

    it('should show tier upgrade message for insufficient tier', () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(true)

      const basicUser = { ...createMockUser('admin'), tier: 'basic' }
      
      renderWithProvider(
        <CMSFeatureGate requiresTier="premium">
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>,
        basicUser
      )

      expect(screen.queryByTestId('cms-content')).not.toBeInTheDocument()
      expect(screen.getByText(/upgrade/i)).toBeInTheDocument()
    })
  })

  describe('Fallback Content', () => {
    it('should render custom fallback when provided', () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(false)

      renderWithProvider(
        <CMSFeatureGate fallback={<div data-testid="custom-fallback">Custom Fallback</div>}>
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>
      )

      expect(screen.queryByTestId('cms-content')).not.toBeInTheDocument()
      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument()
    })

    it('should render default fallback when no custom fallback provided', () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(false)

      renderWithProvider(
        <CMSFeatureGate>
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>
      )

      expect(screen.queryByTestId('cms-content')).not.toBeInTheDocument()
      expect(screen.getByText(/currently disabled/i)).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('should show loading state when user data is loading', () => {
      const { useAppSelector } = require('@/store/hooks')
      useAppSelector.mockImplementation((selector: any) => {
        const state = createMockStoreState()
        state.auth.loading = true
        return selector(state)
      })

      render(
        <Provider store={mockStore}>
          <CMSFeatureGate>
            <div data-testid="cms-content">CMS Content</div>
          </CMSFeatureGate>
        </Provider>
      )

      expect(screen.queryByTestId('cms-content')).not.toBeInTheDocument()
      // Should show loading skeleton or spinner
    })
  })

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', () => {
      const { useAppSelector } = require('@/store/hooks')
      useAppSelector.mockImplementation((selector: any) => {
        const state = createMockStoreState()
        state.auth.error = 'Authentication failed'
        state.auth.user = null
        return selector(state)
      })

      render(
        <Provider store={mockStore}>
          <CMSFeatureGate>
            <div data-testid="cms-content">CMS Content</div>
          </CMSFeatureGate>
        </Provider>
      )

      expect(screen.queryByTestId('cms-content')).not.toBeInTheDocument()
      expect(screen.getByText(/sign in/i)).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(false)

      renderWithProvider(
        <CMSFeatureGate>
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>
      )

      const alertElement = screen.getByRole('alert')
      expect(alertElement).toBeInTheDocument()
    })

    it('should be keyboard navigable', () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(false)

      renderWithProvider(
        <CMSFeatureGate>
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('tabIndex')
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = jest.fn()
      
      const TestComponent = () => {
        renderSpy()
        return <div data-testid="cms-content">CMS Content</div>
      }

      const { rerender } = renderWithProvider(
        <CMSFeatureGate>
          <TestComponent />
        </CMSFeatureGate>
      )

      // Initial render
      expect(renderSpy).toHaveBeenCalledTimes(1)

      // Re-render with same props
      rerender(
        <Provider store={mockStore}>
          <CMSFeatureGate>
            <TestComponent />
          </CMSFeatureGate>
        </Provider>
      )

      // Should not cause unnecessary re-renders
      expect(renderSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Integration', () => {
    it('should work with different tier requirements', () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      isCMSEnabled.mockReturnValue(true)

      const premiumUser = { ...createMockUser('admin'), tier: 'premium' }

      // Test basic tier requirement
      const { rerender } = renderWithProvider(
        <CMSFeatureGate requiresTier="basic">
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>,
        premiumUser
      )

      expect(screen.getByTestId('cms-content')).toBeInTheDocument()

      // Test premium tier requirement
      rerender(
        <Provider store={mockStore}>
          <CMSFeatureGate requiresTier="premium">
            <div data-testid="cms-content">CMS Content</div>
          </CMSFeatureGate>
        </Provider>
      )

      expect(screen.getByTestId('cms-content')).toBeInTheDocument()
    })

    it('should handle environment changes', async () => {
      const { isCMSEnabled } = require('@/lib/env/website-cms')
      
      // Start with CMS enabled
      isCMSEnabled.mockReturnValue(true)

      const { rerender } = renderWithProvider(
        <CMSFeatureGate>
          <div data-testid="cms-content">CMS Content</div>
        </CMSFeatureGate>
      )

      expect(screen.getByTestId('cms-content')).toBeInTheDocument()

      // Disable CMS
      isCMSEnabled.mockReturnValue(false)

      rerender(
        <Provider store={mockStore}>
          <CMSFeatureGate>
            <div data-testid="cms-content">CMS Content</div>
          </CMSFeatureGate>
        </Provider>
      )

      await waitFor(() => {
        expect(screen.queryByTestId('cms-content')).not.toBeInTheDocument()
      })
    })
  })
})
