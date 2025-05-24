// Example of how the landing page can be made dynamic using CMS data
// This file demonstrates the concept - you would replace app/page.tsx with this approach

'use client'

import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { fetchCourses } from "@/features/public-course/store/public-course-slice"
import { useLandingPageData } from "@/hooks/useWebsiteData"

// Layout components
import NavBar from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AbstractBackground } from "@/components/layout/abstract-background"
import { ScrollIndicator } from "@/components/layout/scroll-indicator"

// Dynamic section renderer
import { DynamicSectionRenderer } from "@/components/website/dynamic-section-renderer"

// Loading and error components
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function DynamicLandingPage() {
  const dispatch = useAppDispatch()
  const { landingPage, sections, loading, error } = useLandingPageData()

  // Fetch courses on mount (still needed for course section)
  useEffect(() => {
    dispatch(fetchCourses())
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full relative">
        <ScrollIndicator />
        <NavBar />
        <main className="flex-1">
          <div className="py-16 md:py-24 relative overflow-hidden">
            <AbstractBackground className="opacity-90 dark:opacity-80" />
            <div className="container px-4 md:px-6 relative">
              <div className="space-y-8">
                <Skeleton className="h-16 w-3/4 mx-auto" />
                <Skeleton className="h-8 w-1/2 mx-auto" />
                <div className="flex justify-center gap-4">
                  <Skeleton className="h-12 w-32" />
                  <Skeleton className="h-12 w-32" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Loading skeletons for other sections */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="py-16">
              <div className="container px-4 md:px-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3 mx-auto" />
                  <Skeleton className="h-4 w-2/3 mx-auto" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                    {[1, 2, 3].map((j) => (
                      <Skeleton key={j} className="h-48 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen w-full relative">
        <ScrollIndicator />
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Failed to load page content: {error}
              </AlertDescription>
            </Alert>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Fallback to static content if no CMS data is available
  if (!landingPage || sections.length === 0) {
    return (
      <div className="flex flex-col min-h-screen w-full relative">
        <ScrollIndicator />
        <NavBar />
        <main className="flex-1">
          <div className="py-16 md:py-24 relative overflow-hidden">
            <AbstractBackground className="opacity-90 dark:opacity-80" />
            <div className="container px-4 md:px-6 relative text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight mb-8">
                Welcome to 1Tech Academy
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Content management system is being set up. Please check back soon.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen w-full relative">
      {/* Scroll Indicator */}
      <ScrollIndicator />

      {/* Header */}
      <NavBar />

      <main className="flex-1">
        {/* Background for all sections */}
        <div className="relative">
          <AbstractBackground className="opacity-90 dark:opacity-80 fixed inset-0 z-0" />
          
          {/* Dynamic sections */}
          <div className="relative z-10">
            <DynamicSectionRenderer sections={sections} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

// Usage instructions:
// 1. Replace the content of app/page.tsx with this component
// 2. Or create a new route that uses this component
// 3. The page will automatically load content from the CMS
// 4. Admins can edit content through /admin/website/pages/landing
// 5. Changes will be reflected immediately on the frontend

/*
Example of how to replace app/page.tsx:

// app/page.tsx
export { default } from './dynamic-landing-page'

Or import and use directly:

// app/page.tsx
import DynamicLandingPage from './dynamic-landing-page'
export default DynamicLandingPage
*/
