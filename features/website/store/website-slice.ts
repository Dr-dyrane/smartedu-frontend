import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import {
  WebsitePage,
  WebsiteSettings,
  MediaFile,
  PageSection,
  CreatePageRequest,
  UpdatePageRequest,
  CreateSectionRequest,
  UpdateSectionRequest,
  UploadMediaRequest,
  WebsitePagesResponse,
  WebsitePageResponse,
  MediaFilesResponse,
  MediaFileResponse,
  WebsiteSettingsResponse
} from '@/types/website.types'
import { getCMSApiUrl } from '@/lib/env/website-cms'

// Async Thunks
export const fetchPages = createAsyncThunk(
  'website/fetchPages',
  async (params?: { page?: number; limit?: number; status?: string; search?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.status) queryParams.append('status', params.status)
    if (params?.search) queryParams.append('search', params.search)

    const response = await fetch(`${getCMSApiUrl('pages')}?${queryParams}`)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch pages')
    }

    const data: WebsitePagesResponse = await response.json()
    return data
  }
)

export const fetchPage = createAsyncThunk(
  'website/fetchPage',
  async (pageId: string) => {
    const response = await fetch(getCMSApiUrl(`pages/${pageId}`))
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to fetch page')
    }

    const data: WebsitePageResponse = await response.json()
    return data
  }
)

