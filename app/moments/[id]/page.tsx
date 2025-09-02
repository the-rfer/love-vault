"use client"

import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Heart, ArrowLeft, Edit, Trash2, Calendar, Clock, ImageIcon, Video } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

interface Moment {
  id: string
  title: string
  description: string | null
  moment_date: string
  media_urls: string[] | null
  created_at: string
  updated_at: string
  user_id: string
}

export default function MomentDetailsPage() {
  const [user, setUser] = useState<any>(null)
  const [moment, setMoment] = useState<Moment | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()

  useEffect(() => {
    const loadMoment = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          router.push("/auth/login")
          return
        }
        setUser(user)

        // Load moment data
        const { data: momentData, error } = await supabase
          .from("moments")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (error || !momentData) {
          toast.error("Moment not found")
          router.push("/dashboard")
          return
        }

        setMoment(momentData)
      } catch (error) {
        console.error("Error loading moment:", error)
        toast.error("Failed to load moment")
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    loadMoment()
  }, [params.id, router, supabase])

  const handleDelete = async () => {
    if (!user || !moment) return

    if (!confirm("Are you sure you want to delete this moment? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("moments").delete().eq("id", moment.id)

      if (error) throw error

      toast.success("Moment deleted successfully!")
      router.push("/dashboard")
    } catch (error) {
      console.error("Error deleting moment:", error)
      toast.error("Failed to delete moment. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const isVideo = (url: string) => {
    return url.includes(".mp4") || url.includes(".mov") || url.includes(".webm") || url.includes("video")
  }

  const isImage = (url: string) => {
    return (
      url.includes(".jpg") ||
      url.includes(".jpeg") ||
      url.includes(".png") ||
      url.includes(".webp") ||
      url.includes("image")
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!moment) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Moment Header */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{moment.title}</h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(moment.moment_date)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Added {formatTime(moment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" asChild className="bg-transparent">
                    <Link href={`/moments/${moment.id}/edit`}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>

              {moment.description && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground leading-relaxed">{moment.description}</p>
                </div>
              )}

              {moment.updated_at !== moment.created_at && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Badge variant="secondary" className="text-xs">
                    Last updated {formatTime(moment.updated_at)}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Media Gallery */}
          {moment.media_urls && moment.media_urls.length > 0 && (
            <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-primary" />
                  Media ({moment.media_urls.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moment.media_urls.map((url, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedMediaIndex(index)}
                    >
                      {isImage(url) ? (
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Media ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : isVideo(url) ? (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Video className="w-12 h-12 text-muted-foreground" />
                          <video src={url} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <ImageIcon className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline Context */}
          <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Timeline Context</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Moment Date</span>
                  <span className="font-medium">{formatDate(moment.moment_date)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="font-medium">{formatDate(moment.created_at)}</span>
                </div>
                {moment.updated_at !== moment.created_at && (
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Last Updated</span>
                    <span className="font-medium">{formatDate(moment.updated_at)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Media Modal */}
        {selectedMediaIndex !== null && moment.media_urls && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedMediaIndex(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setSelectedMediaIndex(null)}
              >
                ×
              </Button>
              {isImage(moment.media_urls[selectedMediaIndex]) ? (
                <Image
                  src={moment.media_urls[selectedMediaIndex] || "/placeholder.svg"}
                  alt={`Media ${selectedMediaIndex + 1}`}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              ) : isVideo(moment.media_urls[selectedMediaIndex]) ? (
                <video
                  src={moment.media_urls[selectedMediaIndex]}
                  controls
                  className="max-w-full max-h-full rounded-lg"
                  autoPlay
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
