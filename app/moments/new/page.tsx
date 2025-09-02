"use client"

import type React from "react"

import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/date-picker"
import { FileUpload } from "@/components/file-upload"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Heart, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

export default function NewMomentPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [momentDate, setMomentDate] = useState<Date>(new Date())
  const [files, setFiles] = useState<File[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
    }
    getUser()
  }, [router, supabase.auth])

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (!user || files.length === 0) return []

    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("moment-media").upload(fileName, file)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        return null
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("moment-media").getPublicUrl(fileName)

      return publicUrl
    })

    const results = await Promise.all(uploadPromises)
    return results.filter((url): url is string => url !== null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim()) return

    setIsLoading(true)
    try {
      // Upload files first
      const mediaUrls = await uploadFiles(files)

      // Create moment
      const { error } = await supabase.from("moments").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim() || null,
        moment_date: momentDate.toISOString().split("T")[0],
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
      })

      if (error) throw error

      toast.success("Moment created successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error creating moment:", error)
      toast.error("Failed to create moment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Capture a Beautiful Moment</CardTitle>
              <CardDescription className="text-muted-foreground">
                Share something special that happened today
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title *
                </Label>
                <Input
                  id="title"
                  placeholder="What happened?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell us more about this moment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Date</Label>
                <DatePicker
                  date={momentDate}
                  onDateChange={(date) => date && setMomentDate(date)}
                  placeholder="When did this happen?"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Photos & Videos (Optional)</Label>
                <FileUpload onFilesChange={setFiles} maxFiles={5} accept="image/*,video/*" />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" asChild className="bg-transparent">
                  <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isLoading || !title.trim()} className="min-w-[100px]">
                  {isLoading ? "Creating..." : "Create Moment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
