"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ImageIcon } from "lucide-react"
import Link from "next/link"

interface TimelineItem {
  id: string
  title: string
  description: string | null
  moment_date: string
  media_urls: string[] | null
  created_at: string
}

interface TimelineProps {
  items: TimelineItem[]
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
}

export function Timeline({ items, onLoadMore, hasMore = false, isLoading = false }: TimelineProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No moments captured yet</p>
            <p className="text-sm text-muted-foreground">Start by adding your first beautiful moment!</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Moments</h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="flex space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                {index < items.length - 1 && <div className="w-px h-16 bg-border mt-2"></div>}
              </div>
              <div className="flex-1 pb-4">
                <Link
                  href={`/moments/${item.id}`}
                  className="block hover:bg-muted/50 rounded-lg p-3 -m-3 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{formatDate(item.moment_date)}</p>
                    </div>
                    {item.media_urls && item.media_urls.length > 0 && (
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center ml-3">
                        <ImageIcon className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="text-center pt-4">
              <Button variant="outline" onClick={onLoadMore} disabled={isLoading} className="bg-transparent">
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
