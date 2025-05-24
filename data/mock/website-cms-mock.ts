// Mock data for Website CMS
// This provides realistic data for development and fallback scenarios

import {
  WebsitePage,
  MediaFile,
  WebsiteSettings,
  PageSection,
  SectionType
} from '@/types/website.types'

/**
 * Mock Website Pages Data
 * Based on the current landing page structure
 */
export const mockWebsitePages: WebsitePage[] = [
  {
    id: "landing",
    title: "Landing Page",
    slug: "/",
    status: "published",
    metaTitle: "1Tech Academy - Awaken Your Tech Future",
    metaDescription: "Empowering tomorrow's tech leaders through real-world projects, professional certifications, and a transformative learning environment.",
    metaKeywords: "tech education, programming courses, web development, software engineering, tech academy, Nigeria",
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        type: "hero",
        enabled: true,
        order: 1,
        data: {
          title: "Awaken Your Tech Future with 1Tech Academy.",
          subtitle: "Empowering tomorrow's tech leaders through real-world projects, professional certifications, and a transformative learning environment.",
          primaryCTA: {
            text: "Enroll Now",
            href: "/signup",
            style: "primary"
          },
          secondaryCTA: {
            text: "Learn More",
            href: "#courses",
            style: "outline"
          },
          backgroundImage: "/hero-bg.jpg"
        }
      },
      {
        id: "about",
        name: "About Us Section",
        type: "content",
        enabled: true,
        order: 2,
        data: {
          title: "About 1Tech Academy",
          description: "We are a community where creativity thrives, innovation takes shape, and transformation begins.",
          content: "Here, you'll build problem-solving skills, grow your professional network, and gain the confidence to turn ideas into reality."
        }
      },
      {
        id: "why-us",
        name: "Why Choose Us",
        type: "features",
        enabled: true,
        order: 3,
        data: {
          title: "Why Choose 1Tech Academy",
          description: "At 1Tech Academy, you're not just learning, you're joining a network of like-minded professionals, industry leaders, and tech enthusiasts.",
          features: [
            {
              id: "who-we-are",
              title: "Who We Are",
              description: "In today's digital world, technology is the backbone of innovation. At 1Tech Academy, we cultivate future-ready professionals who thrive in the evolving digital landscape.",
              icon: "target"
            },
            {
              id: "what-we-do",
              title: "What We Do",
              description: "Join a network of professionals, leaders, and tech enthusiasts. Our career-focused approach ensures you're job-ready from day one, unlocking limitless opportunities.",
              icon: "eye"
            }
          ]
        }
      },
      {
        id: "courses",
        name: "Explore Our Courses",
        type: "courses",
        enabled: true,
        order: 4,
        data: {
          title: "Explore Our Courses",
          description: "Unlock your potential with industry-leading tech courses taught by experts."
        }
      },
      {
        id: "onboarding",
        name: "Get Started Steps",
        type: "cta",
        enabled: true,
        order: 5,
        data: {
          title: "Get Started with 1Tech Academy",
          description: "Follow these simple steps to begin your learning journey with us.",
          steps: [
            {
              number: 1,
              title: "Sign Up",
              description: "Create your account with your email address to join our learning platform."
            },
            {
              number: 2,
              title: "Explore Courses",
              description: "Browse our catalog of professional courses and select the ones that match your goals."
            },
            {
              number: 3,
              title: "Enroll in Session",
              description: "Choose an available session with open seats that fits your schedule."
            },
            {
              number: 4,
              title: "Learn",
              description: "Access course materials, participate in discussions, and track your progress."
            }
          ],
          primaryCTA: {
            text: "Join 1Tech Today",
            href: "/signup",
            style: "primary"
          }
        }
      },
      {
        id: "technologies",
        name: "Technologies We Teach",
        type: "technologies",
        enabled: true,
        order: 6,
        data: {
          title: "Technologies We Teach",
          description: "Master the tools and platforms shaping the future of tech."
        }
      },
      {
        id: "testimonials",
        name: "Testimonials",
        type: "testimonials",
        enabled: true,
        order: 7,
        data: {
          title: "What Our Clients Say",
          description: "Hear from students, educators, and partners who've transformed their learning journey with 1TechAcademy."
        }
      },
      {
        id: "contact",
        name: "Contact Us",
        type: "contact",
        enabled: true,
        order: 8,
        data: {
          title: "Ready to Get in Touch?",
          description: "Fill out the form or reach out directly through any of the following methods.",
          address: "17 Aje Street, Sabo Yaba Lagos.",
          phone: "+2347074693513",
          email: "info@1techacademy.com"
        }
      }
    ],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:22:00Z",
    author: "Admin",
    views: 1250
  },
  {
    id: "about",
    title: "About Us",
    slug: "/about",
    status: "published",
    metaTitle: "About 1Tech Academy - Our Mission & Vision",
    metaDescription: "Learn more about our mission, vision, and commitment to tech education excellence in Africa.",
    metaKeywords: "about 1tech academy, mission, vision, tech education, Nigeria",
    sections: [
      {
        id: "about-hero",
        name: "About Hero",
        type: "hero",
        enabled: true,
        order: 1,
        data: {
          title: "About 1Tech Academy",
          subtitle: "Shaping the future of tech education in Africa",
          backgroundImage: "/about-hero.jpg"
        }
      },
      {
        id: "mission-vision",
        name: "Mission & Vision",
        type: "content",
        enabled: true,
        order: 2,
        data: {
          title: "Our Mission & Vision",
          description: "Driving transformation through technology education",
          content: "Our mission is to empower Africa's next generation of tech leaders by delivering world-class, hands-on training through in-person mentorship, global expertise, and an uncompromising standard of excellence."
        }
      }
    ],
    createdAt: "2024-01-14T15:45:00Z",
    updatedAt: "2024-01-14T15:45:00Z",
    author: "Admin",
    views: 890
  },
  {
    id: "contact",
    title: "Contact",
    slug: "/contact",
    status: "draft",
    metaTitle: "Contact 1Tech Academy",
    metaDescription: "Get in touch with us for inquiries about our courses and programs.",
    metaKeywords: "contact, 1tech academy, inquiries, support",
    sections: [
      {
        id: "contact-form",
        name: "Contact Form",
        type: "contact",
        enabled: true,
        order: 1,
        data: {
          title: "Get in Touch",
          description: "We'd love to hear from you",
          address: "17 Aje Street, Sabo Yaba Lagos.",
          phone: "+2347074693513",
          email: "info@1techacademy.com"
        }
      }
    ],
    createdAt: "2024-01-12T09:20:00Z",
    updatedAt: "2024-01-12T09:20:00Z",
    author: "Admin",
    views: 0
  },
  {
    id: "courses",
    title: "Our Courses",
    slug: "/public-courses",
    status: "published",
    metaTitle: "Tech Courses at 1Tech Academy",
    metaDescription: "Explore our comprehensive range of technology courses designed for professionals.",
    metaKeywords: "tech courses, programming, web development, software engineering",
    sections: [
      {
        id: "courses-hero",
        name: "Courses Hero",
        type: "hero",
        enabled: true,
        order: 1,
        data: {
          title: "Our Courses",
          subtitle: "Professional tech education for the modern world",
          backgroundImage: "/courses-hero.jpg"
        }
      },
      {
        id: "courses-grid",
        name: "Courses Grid",
        type: "courses",
        enabled: true,
        order: 2,
        data: {
          title: "Available Courses",
          description: "Choose from our range of professional courses"
        }
      }
    ],
    createdAt: "2024-01-10T14:15:00Z",
    updatedAt: "2024-01-10T14:15:00Z",
    author: "Admin",
    views: 2100
  },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    slug: "/privacy-policy",
    status: "published",
    metaTitle: "Privacy Policy - 1Tech Academy",
    metaDescription: "Our commitment to protecting your privacy and personal data.",
    metaKeywords: "privacy policy, data protection, GDPR, personal information",
    sections: [
      {
        id: "privacy-overview",
        name: "Privacy Policy Overview",
        type: "content",
        enabled: true,
        order: 1,
        data: {
          title: "Privacy Policy",
          description: "Last updated: January 2024",
          content: "At 1Tech Academy, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services."
        }
      },
      {
        id: "data-collection",
        name: "Information We Collect",
        type: "content",
        enabled: true,
        order: 2,
        data: {
          title: "Information We Collect",
          description: "What data we gather and how",
          content: "We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us. This may include your name, email address, phone number, and educational background."
        }
      },
      {
        id: "data-usage",
        name: "How We Use Your Information",
        type: "content",
        enabled: true,
        order: 3,
        data: {
          title: "How We Use Your Information",
          description: "Our data usage practices",
          content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send communications, and comply with legal obligations."
        }
      }
    ],
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    author: "Admin",
    views: 156
  },
  {
    id: "terms-conditions",
    title: "Terms and Conditions",
    slug: "/terms-conditions",
    status: "published",
    metaTitle: "Terms and Conditions - 1Tech Academy",
    metaDescription: "Terms of service and conditions for using 1Tech Academy platform and services.",
    metaKeywords: "terms of service, conditions, legal, agreement, platform usage",
    sections: [
      {
        id: "terms-overview",
        name: "Terms Overview",
        type: "content",
        enabled: true,
        order: 1,
        data: {
          title: "Terms and Conditions",
          description: "Last updated: January 2024",
          content: "These Terms and Conditions govern your use of the 1Tech Academy website and services. By accessing or using our platform, you agree to be bound by these terms."
        }
      },
      {
        id: "user-responsibilities",
        name: "User Responsibilities",
        type: "content",
        enabled: true,
        order: 2,
        data: {
          title: "User Responsibilities",
          description: "Your obligations as a platform user",
          content: "Users are responsible for maintaining the confidentiality of their account information, using the platform in accordance with applicable laws, and respecting intellectual property rights."
        }
      },
      {
        id: "platform-rules",
        name: "Platform Usage Rules",
        type: "content",
        enabled: true,
        order: 3,
        data: {
          title: "Platform Usage Rules",
          description: "Guidelines for platform interaction",
          content: "Users must not engage in harmful activities, share inappropriate content, or attempt to compromise the security of our platform or other users' accounts."
        }
      }
    ],
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    author: "Admin",
    views: 89
  },
  {
    id: "cookies-policy",
    title: "Cookies Policy",
    slug: "/cookies-policy",
    status: "published",
    metaTitle: "Cookies Policy - 1Tech Academy",
    metaDescription: "How we use cookies and similar technologies to enhance your experience on our platform.",
    metaKeywords: "cookies policy, tracking, web technologies, user experience",
    sections: [
      {
        id: "cookies-overview",
        name: "Cookies Overview",
        type: "content",
        enabled: true,
        order: 1,
        data: {
          title: "Cookies Policy",
          description: "Last updated: January 2024",
          content: "This Cookies Policy explains how 1Tech Academy uses cookies and similar technologies to recognize you when you visit our website and use our services."
        }
      },
      {
        id: "cookie-types",
        name: "Types of Cookies We Use",
        type: "content",
        enabled: true,
        order: 2,
        data: {
          title: "Types of Cookies We Use",
          description: "Different categories of cookies",
          content: "We use essential cookies for platform functionality, performance cookies to analyze usage, and preference cookies to remember your settings and improve your experience."
        }
      },
      {
        id: "cookie-management",
        name: "Managing Your Cookie Preferences",
        type: "content",
        enabled: true,
        order: 3,
        data: {
          title: "Managing Your Cookie Preferences",
          description: "How to control cookie settings",
          content: "You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our platform."
        }
      }
    ],
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    author: "Admin",
    views: 67
  },
  {
    id: "data-protection-policy",
    title: "Data Protection Policy",
    slug: "/data-protection-policy",
    status: "published",
    metaTitle: "Data Protection Policy - 1Tech Academy",
    metaDescription: "Our comprehensive approach to data protection and GDPR compliance.",
    metaKeywords: "data protection, GDPR, data security, compliance, personal data",
    sections: [
      {
        id: "data-protection-overview",
        name: "Data Protection Overview",
        type: "content",
        enabled: true,
        order: 1,
        data: {
          title: "Data Protection Policy",
          description: "Last updated: January 2024",
          content: "1Tech Academy is committed to protecting your personal data in accordance with applicable data protection laws, including the General Data Protection Regulation (GDPR)."
        }
      },
      {
        id: "data-rights",
        name: "Your Data Rights",
        type: "content",
        enabled: true,
        order: 2,
        data: {
          title: "Your Data Rights",
          description: "Understanding your rights regarding personal data",
          content: "You have the right to access, rectify, erase, restrict processing, data portability, and object to processing of your personal data. You also have the right to withdraw consent at any time."
        }
      },
      {
        id: "data-security",
        name: "Data Security Measures",
        type: "content",
        enabled: true,
        order: 3,
        data: {
          title: "Data Security Measures",
          description: "How we protect your information",
          content: "We implement appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including encryption, access controls, and regular security assessments."
        }
      }
    ],
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    author: "Admin",
    views: 45
  },
  {
    id: "help-support",
    title: "Help & Support",
    slug: "/help-support",
    status: "published",
    metaTitle: "Help & Support - 1Tech Academy",
    metaDescription: "Get help and support for using the 1Tech Academy platform and services.",
    metaKeywords: "help, support, FAQ, assistance, customer service, troubleshooting",
    sections: [
      {
        id: "help-overview",
        name: "Help & Support Overview",
        type: "content",
        enabled: true,
        order: 1,
        data: {
          title: "Help & Support",
          description: "We're here to help you succeed",
          content: "Welcome to our Help & Support center. Here you'll find answers to common questions, troubleshooting guides, and information on how to get the most out of your 1Tech Academy experience."
        }
      },
      {
        id: "getting-started",
        name: "Getting Started",
        type: "content",
        enabled: true,
        order: 2,
        data: {
          title: "Getting Started",
          description: "New to 1Tech Academy? Start here",
          content: "Learn how to create your account, enroll in courses, navigate the platform, and access your learning materials. Our step-by-step guides will help you get started quickly."
        }
      },
      {
        id: "faq-section",
        name: "Frequently Asked Questions",
        type: "faq",
        enabled: true,
        order: 3,
        data: {
          title: "Frequently Asked Questions",
          description: "Common questions and answers",
          faqs: [
            {
              question: "How do I reset my password?",
              answer: "You can reset your password by clicking the 'Forgot Password' link on the login page and following the instructions sent to your email."
            },
            {
              question: "How do I access my courses?",
              answer: "After logging in, go to your dashboard where you'll see all your enrolled courses. Click on any course to access the learning materials."
            },
            {
              question: "Can I download course materials?",
              answer: "Yes, most course materials can be downloaded for offline viewing. Look for the download icon next to each resource."
            }
          ]
        }
      },
      {
        id: "contact-support",
        name: "Contact Support",
        type: "contact",
        enabled: true,
        order: 4,
        data: {
          title: "Contact Our Support Team",
          description: "Still need help? Get in touch with us",
          email: "support@1techacademy.com",
          phone: "+234 (0) 123 456 7890",
          address: "17 Aje Street, Sabo, Yaba, Lagos, Nigeria",
          supportHours: "Monday - Friday: 9:00 AM - 6:00 PM WAT"
        }
      }
    ],
    createdAt: "2024-01-08T11:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    author: "Admin",
    views: 234
  }
]

