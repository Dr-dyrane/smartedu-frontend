"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CMSFeatureGate } from "@/components/feature-gates/cms-feature-gate"
import { MediaLibrary } from "@/components/website/media-library"
import { DyraneButton } from "@/components/dyrane-ui/dyrane-button"
import Link from "next/link"
import { ArrowLeft, Eye } from "lucide-react"

export default function MediaManagementPage() {
  return (
    <CMSFeatureGate>
      <div className="space-y-6">
        <PageHeader
          heading="Media Library"
          subheading="Upload and manage images, videos, and documents for your website"
          actions={
            <div className="flex gap-2">
              <DyraneButton variant="outline" asChild>
                <Link href="/admin/website">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </DyraneButton>
              <DyraneButton variant="outline" asChild>
                <Link href="/" target="_blank">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Site
                </Link>
              </DyraneButton>
            </div>
          }
        />

        <MediaLibrary />
      </div>
    </CMSFeatureGate>
  )
}
