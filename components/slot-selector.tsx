'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface SlotSelectorProps {
  onSlotSelect: (slot: string) => void
  selectedSlot: string | null
}

export function SlotSelector({ onSlotSelect, selectedSlot }: SlotSelectorProps) {
  const [slots, setSlots] = useState<string[]>([])
  const [availability, setAvailability] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  // Generate time slots from 6 PM to 9 PM, 15-minute intervals
  useEffect(() => {
    const generateSlots = () => {
      const timeSlots: string[] = []
      for (let hour = 18; hour < 21; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
          timeSlots.push(timeStr)
        }
      }
      setSlots(timeSlots)
      fetchAvailability(timeSlots)
    }

    generateSlots()
  }, [])

  const fetchAvailability = async (timeSlots: string[]) => {
    try {
      const availabilityMap: Record<string, number> = {}
      
      for (const slot of timeSlots) {
        const response = await fetch(`/api/bookings?slot=${slot}`)
        const data = await response.json()
        availabilityMap[slot] = data.available || 0
      }
      
      setAvailability(availabilityMap)
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading slots...</div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Select a Time Slot</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {slots.map((slot) => {
          const available = availability[slot] || 0
          const isFull = available === 0
          const isSelected = selectedSlot === slot

          return (
            <Button
              key={slot}
              onClick={() => !isFull && onSlotSelect(slot)}
              disabled={isFull}
              variant={isSelected ? 'default' : 'outline'}
              className={`h-auto flex-col py-3 ${
                isFull ? 'opacity-50 cursor-not-allowed' : ''
              } ${isSelected ? 'bg-foreground text-background' : ''}`}
            >
              <span className="font-semibold">{slot}</span>
              <span className="text-xs mt-1">
                {isFull ? 'Full' : `${available} spot${available !== 1 ? 's' : ''}`}
              </span>
            </Button>
          )
        })}
      </div>
      {selectedSlot && (
        <p className="text-sm text-muted-foreground mt-4">
          Selected slot: <span className="font-semibold text-foreground">{selectedSlot}</span>
        </p>
      )}
    </div>
  )
}
