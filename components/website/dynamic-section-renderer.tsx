"use client"

import { PageSection } from "@/types/website.types"
import { SectionDivider } from "@/components/layout/section-divider"
import { SectionHeader } from "@/components/layout/section-header"
import { DyraneButton } from "@/components/dyrane-ui/dyrane-button"
import { DyraneCard } from "@/components/dyrane-ui/dyrane-card"
import Link from "next/link"
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react"
import { FacebookLogo, LinkedinLogo, InstagramLogo, TiktokLogo, YoutubeLogo } from "phosphor-react"

// Import existing components
import { HeroAnimation } from "@/components/landing/hero-animation"
import { CoursesSection } from "@/components/landing/public-course-section"
import { AppleTechnologyDisplay } from "@/components/landing/AppleTechnologyDisplay"
import { TestimonialCarousel } from "@/components/landing/testimonial-carousel"
import { NodeTestimonialSection } from "@/components/landing/node-testimonial-section"
import { DemoRequestForm } from "@/components/landing/demo-request-form"
import { FeatureCard } from "@/components/landing/feature-card"
import { StandOutSlideshowSimple } from "@/components/landing/stand-out-slideshow-simple"
import { OnboardingStep } from "@/components/landing/onboarding-step"
import { Card } from "@/components/cards/FeatureCard"
import { whatWeDoFeatureData, whoWeAreFeatureData } from "@/data/landing-data"
import { Target, Eye } from "lucide-react"

interface DynamicSectionRendererProps {
  sections: PageSection[]
}

