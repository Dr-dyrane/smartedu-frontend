import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchPages,
  fetchPage,
  fetchMediaFiles,
  fetchSettings,
  createPage,
  updatePage,
  deletePage,
  uploadMedia,
  deleteMedia,
  updateSettings,
  setCurrentPage,
  clearErrors,
  clearError,
  setViewMode,
  setFilterType,
  setSearchTerm
} from '@/features/website/store/website-slice'
import {
  CreatePageRequest,
  UpdatePageRequest,
  UploadMediaRequest,
  WebsiteSettings
} from '@/types/website.types'

export function useWebsitePages() {
  const dispatch = useAppDispatch()
  const { pages, loading, error, pagination } = useAppSelector(state => state.website)

  const loadPages = (params?: { page?: number; limit?: number; status?: string }) => {
    dispatch(fetchPages(params))
  }

  const createNewPage = async (pageData: CreatePageRequest) => {
    const result = await dispatch(createPage(pageData))
    return result
  }

  const updateExistingPage = async (pageId: string, data: UpdatePageRequest) => {
    const result = await dispatch(updatePage({ pageId, data }))
    return result
  }

  const removeePage = async (pageId: string) => {
    const result = await dispatch(deletePage(pageId))
    return result
  }

  return {
    pages,
    loading: loading.pages,
    error: error.pages,
    pagination: pagination.pages,
    loadPages,
    createNewPage,
    updateExistingPage,
    removeePage
  }
}

export function useWebsitePage(pageId?: string) {
  const dispatch = useAppDispatch()
  const { currentPage, loading, error } = useAppSelector(state => state.website)

  useEffect(() => {
    if (pageId) {
      dispatch(fetchPage(pageId))
    }
  }, [pageId, dispatch])

  const loadPage = (id: string) => {
    dispatch(fetchPage(id))
  }

  const updateCurrentPage = async (data: UpdatePageRequest) => {
    if (!currentPage) return
    const result = await dispatch(updatePage({ pageId: currentPage.id, data }))
    return result
  }

  return {
    page: currentPage,
    loading: loading.currentPage,
    error: error.currentPage,
    loadPage,
    updateCurrentPage
  }
}

export function useWebsiteMedia() {
  const dispatch = useAppDispatch()
  const { mediaFiles, loading, error, pagination } = useAppSelector(state => state.website)

  const loadMediaFiles = (params?: { page?: number; limit?: number; type?: string }) => {
    dispatch(fetchMediaFiles(params))
  }

  const uploadNewMedia = async (uploadData: UploadMediaRequest) => {
    const result = await dispatch(uploadMedia(uploadData))
    return result
  }

  const removeMedia = async (mediaId: string) => {
    const result = await dispatch(deleteMedia(mediaId))
    return result
  }

  return {
    mediaFiles,
    loading: loading.media,
    error: error.media,
    uploadLoading: loading.upload,
    uploadError: error.upload,
    pagination: pagination.media,
    loadMediaFiles,
    uploadNewMedia,
    removeMedia
  }
}

export function useWebsiteSettings() {
  const dispatch = useAppDispatch()
  const { settings, loading, error } = useAppSelector(state => state.website)

  useEffect(() => {
    dispatch(fetchSettings())
  }, [dispatch])

  const loadSettings = () => {
    dispatch(fetchSettings())
  }

  const saveSettings = async (settingsData: Partial<WebsiteSettings>) => {
    const result = await dispatch(updateSettings(settingsData))
    return result
  }

  return {
    settings,
    loading: loading.settings,
    error: error.settings,
    loadSettings,
    saveSettings
  }
}

// Hook for getting landing page data specifically
export function useLandingPageData() {
  const dispatch = useAppDispatch()
  const { pages, currentPage, loading, error } = useAppSelector(state => state.website)

  useEffect(() => {
    // Try to find landing page in existing pages first
    const landingPage = pages.find(page => page.slug === '/')

    if (!landingPage) {
      // If not found, fetch it specifically
      dispatch(fetchPage('landing'))
    } else if (!currentPage || currentPage.slug !== '/') {
      // Set as current page if it's not already
      dispatch(fetchPage('landing'))
    }
  }, [dispatch, pages, currentPage])

  const landingPage = currentPage?.slug === '/' ? currentPage : pages.find(page => page.slug === '/')

  return {
    landingPage,
    loading: loading.currentPage,
    error: error.currentPage,
    sections: landingPage?.sections || []
  }
}

// Hook for website statistics
export function useWebsiteStats() {
  const { pages, mediaFiles } = useAppSelector(state => state.website)

  const stats = {
    totalPages: pages.length,
    publishedPages: pages.filter(p => p.status === 'published').length,
    draftPages: pages.filter(p => p.status === 'draft').length,
    totalSections: pages.reduce((total, page) => total + page.sections.length, 0),
    mediaFiles: mediaFiles.length,
    totalMediaSize: mediaFiles.reduce((total, file) => total + file.size, 0),
    imageFiles: mediaFiles.filter(f => f.type === 'image').length,
    videoFiles: mediaFiles.filter(f => f.type === 'video').length,
    documentFiles: mediaFiles.filter(f => f.type === 'document').length
  }

  return stats
}

// Hook for managing page sections
export function usePageSections(pageId?: string) {
  const dispatch = useAppDispatch()
  const { currentPage } = useAppSelector(state => state.website)

  const sections = currentPage?.id === pageId ? currentPage.sections : []

  const updatePageSections = async (newSections: any[]) => {
    if (!pageId) return

    const result = await dispatch(updatePage({
      pageId,
      data: { sections: newSections }
    }))
    return result
  }

  const toggleSection = async (sectionId: string, enabled: boolean) => {
    if (!pageId || !currentPage) return

    const updatedSections = currentPage.sections.map(section =>
      section.id === sectionId ? { ...section, enabled } : section
    )

    return updatePageSections(updatedSections)
  }

  const updateSectionData = async (sectionId: string, data: any) => {
    if (!pageId || !currentPage) return

    const updatedSections = currentPage.sections.map(section =>
      section.id === sectionId ? { ...section, data: { ...section.data, ...data } } : section
    )

    return updatePageSections(updatedSections)
  }

  const reorderSections = async (newOrder: string[]) => {
    if (!pageId || !currentPage) return

    const updatedSections = newOrder.map((sectionId, index) => {
      const section = currentPage.sections.find(s => s.id === sectionId)
      return section ? { ...section, order: index + 1 } : null
    }).filter(Boolean)

    return updatePageSections(updatedSections)
  }

  return {
    sections,
    updatePageSections,
    toggleSection,
    updateSectionData,
    reorderSections
  }
}
