'use client'

import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ThankYouPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="p-8 md:p-10 border border-border bg-card shadow-sm text-center">
          <div className="space-y-6">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-foreground/10 flex items-center justify-center">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Thank You Message */}
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Thank You!
              </h1>
              <p className="text-lg text-muted-foreground">
                Your slot has been successfully booked
              </p>
            </div>

            {/* Details */}
            <div className="bg-muted/50 rounded-lg p-6 border border-border space-y-4">
              <div className="text-left space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your booking details have been confirmed. Please arrive 5 minutes early to your booked time slot.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={() => router.push('/')}
                className="w-full h-11 text-base font-semibold bg-foreground text-background hover:bg-foreground/90"
              >
                Book Another Slot
              </Button>
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                className="w-full h-11 text-base font-semibold border-border hover:bg-muted/50"
              >
                Admin Login
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
