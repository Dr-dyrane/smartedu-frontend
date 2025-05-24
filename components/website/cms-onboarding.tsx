"use client"

import React, { useState } from 'react'
import { DyraneButton } from '@/components/dyrane-ui/dyrane-button'
import { DyraneCard } from '@/components/dyrane-ui/dyrane-card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  FileText, 
  Image, 
  Settings, 
  Eye,
  Upload,
  Edit3,
  Globe,
  X
} from 'lucide-react'
import Link from 'next/link'

interface CMSOnboardingProps {
  onComplete?: () => void
  onSkip?: () => void
  className?: string
}

/**
 * CMS Onboarding Component
 * Guides users through the main CMS features with a step-by-step walkthrough
 */
export function CMSOnboarding({ onComplete, onSkip, className }: CMSOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to Website CMS",
      description: "Your new content management system is ready! Let's take a quick tour of what you can do.",
      icon: <Settings className="h-8 w-8 text-blue-600" />,
      content: (
        <div className="text-center space-y-4">
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <Settings className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">Welcome to Website CMS</h3>
          <p className="text-muted-foreground">
            You now have access to a powerful content management system that lets you control your website content without technical knowledge.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Manage Pages</p>
            </div>
            <div className="text-center">
              <Image className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">Upload Media</p>
            </div>
            <div className="text-center">
              <Globe className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Live Updates</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Dashboard Overview",
      description: "Your CMS dashboard provides quick access to all content management features.",
      icon: <FileText className="h-8 w-8 text-green-600" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dashboard Features</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Page Management</h4>
                <p className="text-sm text-muted-foreground">View, edit, and create website pages with real-time preview</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Image className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Media Library</h4>
                <p className="text-sm text-muted-foreground">Upload and organize images, videos, and documents</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
              <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Website Settings</h4>
                <p className="text-sm text-muted-foreground">Configure global website settings and preferences</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Managing Content",
      description: "Learn how to edit your website content and see changes instantly.",
      icon: <Edit3 className="h-8 w-8 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content Management</h3>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Step 1</Badge>
                <span className="font-medium">Select a Page</span>
              </div>
              <p className="text-sm text-muted-foreground">Choose the page you want to edit from the dashboard</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Step 2</Badge>
                <span className="font-medium">Edit Content</span>
              </div>
              <p className="text-sm text-muted-foreground">Modify text, images, and section settings using the editor</p>
            </div>
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">Step 3</Badge>
                <span className="font-medium">Preview & Publish</span>
              </div>
              <p className="text-sm text-muted-foreground">Preview your changes and publish them live to your website</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Media Management",
      description: "Upload and organize your media files for use throughout your website.",
      icon: <Upload className="h-8 w-8 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Media Library Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Files
              </h4>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to upload images, videos, and documents
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Organize & Preview
              </h4>
              <p className="text-sm text-muted-foreground">
                View files in grid or list mode, search, and filter by type
              </p>
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Supported File Types</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">JPG</Badge>
              <Badge variant="secondary" className="text-xs">PNG</Badge>
              <Badge variant="secondary" className="text-xs">GIF</Badge>
              <Badge variant="secondary" className="text-xs">MP4</Badge>
              <Badge variant="secondary" className="text-xs">PDF</Badge>
              <Badge variant="secondary" className="text-xs">DOC</Badge>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "You're All Set!",
      description: "Start managing your website content with confidence.",
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      content: (
        <div className="text-center space-y-4">
          <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold">Ready to Get Started!</h3>
          <p className="text-muted-foreground">
            You're now ready to manage your website content. Remember, all changes are saved automatically and you can preview them before publishing.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            <DyraneButton asChild variant="outline" className="w-full">
              <Link href="/admin/website">
                <FileText className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Link>
            </DyraneButton>
            <DyraneButton asChild className="w-full">
              <Link href="/admin/website/pages/landing">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Landing Page
              </Link>
            </DyraneButton>
          </div>
        </div>
      )
    }
  ]

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    localStorage.setItem('cms-onboarding-completed', 'true')
    if (onComplete) {
      onComplete()
    }
  }

  const handleSkip = () => {
    localStorage.setItem('cms-onboarding-completed', 'true')
    if (onSkip) {
      onSkip()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <DyraneCard className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {currentStepData.icon}
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
              </div>
              <Badge variant="outline" className="text-xs">
                {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <DyraneButton variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </DyraneButton>
          </div>

          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Content */}
          <div className="mb-8">
            <p className="text-muted-foreground mb-6">{currentStepData.description}</p>
            {currentStepData.content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <DyraneButton 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </DyraneButton>
            </div>

            <div className="flex gap-2">
              <DyraneButton variant="ghost" onClick={handleSkip}>
                Skip Tour
              </DyraneButton>
              <DyraneButton onClick={handleNext}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
              </DyraneButton>
            </div>
          </div>
        </div>
      </DyraneCard>
    </div>
  )
}
