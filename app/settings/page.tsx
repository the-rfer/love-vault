"use client"
import { createClient } from "@/lib/client"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Camera, Save, Trash2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import Link from "next/link"

interface Profile {
  id: string
  username: string
  email: string
  partner_name: string
  partner_birthday: string | null
  relationship_start_date: string
  profile_photo_url: string | null
}

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUser(user)

        const { data: profileData, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error || !profileData) {
          console.error("Error loading profile:", error)
          toast.error("Failed to load profile")
          return
        }

        setProfile(profileData)
      } catch (error) {
        console.error("Error loading profile:", error)
        toast.error("Failed to load profile")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [router, supabase])

  const handleSaveProfile = async () => {
    if (!profile || !user) return

    setIsSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          username: profile.username,
          partner_name: profile.partner_name,
          partner_birthday: profile.partner_birthday,
          relationship_start_date: profile.relationship_start_date,
        })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating profile:", error)
        toast.error("Failed to update profile")
      } else {
        toast.success("Profile updated successfully!")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/profile.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, file, { upsert: true })

      if (uploadError) {
        console.error("Error uploading photo:", uploadError)
        toast.error("Failed to upload photo")
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-photos").getPublicUrl(fileName)

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ profile_photo_url: publicUrl })
        .eq("id", user.id)

      if (updateError) {
        console.error("Error updating profile photo:", updateError)
        toast.error("Failed to update profile photo")
      } else {
        setProfile((prev) => (prev ? { ...prev, profile_photo_url: publicUrl } : null))
        toast.success("Profile photo updated!")
      }
    } catch (error) {
      console.error("Error uploading photo:", error)
      toast.error("Failed to upload photo")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeletePhoto = async () => {
    if (!user || !profile?.profile_photo_url) return

    try {
      const { error } = await supabase.from("profiles").update({ profile_photo_url: null }).eq("id", user.id)

      if (error) {
        console.error("Error deleting photo:", error)
        toast.error("Failed to delete photo")
      } else {
        setProfile((prev) => (prev ? { ...prev, profile_photo_url: null } : null))
        toast.success("Profile photo deleted!")
      }
    } catch (error) {
      console.error("Error deleting photo:", error)
      toast.error("Failed to delete photo")
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        {/* Profile Photo */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.profile_photo_url || "/placeholder.svg"} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {profile.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="photo-upload" className="cursor-pointer">
                  <Button variant="outline" disabled={isUploading} asChild>
                    <span>
                      <Camera className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Change Photo"}
                    </span>
                  </Button>
                </Label>
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                {profile.profile_photo_url && (
                  <Button variant="outline" size="sm" onClick={handleDeletePhoto}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove Photo
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Your Name</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed from here. Contact support if needed.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Partner Information */}
        <Card>
          <CardHeader>
            <CardTitle>Partner Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partner-name">Partner's Name</Label>
              <Input
                id="partner-name"
                value={profile.partner_name}
                onChange={(e) => setProfile({ ...profile, partner_name: e.target.value })}
                placeholder="Enter partner's name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner-birthday">Partner's Birthday</Label>
              <Input
                id="partner-birthday"
                type="date"
                value={profile.partner_birthday || ""}
                onChange={(e) => setProfile({ ...profile, partner_birthday: e.target.value || null })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="relationship-start">Relationship Start Date</Label>
              <Input
                id="relationship-start"
                type="date"
                value={profile.relationship_start_date}
                onChange={(e) => setProfile({ ...profile, relationship_start_date: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>

        <Separator />

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={handleSignOut} className="w-full bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