/**
 * Mock Website Settings Data
 */
export const mockWebsiteSettings: WebsiteSettings = {
  // General Settings
  siteName: "1Tech Academy",
  siteDescription: "Empowering tomorrow's tech leaders through real-world projects, professional certifications, and a transformative learning environment.",
  siteUrl: "https://1techacademy.com",
  adminEmail: "admin@1techacademy.com",

  // SEO Settings
  metaTitle: "1Tech Academy - Awaken Your Tech Future",
  metaDescription: "Empowering tomorrow's tech leaders through real-world projects, professional certifications, and a transformative learning environment.",
  metaKeywords: "tech education, programming courses, web development, software engineering, tech academy, Nigeria, Africa, coding bootcamp",

  // Contact Information
  contactEmail: "info@1techacademy.com",
  contactPhone: "+2347074693513",
  contactAddress: "17 Aje Street, Sabo Yaba Lagos, Nigeria",

  // Social Media Links
  socialMedia: {
    facebook: "https://www.facebook.com/share/162ZNuWcgu/?mibextid=wwXIfr",
    twitter: "",
    instagram: "https://www.instagram.com/1tech_academy?igsh=ZmptMDJyemtjZ2lm&utm_source=qr",
    linkedin: "https://www.linkedin.com/company/1tech-academy/?viewAsMember=true",
    youtube: "https://www.youtube.com/@1techAcademy",
    tiktok: "https://www.tiktok.com/@1tech.academy?_t=ZM-8vuaPPKBpLR&_r=1"
  },

  // Feature Toggles
  features: {
    enableRegistration: true,
    enableComments: false,
    enableNewsletter: true,
    enableAnalytics: true
  },

  // Appearance Settings
  appearance: {
    primaryColor: "#C99700",
    secondaryColor: "#1a1a1a",
    logoUrl: "/logo.png",
    darkLogoUrl: "/logo_dark.png",
    faviconUrl: "/favicon.ico"
  },

  // Analytics (optional)
  analytics: {
    googleAnalyticsId: "GA-XXXXXXXXX",
    facebookPixelId: ""
  }
}

