"use client"

import React, { useState } from 'react'
import { DyraneButton } from '@/components/dyrane-ui/dyrane-button'
import { DyraneCard } from '@/components/dyrane-ui/dyrane-card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  HelpCircle, 
  Search, 
  FileText, 
  Image, 
  Settings, 
  Upload,
  Edit3,
  Eye,
  Save,
  Globe,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Video,
  MessageCircle
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import Link from 'next/link'

interface CMSHelpProps {
  className?: string
}

/**
 * CMS Help & Documentation Component
 * Provides comprehensive help and documentation for CMS features
 */
export function CMSHelp({ className }: CMSHelpProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <BookOpen className="h-5 w-5" />,
      articles: [
        {
          title: 'CMS Overview',
          description: 'Learn the basics of the content management system',
          content: 'The Website CMS allows you to manage your website content without technical knowledge. You can edit pages, upload media, and configure settings through an intuitive interface.'
        },
        {
          title: 'Dashboard Navigation',
          description: 'Understanding the main dashboard interface',
          content: 'The dashboard provides quick access to all CMS features. Use the sidebar to navigate between pages, media, and settings. The main area shows statistics and recent activity.'
        },
        {
          title: 'First Steps',
          description: 'What to do after accessing the CMS for the first time',
          content: 'Start by exploring the dashboard, then try editing the landing page. Upload some media files to get familiar with the media library. Check the settings to configure your preferences.'
        }
      ]
    },
    {
      id: 'page-management',
      title: 'Page Management',
      icon: <FileText className="h-5 w-5" />,
      articles: [
        {
          title: 'Editing Pages',
          description: 'How to edit existing website pages',
          content: 'Click on any page from the dashboard to open the editor. You can modify content, sections, and SEO settings. Changes are saved automatically and can be previewed before publishing.'
        },
        {
          title: 'Page Sections',
          description: 'Managing different sections of your pages',
          content: 'Pages are divided into sections like hero, about, features, etc. You can enable/disable sections, reorder them, and customize their content. Each section has specific settings and options.'
        },
        {
          title: 'SEO Settings',
          description: 'Optimizing your pages for search engines',
          content: 'Use the SEO tab to set meta titles, descriptions, and keywords. The preview shows how your page will appear in search results. Keep titles under 60 characters and descriptions under 160.'
        },
        {
          title: 'Publishing Changes',
          description: 'Making your changes live on the website',
          content: 'After editing, use the preview function to see your changes. When satisfied, click "Save" to publish changes immediately to the live website. All changes are reversible.'
        }
      ]
    },
    {
      id: 'media-library',
      title: 'Media Library',
      icon: <Image className="h-5 w-5" />,
      articles: [
        {
          title: 'Uploading Files',
          description: 'How to upload images, videos, and documents',
          content: 'Drag and drop files onto the upload area or click to select files. Supported formats include JPG, PNG, GIF, MP4, PDF, and DOC. Files are automatically optimized for web use.'
        },
        {
          title: 'Organizing Media',
          description: 'Managing and organizing your media files',
          content: 'Use the search and filter options to find files quickly. Switch between grid and list views. Add alt text and captions to images for better accessibility and SEO.'
        },
        {
          title: 'Using Media in Pages',
          description: 'How to insert media files into your content',
          content: 'When editing pages, click the media button to browse and select files. You can copy media URLs to use in custom content or select files directly in the editor interface.'
        }
      ]
    },
    {
      id: 'settings',
      title: 'Website Settings',
      icon: <Settings className="h-5 w-5" />,
      articles: [
        {
          title: 'Global Settings',
          description: 'Configuring website-wide settings',
          content: 'Access global settings to configure site name, contact information, social media links, and other website-wide preferences. These settings affect the entire website.'
        },
        {
          title: 'Appearance Settings',
          description: 'Customizing the look and feel of your website',
          content: 'Modify colors, fonts, and layout options to match your brand. Changes to appearance settings are applied across all pages automatically.'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <HelpCircle className="h-5 w-5" />,
      articles: [
        {
          title: 'Common Issues',
          description: 'Solutions to frequently encountered problems',
          content: 'If changes don\'t appear immediately, try refreshing the page. For upload issues, check file size and format. Contact support if problems persist.'
        },
        {
          title: 'Browser Compatibility',
          description: 'Supported browsers and requirements',
          content: 'The CMS works best with modern browsers like Chrome, Firefox, Safari, and Edge. Ensure JavaScript is enabled and you have a stable internet connection.'
        },
        {
          title: 'Performance Tips',
          description: 'Optimizing CMS performance',
          content: 'Keep image file sizes reasonable (under 2MB). Use appropriate file formats. Clear browser cache if experiencing slow loading times.'
        }
      ]
    }
  ]

  const filteredSections = helpSections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.articles.length > 0)

  const quickActions = [
    {
      title: 'Edit Landing Page',
      description: 'Start editing your main page',
      icon: <Edit3 className="h-4 w-4" />,
      href: '/admin/website/pages/landing',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900'
    },
    {
      title: 'Upload Media',
      description: 'Add images and files',
      icon: <Upload className="h-4 w-4" />,
      href: '/admin/website/media',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900'
    },
    {
      title: 'View Website',
      description: 'See your live website',
      icon: <Globe className="h-4 w-4" />,
      href: '/',
      color: 'bg-green-100 text-green-600 dark:bg-green-900'
    }
  ]

  return (
    <div className={className}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">CMS Help & Documentation</h1>
        <p className="text-muted-foreground">
          Learn how to use the content management system effectively
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search help articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action, index) => (
          <DyraneCard key={index} className="p-4 hover:shadow-md transition-shadow">
            <Link href={action.href} className="block">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${action.color}`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-medium">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
              </div>
            </Link>
          </DyraneCard>
        ))}
      </div>

      {/* Help Sections */}
      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <DyraneCard className="p-8 text-center">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse the categories below.
            </p>
          </DyraneCard>
        ) : (
          filteredSections.map((section) => (
            <DyraneCard key={section.id} className="p-6">
              <div className="flex items-center gap-3 mb-4">
                {section.icon}
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <Badge variant="outline" className="text-xs">
                  {section.articles.length} articles
                </Badge>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {section.articles.map((article, index) => (
                  <AccordionItem key={index} value={`${section.id}-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div>
                        <h3 className="font-medium">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">{article.description}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2">
                        <p className="text-muted-foreground">{article.content}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </DyraneCard>
          ))
        )}
      </div>

      {/* Additional Resources */}
      <DyraneCard className="p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Video className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium">Video Tutorials</h3>
              <p className="text-sm text-muted-foreground">
                Watch step-by-step video guides for common tasks
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium">Contact Support</h3>
              <p className="text-sm text-muted-foreground">
                Get help from our support team if you need assistance
              </p>
            </div>
          </div>
        </div>
      </DyraneCard>
    </div>
  )
}
