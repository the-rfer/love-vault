import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Heart } from "lucide-react"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-card">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Check Your Email</CardTitle>
              <CardDescription className="text-muted-foreground">We've sent you a confirmation link</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please check your email and click the confirmation link to activate your account.
              </p>
              <p className="text-sm text-muted-foreground">
                Once confirmed, you'll be redirected to complete your profile setup.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">Almost there!</span>
              <Heart className="w-4 h-4" />
            </div>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/auth/login">Back to Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