/**
 * Mock Section Templates
 * Predefined section templates that can be reused
 */
export const mockSectionTemplates = [
  {
    id: "hero-default",
    name: "Default Hero Section",
    type: "hero" as SectionType,
    description: "Standard hero section with title, subtitle, and CTA buttons",
    thumbnail: "/templates/hero-default.jpg",
    defaultData: {
      title: "Your Amazing Title Here",
      subtitle: "Compelling subtitle that describes your value proposition",
      primaryCTA: { text: "Get Started", href: "/signup", style: "primary" },
      secondaryCTA: { text: "Learn More", href: "#about", style: "outline" },
      backgroundImage: "/hero-bg.jpg"
    },
    isReusable: true,
    category: "header" as const
  },
  {
    id: "content-two-column",
    name: "Two Column Content",
    type: "content" as SectionType,
    description: "Content section with title, description and two-column layout",
    thumbnail: "/templates/content-two-column.jpg",
    defaultData: {
      title: "Section Title",
      description: "Section description goes here",
      content: "Your main content text goes here. This can be multiple paragraphs."
    },
    isReusable: true,
    category: "content" as const
  },
  {
    id: "features-grid",
    name: "Features Grid",
    type: "features" as SectionType,
    description: "Grid layout for displaying features with icons and descriptions",
    thumbnail: "/templates/features-grid.jpg",
    defaultData: {
      title: "Our Features",
      description: "Discover what makes us special",
      features: [
        {
          id: "feature-1",
          title: "Feature One",
          description: "Description of your first feature",
          icon: "star"
        },
        {
          id: "feature-2",
          title: "Feature Two",
          description: "Description of your second feature",
          icon: "heart"
        },
        {
          id: "feature-3",
          title: "Feature Three",
          description: "Description of your third feature",
          icon: "shield"
        }
      ]
    },
    isReusable: true,
    category: "content" as const
  },
  {
    id: "contact-form",
    name: "Contact Form Section",
    type: "contact" as SectionType,
    description: "Contact form with company information and social links",
    thumbnail: "/templates/contact-form.jpg",
    defaultData: {
      title: "Get in Touch",
      description: "We'd love to hear from you",
      address: "Your Company Address",
      phone: "+1234567890",
      email: "contact@yourcompany.com"
    },
    isReusable: true,
    category: "footer" as const
  },
  {
    id: "cta-banner",
    name: "Call to Action Banner",
    type: "cta" as SectionType,
    description: "Full-width banner with call to action",
    thumbnail: "/templates/cta-banner.jpg",
    defaultData: {
      title: "Ready to Get Started?",
      description: "Join thousands of satisfied customers",
      primaryCTA: { text: "Start Now", href: "/signup", style: "primary" }
    },
    isReusable: true,
    category: "special" as const
  }
]