export const createPage = createAsyncThunk(
  'website/createPage',
  async (pageData: CreatePageRequest) => {
    const response = await fetch(getCMSApiUrl('pages'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to create page')
    }

    const data: WebsitePageResponse = await response.json()
    return data
  }
)

export const updatePage = createAsyncThunk(
  'website/updatePage',
  async ({ pageId, data }: { pageId: string; data: UpdatePageRequest }) => {
    const response = await fetch(getCMSApiUrl(`pages/${pageId}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to update page')
    }

    const result: WebsitePageResponse = await response.json()
    return result
  }
)

export const deletePage = createAsyncThunk(
  'website/deletePage',
  async (pageId: string) => {
    const response = await fetch(`/api/website/pages/${pageId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete page')
    return { pageId }
  }
)

export const fetchMediaFiles = createAsyncThunk(
  'website/fetchMediaFiles',
  async (params?: { page?: number; limit?: number; type?: string }) => {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.type) queryParams.append('type', params.type)

    const response = await fetch(`/api/website/media?${queryParams}`)
    if (!response.ok) throw new Error('Failed to fetch media files')
    return response.json()
  }
)

export const uploadMedia = createAsyncThunk(
  'website/uploadMedia',
  async (uploadData: UploadMediaRequest) => {
    const formData = new FormData()
    formData.append('file', uploadData.file)
    if (uploadData.alt) formData.append('alt', uploadData.alt)
    if (uploadData.caption) formData.append('caption', uploadData.caption)

    const response = await fetch('/api/website/media/upload', {
      method: 'POST',
      body: formData
    })
    if (!response.ok) throw new Error('Failed to upload media')
    return response.json()
  }
)

export const deleteMedia = createAsyncThunk(
  'website/deleteMedia',
  async (mediaId: string) => {
    const response = await fetch(`/api/website/media/${mediaId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete media')
    return { mediaId }
  }
)

export const fetchSettings = createAsyncThunk(
  'website/fetchSettings',
  async () => {
    const response = await fetch('/api/website/settings')
    if (!response.ok) throw new Error('Failed to fetch settings')
    return response.json()
  }
)

export const updateSettings = createAsyncThunk(
  'website/updateSettings',
  async (settings: Partial<WebsiteSettings>) => {
    const response = await fetch('/api/website/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    })
    if (!response.ok) throw new Error('Failed to update settings')
    return response.json()
  }
)

export const createSection = createAsyncThunk(
  'website/createSection',
  async (sectionData: CreateSectionRequest) => {
    const response = await fetch('/api/website/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sectionData)
    })
    if (!response.ok) throw new Error('Failed to create section')
    return response.json()
  }
)

export const updateSection = createAsyncThunk(
  'website/updateSection',
  async ({ sectionId, data }: { sectionId: string; data: UpdateSectionRequest }) => {
    const response = await fetch(`/api/website/sections/${sectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error('Failed to update section')
    return response.json()
  }
)

export const deleteSection = createAsyncThunk(
  'website/deleteSection',
  async (sectionId: string) => {
    const response = await fetch(`/api/website/sections/${sectionId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Failed to delete section')
    return { sectionId }
  }
)

// Initial State
interface WebsiteState {
  pages: WebsitePage[]
  currentPage: WebsitePage | null
  mediaFiles: MediaFile[]
  settings: WebsiteSettings | null
  loading: {
    pages: boolean
    currentPage: boolean
    media: boolean
    settings: boolean
    upload: boolean
  }
  error: {
    pages: string | null
    currentPage: string | null
    media: string | null
    settings: string | null
    upload: string | null
  }
  pagination: {
    pages: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    media: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

const initialState: WebsiteState = {
  pages: [],
  currentPage: null,
  mediaFiles: [],
  settings: null,
  loading: {
    pages: false,
    currentPage: false,
    media: false,
    settings: false,
    upload: false
  },
  error: {
    pages: null,
    currentPage: null,
    media: null,
    settings: null,
    upload: null
  },
  pagination: {
    pages: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    media: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  }
}

// Slice
const websiteSlice = createSlice({
  name: 'website',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = {
        pages: null,
        currentPage: null,
        media: null,
        settings: null,
        upload: null
      }
    },
    setCurrentPage: (state, action: PayloadAction<WebsitePage | null>) => {
      state.currentPage = action.payload
    },
    updatePageSection: (state, action: PayloadAction<{ pageId: string; section: PageSection }>) => {
      const { pageId, section } = action.payload

      // Update in pages array
      const pageIndex = state.pages.findIndex(p => p.id === pageId)
      if (pageIndex !== -1) {
        const sectionIndex = state.pages[pageIndex].sections.findIndex(s => s.id === section.id)
        if (sectionIndex !== -1) {
          state.pages[pageIndex].sections[sectionIndex] = section
        } else {
          state.pages[pageIndex].sections.push(section)
        }
      }

      // Update current page if it matches
      if (state.currentPage?.id === pageId) {
        const sectionIndex = state.currentPage.sections.findIndex(s => s.id === section.id)
        if (sectionIndex !== -1) {
          state.currentPage.sections[sectionIndex] = section
        } else {
          state.currentPage.sections.push(section)
        }
      }
    },
    removePageSection: (state, action: PayloadAction<{ pageId: string; sectionId: string }>) => {
      const { pageId, sectionId } = action.payload

      // Remove from pages array
      const pageIndex = state.pages.findIndex(p => p.id === pageId)
      if (pageIndex !== -1) {
        state.pages[pageIndex].sections = state.pages[pageIndex].sections.filter(s => s.id !== sectionId)
      }

      // Remove from current page if it matches
      if (state.currentPage?.id === pageId) {
        state.currentPage.sections = state.currentPage.sections.filter(s => s.id !== sectionId)
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch Pages
    builder
      .addCase(fetchPages.pending, (state) => {
        state.loading.pages = true
        state.error.pages = null
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.loading.pages = false
        state.pages = action.payload.data
        if (action.payload.pagination) {
          state.pagination.pages = action.payload.pagination
        }
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.loading.pages = false
        state.error.pages = action.error.message || 'Failed to fetch pages'
      })

    // Fetch Page
    builder
      .addCase(fetchPage.pending, (state) => {
        state.loading.currentPage = true
        state.error.currentPage = null
      })
      .addCase(fetchPage.fulfilled, (state, action) => {
        state.loading.currentPage = false
        state.currentPage = action.payload.data
      })
      .addCase(fetchPage.rejected, (state, action) => {
        state.loading.currentPage = false
        state.error.currentPage = action.error.message || 'Failed to fetch page'
      })

    // Create Page
    builder
      .addCase(createPage.fulfilled, (state, action) => {
        state.pages.unshift(action.payload.data)
      })

    // Update Page
    builder
      .addCase(updatePage.fulfilled, (state, action) => {
        const index = state.pages.findIndex(p => p.id === action.payload.data.id)
        if (index !== -1) {
          state.pages[index] = action.payload.data
        }
        if (state.currentPage?.id === action.payload.data.id) {
          state.currentPage = action.payload.data
        }
      })

    // Delete Page
    builder
      .addCase(deletePage.fulfilled, (state, action) => {
        state.pages = state.pages.filter(p => p.id !== action.payload.pageId)
        if (state.currentPage?.id === action.payload.pageId) {
          state.currentPage = null
        }
      })

    // Fetch Media Files
    builder
      .addCase(fetchMediaFiles.pending, (state) => {
        state.loading.media = true
        state.error.media = null
      })
      .addCase(fetchMediaFiles.fulfilled, (state, action) => {
        state.loading.media = false
        state.mediaFiles = action.payload.data
        if (action.payload.pagination) {
          state.pagination.media = action.payload.pagination
        }
      })
      .addCase(fetchMediaFiles.rejected, (state, action) => {
        state.loading.media = false
        state.error.media = action.error.message || 'Failed to fetch media files'
      })

    // Upload Media
    builder
      .addCase(uploadMedia.pending, (state) => {
        state.loading.upload = true
        state.error.upload = null
      })
      .addCase(uploadMedia.fulfilled, (state, action) => {
        state.loading.upload = false
        state.mediaFiles.unshift(action.payload.data)
      })
      .addCase(uploadMedia.rejected, (state, action) => {
        state.loading.upload = false
        state.error.upload = action.error.message || 'Failed to upload media'
      })

    // Delete Media
    builder
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.mediaFiles = state.mediaFiles.filter(m => m.id !== action.payload.mediaId)
      })

    // Fetch Settings
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading.settings = true
        state.error.settings = null
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading.settings = false
        state.settings = action.payload.data
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading.settings = false
        state.error.settings = action.error.message || 'Failed to fetch settings'
      })

    // Update Settings
    builder
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload.data
      })
  }
})

export const {
  clearErrors,
  setCurrentPage,
  updatePageSection,
  removePageSection
} = websiteSlice.actions

export default websiteSlice.reducer
