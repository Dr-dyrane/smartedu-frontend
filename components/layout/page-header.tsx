"use client"

import React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  heading: string
  subheading?: string
  actions?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/**
 * Reusable page header component for admin pages
 * Provides consistent layout for page titles, descriptions, and actions
 */
export function PageHeader({ 
  heading, 
  subheading, 
  actions, 
  className,
  children 
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 pb-6", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {heading}
          </h1>
          {subheading && (
            <p className="text-muted-foreground text-sm md:text-base">
              {subheading}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-4">
          {children}
        </div>
      )}
    </div>
  )
}
