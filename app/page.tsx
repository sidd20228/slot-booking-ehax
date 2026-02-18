'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlotSelector } from '@/components/slot-selector'

export default function BookingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
  })
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Please enter your name')
      return
    }

    if (!formData.rollNumber.trim()) {
      setError('Please enter your roll number')
      return
    }

    if (!selectedSlot) {
      setError('Please select a time slot')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          rollNumber: formData.rollNumber,
          slotTime: selectedSlot,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to book slot')
        return
      }

      // Success - redirect to thank you page
      router.push('/thank-you')
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Booking error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
            Event Slot Booking
          </h1>
          <p className="text-muted-foreground text-lg">
            Reserve your spot for our upcoming event
          </p>
        </div>

        <Card className="p-8 md:p-10 border border-border bg-card shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base font-medium text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                className="h-11 border-border bg-background text-foreground placeholder-muted-foreground"
                disabled={loading}
              />
            </div>

            {/* Roll Number Field */}
            <div className="space-y-3">
              <Label htmlFor="rollNumber" className="text-base font-medium text-foreground">
                Roll Number
              </Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                type="text"
                placeholder="Enter your roll number"
                value={formData.rollNumber}
                onChange={handleInputChange}
                className="h-11 border-border bg-background text-foreground placeholder-muted-foreground"
                disabled={loading}
              />
            </div>

            {/* Slot Selector */}
            <div>
              <SlotSelector onSlotSelect={setSelectedSlot} selectedSlot={selectedSlot} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !selectedSlot || !formData.name || !formData.rollNumber}
              className="w-full h-11 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
            >
              {loading ? 'Booking...' : 'Book Now'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Limited to 4 people per time slot
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
