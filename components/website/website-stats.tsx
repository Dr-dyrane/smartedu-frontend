"use client"

import React from 'react'
import { useWebsiteStats } from '@/hooks/useWebsiteData'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  FileText,
  Image,
  Video,
  File,
  Eye,
  Globe,
  Layout,
  TrendingUp
} from 'lucide-react'
import { formatFileSize } from '@/lib/env/website-cms'

interface WebsiteStatsProps {
  className?: string
}

/**
 * Website Statistics Dashboard Component
 * Displays overview statistics for pages, media, and content
 */
export function WebsiteStats({ className }: WebsiteStatsProps) {
  const stats = useWebsiteStats()

  const statCards = [
    {
      title: 'Total Pages',
      value: stats.totalPages,
      icon: <FileText className="h-5 w-5" />,
      description: `${stats.publishedPages} published, ${stats.draftPages} drafts`,
      color: 'blue'
    },
    {
      title: 'Page Sections',
      value: stats.totalSections,
      icon: <Layout className="h-5 w-5" />,
      description: `Average ${stats.totalPages > 0 ? Math.round(stats.totalSections / stats.totalPages) : 0} per page`,
      color: 'green'
    },
    {
      title: 'Media Files',
      value: stats.mediaFiles,
      icon: <Image className="h-5 w-5" />,
      description: formatFileSize(stats.totalMediaSize),
      color: 'purple'
    },
    {
      title: 'Storage Used',
      value: formatFileSize(stats.totalMediaSize),
      icon: <File className="h-5 w-5" />,
      description: `${stats.mediaFiles} files uploaded`,
      color: 'orange'
    }
  ]

  const mediaBreakdown = [
    {
      type: 'Images',
      count: stats.imageFiles,
      percentage: stats.mediaFiles > 0 ? Math.round((stats.imageFiles / stats.mediaFiles) * 100) : 0,
      icon: <Image className="h-4 w-4" />,
      color: 'bg-blue-500'
    },
    {
      type: 'Videos',
      count: stats.videoFiles,
      percentage: stats.mediaFiles > 0 ? Math.round((stats.videoFiles / stats.mediaFiles) * 100) : 0,
      icon: <Video className="h-4 w-4" />,
      color: 'bg-green-500'
    },
    {
      type: 'Documents',
      count: stats.documentFiles,
      percentage: stats.mediaFiles > 0 ? Math.round((stats.documentFiles / stats.mediaFiles) * 100) : 0,
      icon: <File className="h-4 w-4" />,
      color: 'bg-purple-500'
    }
  ]

  const publishingStats = [
    {
      label: 'Published Pages',
      value: stats.publishedPages,
      total: stats.totalPages,
      percentage: stats.totalPages > 0 ? Math.round((stats.publishedPages / stats.totalPages) * 100) : 0,
      color: 'bg-green-500'
    },
    {
      label: 'Draft Pages',
      value: stats.draftPages,
      total: stats.totalPages,
      percentage: stats.totalPages > 0 ? Math.round((stats.draftPages / stats.totalPages) * 100) : 0,
      color: 'bg-yellow-500'
    }
  ]

  return (
    <div className={className}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publishing Status */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Publishing Status</h3>
          </div>

          <div className="space-y-4">
            {publishingStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {stat.value} of {stat.total}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {stat.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={stat.percentage}
                  className="h-2"
                />
              </div>
            ))}
          </div>

          {stats.totalPages === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No pages created yet</p>
            </div>
          )}
        </Card>

        {/* Media Breakdown */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Image className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Media Breakdown</h3>
          </div>

          <div className="space-y-4">
            {mediaBreakdown.map((media, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {media.icon}
                    <span className="text-sm font-medium">{media.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {media.count} files
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {media.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={media.percentage}
                  className="h-2"
                />
              </div>
            ))}
          </div>

          {stats.mediaFiles === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No media files uploaded yet</p>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Quick Insights</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalPages > 0 ? Math.round((stats.publishedPages / stats.totalPages) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">
              Pages Published
            </div>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalPages > 0 ? Math.round(stats.totalSections / stats.totalPages) : 0}
            </div>
            <div className="text-sm text-muted-foreground">
              Avg Sections per Page
            </div>
          </div>

          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.mediaFiles > 0 ? formatFileSize(Math.round(stats.totalMediaSize / stats.mediaFiles)) : '0 B'}
            </div>
            <div className="text-sm text-muted-foreground">
              Avg File Size
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
