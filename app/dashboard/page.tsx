"use client"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Timeline } from "@/components/timeline"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Heart, Plus, Settings, CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import ActivityCalendar from "react-activity-calendar"
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

interface Moment {
  id: string
  title: string
  description: string | null
  moment_date: string
  media_urls: string[] | null
  created_at: string
}

interface ActivityData {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [moments, setMoments] = useState<Moment[]>([])
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        setUser(user)

        // Load profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError || !profileData) {
          router.push("/onboarding")
          return
        }

        setProfile(profileData)

        // Load moments for timeline
        const { data: momentsData, error: momentsError } = await supabase
          .from("moments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20)

        if (momentsError) {
          console.error("Error loading moments:", momentsError)
        } else {
          setMoments(momentsData || [])
          setHasMore((momentsData || []).length === 20)
        }

        // Load activity data for calendar
        await loadActivityData(user.id)
      } catch (error) {
        console.error("Error loading dashboard:", error)
        toast.error("Failed to load dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [router, supabase])

  const loadActivityData = async (userId: string) => {
    try {
      // Get moments grouped by date for the last year
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      const { data: activityMoments, error } = await supabase
        .from("moments")
        .select("moment_date")
        .eq("user_id", userId)
        .gte("moment_date", oneYearAgo.toISOString().split("T")[0])

      if (error) {
        console.error("Error loading activity data:", error)
        return
      }

      // Process data for activity calendar
      const activityMap = new Map<string, number>()

      activityMoments?.forEach((moment) => {
        const date = moment.moment_date
        activityMap.set(date, (activityMap.get(date) || 0) + 1)
      })

      // Generate activity data for the last year
      const activity: ActivityData[] = []
      const today = new Date()
      const startDate = new Date(oneYearAgo)

      for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split("T")[0]
        const count = activityMap.get(dateStr) || 0
        let level: 0 | 1 | 2 | 3 | 4 = 0

        if (count > 0) {
          if (count >= 4) level = 4
          else if (count >= 3) level = 3
          else if (count >= 2) level = 2
          else level = 1
        }

        activity.push({
          date: dateStr,
          count,
          level,
        })
      }

      setActivityData(activity)
    } catch (error) {
      console.error("Error processing activity data:", error)
    }
  }

  const loadMoreMoments = async () => {
    if (!user || loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const { data: moreMoments, error } = await supabase
        .from("moments")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(moments.length, moments.length + 19)

      if (error) {
        console.error("Error loading more moments:", error)
        toast.error("Failed to load more moments")
      } else {
        setMoments((prev) => [...prev, ...(moreMoments || [])])
        setHasMore((moreMoments || []).length === 20)
      }
    } catch (error) {
      console.error("Error loading more moments:", error)
    } finally {
      setLoadingMore(false)
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
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="w-12 h-12">
              <AvatarImage src={profile.profile_photo_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Hello {profile.username}</h1>
              <p className="text-muted-foreground">Welcome to {profile.partner_name}'s vault!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" asChild className="bg-transparent">
              <Link href="/settings">
                <Settings className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Add New Moment CTA */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Capture a Beautiful Moment</h3>
                  <p className="text-sm text-muted-foreground">Add something special that happened today</p>
                </div>
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/moments/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Moment
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity Calendar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Your Love Story Activity</h2>
            </div>
            <div className="overflow-x-auto">
              <ActivityCalendar
                data={activityData}
                theme={{
                  light: ["#fdf2f8", "#fce7f3", "#fbcfe8", "#f9a8d4", "#ec4899"],
                  dark: ["#1f2937", "#374151", "#6b7280", "#9ca3af", "#ec4899"],
                }}
                labels={{
                  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                  totalCount: "{{count}} moments in {{year}}",
                  legend: {
                    less: "Less",
                    more: "More",
                  },
                }}
                showWeekdayLabels
                blockSize={12}
                blockMargin={3}
                fontSize={12}
              />
            </div>
          </CardContent>
        </Card>

        <Timeline items={moments} onLoadMore={loadMoreMoments} hasMore={hasMore} isLoading={loadingMore} />
      </div>
    </div>
  )
}