/**
 * Utility functions for mock data
 */

/**
 * Get mock page by ID or slug
 */
export function getMockPage(identifier: string): WebsitePage | undefined {
  return mockWebsitePages.find(page =>
    page.id === identifier || page.slug === identifier
  )
}

/**
 * Get mock pages with filtering and pagination
 */
export function getMockPages(options: {
  status?: 'published' | 'draft'
  page?: number
  limit?: number
  search?: string
} = {}) {
  let filteredPages = [...mockWebsitePages]

  // Filter by status
  if (options.status) {
    filteredPages = filteredPages.filter(page => page.status === options.status)
  }

  // Filter by search term
  if (options.search) {
    const searchTerm = options.search.toLowerCase()
    filteredPages = filteredPages.filter(page =>
      page.title.toLowerCase().includes(searchTerm) ||
      page.slug.toLowerCase().includes(searchTerm) ||
      page.metaDescription?.toLowerCase().includes(searchTerm)
    )
  }

  // Pagination
  const page = options.page || 1
  const limit = options.limit || 10
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    data: filteredPages.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: filteredPages.length,
      totalPages: Math.ceil(filteredPages.length / limit)
    }
  }
}

/**
 * Get mock media files with filtering and pagination
 */
export function getMockMediaFiles(options: {
  type?: 'image' | 'video' | 'document'
  page?: number
  limit?: number
  search?: string
} = {}) {
  let filteredFiles = [...mockMediaFiles]

  // Filter by type
  if (options.type) {
    filteredFiles = filteredFiles.filter(file => file.type === options.type)
  }

  // Filter by search term
  if (options.search) {
    const searchTerm = options.search.toLowerCase()
    filteredFiles = filteredFiles.filter(file =>
      file.name.toLowerCase().includes(searchTerm) ||
      file.alt?.toLowerCase().includes(searchTerm) ||
      file.caption?.toLowerCase().includes(searchTerm)
    )
  }

  // Pagination
  const page = options.page || 1
  const limit = options.limit || 20
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit

  return {
    data: filteredFiles.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: filteredFiles.length,
      totalPages: Math.ceil(filteredFiles.length / limit)
    }
  }
}

