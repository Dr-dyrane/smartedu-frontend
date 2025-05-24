"use client"

import { PageHeader } from "@/components/layout/page-header"
import { CMSFeatureGate } from "@/components/feature-gates/cms-feature-gate"
import { CMSHelp } from "@/components/website/cms-help"
import { DyraneButton } from "@/components/dyrane-ui/dyrane-button"
import Link from "next/link"
import { ArrowLeft, MessageCircle } from "lucide-react"

export default function CMSHelpPage() {
  return (
    <CMSFeatureGate>
      <div className="space-y-6">
        <PageHeader
          heading="CMS Help & Documentation"
          subheading="Learn how to use the content management system effectively"
          actions={
            <div className="flex gap-2">
              <DyraneButton variant="outline" asChild>
                <Link href="/admin/website">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </DyraneButton>
              <DyraneButton variant="outline" asChild>
                <Link href="mailto:support@1techacademy.com">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </DyraneButton>
            </div>
          }
        />

        <CMSHelp />
      </div>
    </CMSFeatureGate>
  )
}
