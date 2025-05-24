// Website CMS Types

export interface WebsitePage {
  id: string
  title: string
  slug: string
  status: 'published' | 'draft'
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  sections: PageSection[]
  createdAt: string
  updatedAt: string
  author: string
  views?: number
}

export interface PageSection {
  id: string
  name: string
  type: SectionType
  enabled: boolean
  order: number
  data: SectionData
}

export type SectionType =
  | 'hero'
  | 'content'
  | 'features'
  | 'courses'
  | 'technologies'
  | 'testimonials'
  | 'contact'
  | 'cta'
  | 'gallery'
  | 'team'
  | 'pricing'
  | 'faq'

export interface SectionData {
  title?: string
  subtitle?: string
  description?: string
  content?: string
  backgroundImage?: string
  primaryCTA?: {
    text: string
    href: string
    style?: 'primary' | 'secondary' | 'outline'
  }
  secondaryCTA?: {
    text: string
    href: string
    style?: 'primary' | 'secondary' | 'outline'
  }
  features?: Feature[]
  testimonials?: Testimonial[]
  team?: TeamMember[]
  gallery?: MediaFile[]
  // Contact specific
  address?: string
  phone?: string
  email?: string
  // Hero specific
  heroImage?: string
  // Custom fields for different section types
  [key: string]: any
}

export interface Feature {
  id: string
  title: string
  description: string
  icon?: string
  image?: string
  link?: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company?: string
  content: string
  avatar?: string
  rating?: number
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  avatar?: string
  social?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
}

export interface MediaFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  url: string
  size: number
  dimensions?: {
    width: number
    height: number
  }
  alt?: string
  caption?: string
  uploadedAt: string
  usedIn: string[] // Array of page/section IDs where this media is used
}

export interface WebsiteSettings {
  // General
  siteName: string
  siteDescription: string
  siteUrl: string
  adminEmail: string

  // SEO
  metaTitle: string
  metaDescription: string
  metaKeywords: string

  // Contact
  contactEmail: string
  contactPhone: string
  contactAddress: string

  // Social Media
  socialMedia: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
    youtube?: string
    tiktok?: string
  }

  // Features
  features: {
    enableRegistration: boolean
    enableComments: boolean
    enableNewsletter: boolean
    enableAnalytics: boolean
  }

  // Appearance
  appearance: {
    primaryColor: string
    secondaryColor: string
    logoUrl: string
    darkLogoUrl: string
    faviconUrl: string
  }

  // Analytics
  analytics?: {
    googleAnalyticsId?: string
    facebookPixelId?: string
  }
}

export interface SectionTemplate {
  id: string
  name: string
  type: SectionType
  description: string
  thumbnail?: string
  defaultData: SectionData
  isReusable: boolean
  category: 'header' | 'content' | 'footer' | 'special'
}

// API Response Types
export interface WebsitePageResponse {
  success: boolean
  data: WebsitePage
  message?: string
}

export interface WebsitePagesResponse {
  success: boolean
  data: WebsitePage[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

export interface MediaFilesResponse {
  success: boolean
  data: MediaFile[]
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  message?: string
}

export interface WebsiteSettingsResponse {
  success: boolean
  data: WebsiteSettings
  message?: string
}

// Form Types
export interface CreatePageRequest {
  title: string
  slug: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  status: 'published' | 'draft'
}

export interface UpdatePageRequest extends Partial<CreatePageRequest> {
  sections?: PageSection[]
}

export interface CreateSectionRequest {
  name: string
  type: SectionType
  data: SectionData
  pageId: string
  order?: number
}

export interface UpdateSectionRequest extends Partial<CreateSectionRequest> {
  enabled?: boolean
}

export interface UploadMediaRequest {
  file: File
  alt?: string
  caption?: string
}

// Utility Types
export interface PageStats {
  totalPages: number
  publishedPages: number
  draftPages: number
  totalSections: number
  mediaFiles: number
}

export interface MediaStats {
  totalFiles: number
  totalSize: string
  images: number
  videos: number
  documents: number
}

export interface SectionStats {
  totalSections: number
  activeSections: number
  draftSections: number
  reusableSections: number
}

// Additional types for CMS functionality
export interface OnboardingStep {
  number: number
  title: string
  description: string
  icon?: string
}

export interface CallToAction {
  text: string
  href: string
  style?: 'primary' | 'secondary' | 'outline'
}

// Error handling types
export interface CMSError {
  code: string
  message: string
  field?: string
  details?: any
}

// Validation types
export interface ValidationResult {
  isValid: boolean
  errors: CMSError[]
  warnings: CMSError[]
}