/**
 * Generate mock statistics
 */
export function getMockWebsiteStats() {
  return {
    totalPages: mockWebsitePages.length,
    publishedPages: mockWebsitePages.filter(p => p.status === 'published').length,
    draftPages: mockWebsitePages.filter(p => p.status === 'draft').length,
    totalSections: mockWebsitePages.reduce((total, page) => total + page.sections.length, 0),
    mediaFiles: mockMediaFiles.length,
    totalMediaSize: mockMediaFiles.reduce((total, file) => total + file.size, 0),
    imageFiles: mockMediaFiles.filter(f => f.type === 'image').length,
    videoFiles: mockMediaFiles.filter(f => f.type === 'video').length,
    documentFiles: mockMediaFiles.filter(f => f.type === 'document').length
  }
}

/**
 * Mock Media Files Data
 */
export const mockMediaFiles: MediaFile[] = [
  {
    id: "hero-bg-1",
    name: "hero-background.jpg",
    type: "image",
    url: "/images/hero-bg.jpg",
    size: 2457600, // 2.4 MB
    dimensions: { width: 1920, height: 1080 },
    alt: "Hero background showing students learning technology",
    caption: "Main hero background image",
    uploadedAt: "2024-01-15T10:30:00Z",
    usedIn: ["landing"]
  },
  {
    id: "logo-light",
    name: "logo.png",
    type: "image",
    url: "/logo.png",
    size: 45000, // 45 KB
    dimensions: { width: 200, height: 50 },
    alt: "1Tech Academy Logo",
    caption: "Main logo for light theme",
    uploadedAt: "2024-01-14T15:45:00Z",
    usedIn: ["landing", "about", "contact"]
  },
  {
    id: "logo-dark",
    name: "logo_dark.png",
    type: "image",
    url: "/logo_dark.png",
    size: 47000, // 47 KB
    dimensions: { width: 200, height: 50 },
    alt: "1Tech Academy Logo Dark",
    caption: "Main logo for dark theme",
    uploadedAt: "2024-01-14T15:45:00Z",
    usedIn: ["landing", "about", "contact"]
  },
  {
    id: "course-intro-video",
    name: "course-intro-video.mp4",
    type: "video",
    url: "/videos/course-intro.mp4",
    size: 15728640, // 15.2 MB
    dimensions: { width: 1280, height: 720 },
    alt: "Course introduction video",
    caption: "Introduction video for new students",
    uploadedAt: "2024-01-12T09:20:00Z",
    usedIn: ["courses"]
  },
  {
    id: "student-testimonial-1",
    name: "student-testimonial.jpg",
    type: "image",
    url: "/images/testimonial-1.jpg",
    size: 1843200, // 1.8 MB
    dimensions: { width: 800, height: 600 },
    alt: "Happy student testimonial photo",
    caption: "Student success story photo",
    uploadedAt: "2024-01-10T14:15:00Z",
    usedIn: ["landing"]
  },
  {
    id: "tech-icons",
    name: "tech-icons.svg",
    type: "image",
    url: "/icons/tech-stack.svg",
    size: 120000, // 120 KB
    dimensions: { width: 500, height: 500 },
    alt: "Technology stack icons",
    caption: "Icons representing technologies we teach",
    uploadedAt: "2024-01-08T11:00:00Z",
    usedIn: ["landing"]
  },
  {
    id: "academy-brochure",
    name: "1tech-academy-brochure.pdf",
    type: "document",
    url: "/documents/brochure.pdf",
    size: 3355443, // 3.2 MB
    alt: "1Tech Academy Course Brochure",
    caption: "Comprehensive course information brochure",
    uploadedAt: "2024-01-05T16:30:00Z",
    usedIn: ["about", "courses"]
  },
  {
    id: "mission-image",
    name: "mission-vision.jpg",
    type: "image",
    url: "https://images.pexels.com/photos/7689856/pexels-photo-7689856.jpeg",
    size: 2100000, // 2.1 MB
    dimensions: { width: 1260, height: 750 },
    alt: "Students collaborating on a tech project",
    caption: "Mission section background image",
    uploadedAt: "2024-01-15T10:30:00Z",
    usedIn: ["landing", "about"]
  },
  {
    id: "vision-image",
    name: "vision-future.jpg",
    type: "image",
    url: "https://img.freepik.com/free-photo/black-woman-experiencing-virtual-reality-with-vr-headset_53876-137559.jpg",
    size: 1950000, // 1.95 MB
    dimensions: { width: 740, height: 555 },
    alt: "Woman experiencing virtual reality technology",
    caption: "Vision section background image",
    uploadedAt: "2024-01-15T10:30:00Z",
    usedIn: ["landing", "about"]
  }
]
