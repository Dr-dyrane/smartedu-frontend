"use client"

import { useState } from "react"
import Link from "next/link"
import { DyraneButton } from "@/components/dyrane-ui/dyrane-button"
import { PageHeader } from "@/components/layout/page-header"
import { 
  Plus, 
  Edit3, 
  Eye, 
  Trash2, 
  FileText,
  Globe,
  Clock,
  Search
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

export default function PagesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const [pages] = useState([
    {
      id: "landing",
      title: "Landing Page",
      slug: "/",
      status: "published",
      lastModified: "2024-01-15T10:30:00Z",
      sections: 8,
      author: "Admin",
      views: 1250
    },
    {
      id: "about",
      title: "About Us",
      slug: "/about",
      status: "published",
      lastModified: "2024-01-14T15:45:00Z",
      sections: 4,
      author: "Admin",
      views: 890
    },
    {
      id: "contact",
      title: "Contact",
      slug: "/contact",
      status: "draft",
      lastModified: "2024-01-12T09:20:00Z",
      sections: 2,
      author: "Admin",
      views: 0
    },
    {
      id: "courses",
      title: "Courses",
      slug: "/public-courses",
      status: "published",
      lastModified: "2024-01-10T14:15:00Z",
      sections: 3,
      author: "Admin",
      views: 2100
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      slug: "/privacy-policy",
      status: "published",
      lastModified: "2024-01-08T11:00:00Z",
      sections: 1,
      author: "Admin",
      views: 156
    }
  ])

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Pages Management"
        subheading="Manage all your website pages and their content"
        actions={
          <div className="flex gap-2">
            <DyraneButton variant="outline" asChild>
              <Link href="/" target="_blank">
                <Eye className="mr-2 h-4 w-4" />
                Preview Site
              </Link>
            </DyraneButton>
            <DyraneButton asChild>
              <Link href="/admin/website/pages/new">
                <Plus className="mr-2 h-4 w-4" />
                New Page
              </Link>
            </DyraneButton>
          </div>
        }
      />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Pages</CardTitle>
          <CardDescription>Manage your website pages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Pages Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{page.title}</div>
                        <div className="text-sm text-muted-foreground">{page.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                      {page.status === 'published' ? (
                        <><Globe className="mr-1 h-3 w-3" /> Published</>
                      ) : (
                        <><Clock className="mr-1 h-3 w-3" /> Draft</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{page.sections}</TableCell>
                  <TableCell>{page.views.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(page.lastModified)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DyraneButton variant="outline" size="sm" asChild>
                        <Link href={`/admin/website/pages/${page.id}`}>
                          <Edit3 className="h-4 w-4" />
                        </Link>
                      </DyraneButton>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={page.slug} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/website/pages/${page.id}/duplicate`}>
                              <FileText className="mr-2 h-4 w-4" />
                              Duplicate
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
