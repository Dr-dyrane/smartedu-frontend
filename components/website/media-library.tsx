"use client"

import React, { useState, useCallback } from 'react'
import { useWebsiteMedia } from '@/hooks/useWebsiteData'
import { MediaFile } from '@/types/website.types'
import { DyraneButton } from '@/components/dyrane-ui/dyrane-button'
import { DyraneCard } from '@/components/dyrane-ui/dyrane-card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  Search, 
  Grid3X3, 
  List, 
  Filter,
  Image,
  Video,
  FileText,
  Trash2,
  Eye,
  Download,
  Copy,
  MoreHorizontal,
  AlertTriangle
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatFileSize } from '@/lib/env/website-cms'
import { toast } from 'sonner'

interface MediaLibraryProps {
  onSelectMedia?: (media: MediaFile) => void
  selectedMediaIds?: string[]
  selectionMode?: boolean
  className?: string
}

/**
 * Media Library component for managing website media files
 * Supports upload, view, search, filter, and delete operations
 */
export function MediaLibrary({ 
  onSelectMedia, 
  selectedMediaIds = [],
  selectionMode = false,
  className 
}: MediaLibraryProps) {
  const {
    mediaFiles,
    loading,
    error,
    uploadLoading,
    uploadError,
    pagination,
    viewMode,
    filterType,
    searchTerm,
    loadMediaFiles,
    uploadNewMedia,
    removeMedia,
    setMediaViewMode,
    setMediaFilterType,
    setMediaSearchTerm,
    clearMediaErrors
  } = useWebsiteMedia()

  const [dragOver, setDragOver] = useState(false)

  // Load media files on mount
  React.useEffect(() => {
    loadMediaFiles()
  }, [])

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        await uploadNewMedia({ file })
        toast.success(`${file.name} uploaded successfully`)
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`)
      }
    }
  }, [uploadNewMedia])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }, [handleFileUpload])

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      handleFileUpload(files)
    }
    // Reset input
    e.target.value = ''
  }, [handleFileUpload])

  // Handle media deletion
  const handleDeleteMedia = useCallback(async (mediaId: string) => {
    try {
      await removeMedia(mediaId)
      toast.success('Media file deleted successfully')
    } catch (error) {
      toast.error('Failed to delete media file')
    }
  }, [removeMedia])

  // Handle media selection
  const handleSelectMedia = useCallback((media: MediaFile) => {
    if (onSelectMedia) {
      onSelectMedia(media)
    }
  }, [onSelectMedia])

  // Copy media URL to clipboard
  const copyMediaUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Media URL copied to clipboard')
  }, [])

  // Get file type icon
  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Filter media files
  const filteredMedia = mediaFiles.filter(media => {
    const matchesType = filterType === 'all' || media.type === filterType
    const matchesSearch = !searchTerm || 
      media.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.alt?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesType && matchesSearch
  })

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            value={searchTerm}
            onChange={(e) => setMediaSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DyraneButton variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {filterType === 'all' ? 'All Files' : 
                 filterType === 'image' ? 'Images' :
                 filterType === 'video' ? 'Videos' : 'Documents'}
              </DyraneButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setMediaFilterType('all')}>
                All Files
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMediaFilterType('image')}>
                <Image className="h-4 w-4 mr-2" />
                Images
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMediaFilterType('video')}>
                <Video className="h-4 w-4 mr-2" />
                Videos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setMediaFilterType('document')}>
                <FileText className="h-4 w-4 mr-2" />
                Documents
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex items-center border rounded-md">
            <DyraneButton
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMediaViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </DyraneButton>
            <DyraneButton
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setMediaViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </DyraneButton>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <DyraneCard 
        className={`mb-6 border-2 border-dashed transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Upload Media Files</h3>
          <p className="text-muted-foreground mb-4">
            Drag and drop files here, or click to select files
          </p>
          <input
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx"
            onChange={handleFileInputChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <DyraneButton asChild disabled={uploadLoading}>
              <span>
                {uploadLoading ? 'Uploading...' : 'Select Files'}
              </span>
            </DyraneButton>
          </label>
        </div>
      </DyraneCard>

      {/* Error Messages */}
      {(error || uploadError) && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || uploadError}
            <DyraneButton 
              variant="ghost" 
              size="sm" 
              onClick={clearMediaErrors}
              className="ml-2"
            >
              Dismiss
            </DyraneButton>
          </AlertDescription>
        </Alert>
      )}

      {/* Media Grid/List */}
      {loading ? (
        <div className={viewMode === 'grid' ? 
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4' : 
          'space-y-2'
        }>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className={viewMode === 'grid' ? 'aspect-square' : 'h-16'} />
          ))}
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="text-center py-12">
          <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Media Files</h3>
          <p className="text-muted-foreground">
            {searchTerm || filterType !== 'all' 
              ? 'No files match your search criteria' 
              : 'Upload some files to get started'
            }
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4' : 
          'space-y-2'
        }>
          {filteredMedia.map((media) => (
            <MediaFileCard
              key={media.id}
              media={media}
              viewMode={viewMode}
              isSelected={selectedMediaIds.includes(media.id)}
              selectionMode={selectionMode}
              onSelect={() => handleSelectMedia(media)}
              onDelete={() => handleDeleteMedia(media.id)}
              onCopyUrl={() => copyMediaUrl(media.url)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <DyraneButton
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => loadMediaFiles({ page: pagination.page - 1 })}
            >
              Previous
            </DyraneButton>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <DyraneButton
              variant="outline"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => loadMediaFiles({ page: pagination.page + 1 })}
            >
              Next
            </DyraneButton>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Individual media file card component
 */
interface MediaFileCardProps {
  media: MediaFile
  viewMode: 'grid' | 'list'
  isSelected: boolean
  selectionMode: boolean
  onSelect: () => void
  onDelete: () => void
  onCopyUrl: () => void
}

function MediaFileCard({ 
  media, 
  viewMode, 
  isSelected, 
  selectionMode,
  onSelect, 
  onDelete, 
  onCopyUrl 
}: MediaFileCardProps) {
  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />
      case 'video':
        return <Video className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (viewMode === 'list') {
    return (
      <DyraneCard 
        className={`p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={onSelect}
      >
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex items-center justify-center">
            {media.type === 'image' ? (
              <img 
                src={media.url} 
                alt={media.alt || media.name}
                className="w-full h-full object-cover"
              />
            ) : (
              getFileTypeIcon(media.type)
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{media.name}</h4>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                {media.type}
              </Badge>
              <span>{formatFileSize(media.size)}</span>
              {media.dimensions && (
                <span>{media.dimensions.width} × {media.dimensions.height}</span>
              )}
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DyraneButton variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </DyraneButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopyUrl() }}>
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(media.url, '_blank') }}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete() }}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </DyraneCard>
    )
  }

  return (
    <DyraneCard 
      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onSelect}
    >
      <div className="aspect-square relative overflow-hidden rounded-t-lg bg-muted">
        {media.type === 'image' ? (
          <img 
            src={media.url} 
            alt={media.alt || media.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {getFileTypeIcon(media.type)}
          </div>
        )}
        
        {/* Actions Overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <DyraneButton variant="secondary" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </DyraneButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopyUrl() }}>
                <Copy className="h-4 w-4 mr-2" />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.open(media.url, '_blank') }}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete() }}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-3">
        <h4 className="font-medium text-sm truncate mb-1">{media.name}</h4>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-xs">
            {media.type}
          </Badge>
          <span>{formatFileSize(media.size)}</span>
        </div>
      </div>
    </DyraneCard>
  )
}