export function DynamicSectionRenderer({ sections }: DynamicSectionRendererProps) {
  const enabledSections = sections
    .filter(section => section.enabled)
    .sort((a, b) => a.order - b.order)

  const renderSection = (section: PageSection, index: number) => {
    const { type, data } = section

    // Add section divider between sections (except first)
    const sectionContent = (
      <>
        {index > 0 && <SectionDivider />}
        {getSectionContent(section, type, data)}
      </>
    )

    return (
      <div key={section.id}>
        {sectionContent}
      </div>
    )
  }

  const getSectionContent = (section: PageSection, type: string, data: any) => {
    switch (type) {
      case 'hero':
        return (
          <section className="py-16 md:py-24 relative overflow-hidden flex items-center justify-center min-h-[80vh]">
            <div className="container px-4 md:px-6 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
                    {data.title || "Default Hero Title"}
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl">
                    {data.subtitle || "Default hero subtitle"}
                  </p>
                  <div className="flex flex-row gap-4 pt-4">
                    {data.primaryCTA && (
                      <DyraneButton size="lg" asChild>
                        <Link href={data.primaryCTA.href}>
                          {data.primaryCTA.text}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </DyraneButton>
                    )}
                    {data.secondaryCTA && (
                      <DyraneButton variant="outline" size="lg" asChild>
                        <Link href={data.secondaryCTA.href}>{data.secondaryCTA.text}</Link>
                      </DyraneButton>
                    )}
                  </div>
                </div>
                <div className="relative h-[400px] lg:h-[500px]">
                  <HeroAnimation />
                </div>
              </div>
            </div>
          </section>
        )

      case 'content':
        return (
          <section id={section.id} className="py-16 relative overflow-hidden">
            <div className="px-4 md:px-6 relative text-center">
              <SectionHeader
                title={data.title || "Content Section"}
                description={data.description || "Content description"}
              />

              {data.content && (
                <div className="max-w-4xl mx-auto">
                  <p className="text-lg text-muted-foreground">{data.content}</p>
                </div>
              )}

              {/* Special handling for about section with mission/vision cards */}
              {section.id === 'about' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 mx-auto mb-16 lg:mb-20">
                  <Card
                    title="Our Vision"
                    subtitle="Shaping the Future of Tech in Africa"
                    imageSrc="https://img.freepik.com/free-photo/black-woman-experiencing-virtual-reality-with-vr-headset_53876-137559.jpg"
                    imageAlt="Abstract representation of digital transformation in Africa"
                    modalContent={{
                      bio: "To shape Africa's next generation of tech leaders by combining global expertise with local excellence — in a space built for bold ambition and real transformation."
                    }}
                    icon={<Eye className="h-8 w-8" />}
                    className="h-full"
                  />
                  <Card
                    title="Our Mission"
                    subtitle="Empowering Africa's Tech Leaders"
                    imageSrc="https://images.pexels.com/photos/7689856/pexels-photo-7689856.jpeg"
                    imageAlt="Students collaborating on a tech project"
                    modalContent={{
                      bio: "At 1Tech Academy, our mission is to empower Africa's next generation of tech leaders by delivering world-class, hands-on training through in-person mentorship, global expertise, and an uncompromising standard of excellence."
                    }}
                    icon={<Target className="h-8 w-8" />}
                    className="h-full"
                  />
                </div>
              )}
            </div>
          </section>
        )

      case 'features':
        return (
          <section id={section.id} className="py-16 relative overflow-hidden">
            <div className="px-4 md:px-6 relative">
              <SectionHeader
                title={data.title || "Features"}
                description={data.description || "Our amazing features"}
              />

              {/* Special handling for why-us section */}
              {section.id === 'why-us' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto mb-10 md:mb-14">
                    <FeatureCard
                      icon={whoWeAreFeatureData.icon}
                      title={whoWeAreFeatureData.title}
                      description={whoWeAreFeatureData.description}
                    />
                    <FeatureCard
                      icon={whatWeDoFeatureData.icon}
                      title={whatWeDoFeatureData.title}
                      description={whatWeDoFeatureData.description}
                    />
                  </div>
                  <SectionHeader
                    title="Why We Stand Out"
                    description="What sets our programs apart."
                  />
                  <StandOutSlideshowSimple />
                </>
              )}
            </div>
          </section>
        )

      case 'courses':
        return (
          <section id={section.id} className="py-16 relative overflow-hidden">
            <div className="px-4 md:px-6 relative">
              <SectionHeader
                title={data.title || "Our Courses"}
                description={data.description || "Explore our course offerings"}
              />
              <CoursesSection />
            </div>
          </section>
        )

      case 'technologies':
        return (
          <section id={section.id} className="py-16 relative overflow-hidden">
            <div className="px-4 md:px-6 relative">
              <SectionHeader
                title={data.title || "Technologies"}
                description={data.description || "Technologies we teach"}
              />
              <AppleTechnologyDisplay />
            </div>
          </section>
        )

      case 'testimonials':
        return (
          <section id={section.id} className="py-16 relative overflow-hidden">
            <div className="px-4 md:px-6 relative">
              <SectionHeader
                title={data.title || "Testimonials"}
                description={data.description || "What our clients say"}
              />
              <NodeTestimonialSection />
              <TestimonialCarousel />
            </div>
          </section>
        )

      case 'contact':
        return (
          <section id={section.id} className="py-16 relative overflow-hidden">
            <div className="px-4 md:px-6 relative">
              <div className="mx-auto grid md:grid-cols-2 gap-10 items-start">
                <div className="space-y-8">
                  <SectionHeader
                    title={data.title || "Contact Us"}
                    description={data.description || "Get in touch with us"}
                    className="text-center md:text-left"
                  />

                  <div className="space-y-3 text-muted-foreground w-full flex flex-col items-center md:items-start text-center md:text-left">
                    {data.address && (
                      <div className="flex items-center md:items-start gap-2">
                        <MapPin size={20} />
                        <span><strong>Address:</strong> {data.address}</span>
                      </div>
                    )}
                    {data.phone && (
                      <div className="flex items-center md:items-start gap-2">
                        <Phone size={20} />
                        <span>
                          <strong>Phone:</strong>{" "}
                          <a href={`tel:${data.phone}`}>{data.phone}</a>
                        </span>
                      </div>
                    )}
                    {data.email && (
                      <div className="flex items-center md:items-start gap-2">
                        <Mail size={20} />
                        <span>
                          <strong>Email:</strong>{" "}
                          <a href={`mailto:${data.email}`}>{data.email}</a>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center md:justify-start w-full space-x-4 pt-4">
                    <a href="https://www.facebook.com/share/162ZNuWcgu/?mibextid=wwXIfr" aria-label="Facebook" className="hover:text-primary transition-colors">
                      <FacebookLogo size={24} weight="bold" />
                    </a>
                    <a href="https://www.linkedin.com/company/1tech-academy/?viewAsMember=true" aria-label="LinkedIn" className="hover:text-primary transition-colors">
                      <LinkedinLogo size={24} weight="bold" />
                    </a>
                    <a href="https://www.instagram.com/1tech_academy?igsh=ZmptMDJyemtjZ2lm&utm_source=qr" aria-label="Instagram" className="hover:text-primary transition-colors">
                      <InstagramLogo size={24} weight="bold" />
                    </a>
                    <a href="https://www.tiktok.com/@1tech.academy?_t=ZM-8vuaPPKBpLR&_r=1" aria-label="Tiktok" className="hover:text-primary transition-colors">
                      <TiktokLogo size={24} weight="bold" />
                    </a>
                    <a href="https://www.youtube.com/@1techAcademy" aria-label="YouTube" className="hover:text-primary transition-colors">
                      <YoutubeLogo size={24} weight="bold" />
                    </a>
                  </div>
                </div>
                <DyraneCard>
                  <DemoRequestForm />
                </DyraneCard>
              </div>
            </div>
          </section>
        )

      case 'cta':
        return (
          <section className="py-16 relative overflow-hidden">
            <div className="px-4 md:px-6 relative">
              <SectionHeader
                title={data.title || "Get Started"}
                description={data.description || "Follow these simple steps"}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 grid-rows-1">
                <OnboardingStep
                  number={1}
                  title="Sign Up"
                  description="Create your account with your email address to join our learning platform."
                />
                <OnboardingStep
                  number={2}
                  title="Explore Courses"
                  description="Browse our catalog of professional courses and select the ones that match your goals."
                />
                <OnboardingStep
                  number={3}
                  title="Enroll in Session"
                  description="Choose an available session with open seats that fits your schedule."
                />
                <OnboardingStep
                  number={4}
                  title="Learn"
                  description="Access course materials, participate in discussions, and track your progress."
                />
              </div>

              <div className="text-center mt-16">
                <DyraneButton size="lg" asChild>
                  <Link href="/signup">
                    Join 1Tech Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </DyraneButton>
              </div>
            </div>
          </section>
        )

      default:
        return (
          <section className="py-16">
            <div className="px-4 md:px-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Unknown Section Type: {type}</h2>
                <p className="text-muted-foreground">This section type is not yet implemented.</p>
              </div>
            </div>
          </section>
        )
    }
  }

  return (
    <div>
      {enabledSections.map((section, index) => renderSection(section, index))}
    </div>
  )
}
