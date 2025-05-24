"use client"

import { useState } from "react"
import { DyraneButton } from "@/components/dyrane-ui/dyrane-button"
import { PageHeader } from "@/components/layout/page-header"
import { 
  Save, 
  Upload,
  Globe,
  Palette,
  Settings,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function WebsiteSettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "1Tech Academy",
    siteDescription: "Empowering tomorrow's tech leaders through real-world projects, professional certifications, and a transformative learning environment.",
    siteUrl: "https://1techacademy.com",
    adminEmail: "admin@1techacademy.com",
    
    // SEO Settings
    metaTitle: "1Tech Academy - Awaken Your Tech Future",
    metaDescription: "Empowering tomorrow's tech leaders through real-world projects, professional certifications, and a transformative learning environment.",
    metaKeywords: "tech education, programming courses, web development, software engineering, tech academy",
    
    // Contact Information
    contactEmail: "info@1techacademy.com",
    contactPhone: "+2347074693513",
    contactAddress: "17 Aje Street, Sabo Yaba Lagos.",
    
    // Social Media
    facebookUrl: "https://www.facebook.com/share/162ZNuWcgu/?mibextid=wwXIfr",
    twitterUrl: "",
    instagramUrl: "https://www.instagram.com/1tech_academy?igsh=ZmptMDJyemtjZ2lm&utm_source=qr",
    linkedinUrl: "https://www.linkedin.com/company/1tech-academy/?viewAsMember=true",
    youtubeUrl: "https://www.youtube.com/@1techAcademy",
    tiktokUrl: "https://www.tiktok.com/@1tech.academy?_t=ZM-8vuaPPKBpLR&_r=1",
    
    // Features
    enableRegistration: true,
    enableComments: false,
    enableNewsletter: true,
    enableAnalytics: true,
    
    // Appearance
    primaryColor: "#C99700",
    secondaryColor: "#1a1a1a",
    logoUrl: "/logo.png",
    darkLogoUrl: "/logo_dark.png",
    faviconUrl: "/favicon.ico"
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    // Here you would save the settings to your backend
    console.log("Saving settings:", settings)
    // Show success message
  }

  return (
    <div className="space-y-6">
      <PageHeader
        heading="Website Settings"
        subheading="Configure global website settings and preferences"
        actions={
          <DyraneButton onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </DyraneButton>
        }
      />

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic website configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    value={settings.siteUrl}
                    onChange={(e) => handleInputChange('siteUrl', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Features</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableRegistration">User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register</p>
                  </div>
                  <Switch
                    id="enableRegistration"
                    checked={settings.enableRegistration}
                    onCheckedChange={(checked) => handleInputChange('enableRegistration', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableNewsletter">Newsletter</Label>
                    <p className="text-sm text-muted-foreground">Enable newsletter subscription</p>
                  </div>
                  <Switch
                    id="enableNewsletter"
                    checked={settings.enableNewsletter}
                    onCheckedChange={(checked) => handleInputChange('enableNewsletter', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableAnalytics">Analytics</Label>
                    <p className="text-sm text-muted-foreground">Enable website analytics</p>
                  </div>
                  <Switch
                    id="enableAnalytics"
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Search engine optimization configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={settings.metaKeywords}
                  onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Separate keywords with commas
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Company contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactEmail" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="contactPhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="contactAddress" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Textarea
                  id="contactAddress"
                  value={settings.contactAddress}
                  onChange={(e) => handleInputChange('contactAddress', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Configure your social media presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook
                </Label>
                <Input
                  id="facebookUrl"
                  value={settings.facebookUrl}
                  onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter
                </Label>
                <Input
                  id="twitterUrl"
                  value={settings.twitterUrl}
                  onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                  placeholder="https://twitter.com/youraccount"
                />
              </div>

              <div>
                <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram
                </Label>
                <Input
                  id="instagramUrl"
                  value={settings.instagramUrl}
                  onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                  placeholder="https://instagram.com/youraccount"
                />
              </div>

              <div>
                <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </Label>
                <Input
                  id="linkedinUrl"
                  value={settings.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube
                </Label>
                <Input
                  id="youtubeUrl"
                  value={settings.youtubeUrl}
                  onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>Customize your website's visual appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                      placeholder="#C99700"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => handleInputChange('secondaryColor', e.target.value)}
                      placeholder="#1a1a1a"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Logos & Icons</h3>
                
                <div>
                  <Label htmlFor="logoUrl">Light Logo URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="logoUrl"
                      value={settings.logoUrl}
                      onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                    />
                    <DyraneButton variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </DyraneButton>
                  </div>
                </div>

                <div>
                  <Label htmlFor="darkLogoUrl">Dark Logo URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="darkLogoUrl"
                      value={settings.darkLogoUrl}
                      onChange={(e) => handleInputChange('darkLogoUrl', e.target.value)}
                    />
                    <DyraneButton variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </DyraneButton>
                  </div>
                </div>

                <div>
                  <Label htmlFor="faviconUrl">Favicon URL</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="faviconUrl"
                      value={settings.faviconUrl}
                      onChange={(e) => handleInputChange('faviconUrl', e.target.value)}
                    />
                    <DyraneButton variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </DyraneButton>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
