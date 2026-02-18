'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Booking {
  id: number
  name: string
  roll_number: string
  slot_time: string
  created_at: string
}

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setError(null)
      const response = await fetch('/api/all-bookings')
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please log in again.')
          onLogout()
          return
        }
        throw new Error('Failed to fetch bookings')
      }

      const data = await response.json()
      setBookings(data || [])
    } catch (err) {
      setError('Failed to load bookings. Please try again.')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return
    }

    try {
      const response = await fetch(`/api/bookings?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete booking')
      }

      // Remove from list
      setBookings(bookings.filter(b => b.id !== id))
    } catch (err) {
      alert('Failed to delete booking')
      console.error('Delete error:', err)
    }
  }

  const handleExportCSV = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/bookings/export/csv')
      
      if (!response.ok) {
        throw new Error('Failed to export CSV')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert('Failed to export CSV')
      console.error('Export error:', err)
    } finally {
      setExporting(false)
    }
  }

  const slotStats = bookings.reduce(
    (acc, booking) => {
      acc[booking.slot_time] = (acc[booking.slot_time] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage event bookings
              </p>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="h-10 px-6 border-border hover:bg-muted/50 font-medium text-foreground"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 border border-border bg-card shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-2">Total Bookings</p>
            <p className="text-3xl font-bold text-foreground">{bookings.length}</p>
          </Card>
          <Card className="p-6 border border-border bg-card shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-2">Total Slots</p>
            <p className="text-3xl font-bold text-foreground">{Object.keys(slotStats).length}</p>
          </Card>
          <Card className="p-6 border border-border bg-card shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-2">Avg per Slot</p>
            <p className="text-3xl font-bold text-foreground">
              {Object.keys(slotStats).length > 0
                ? (bookings.length / Object.keys(slotStats).length).toFixed(1)
                : '0'}
            </p>
          </Card>
        </div>

        {/* Export Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={handleExportCSV}
            disabled={exporting || bookings.length === 0}
            className="h-10 px-6 bg-foreground text-background hover:bg-foreground/90 font-semibold disabled:opacity-50"
          >
            {exporting ? 'Exporting...' : 'Export to CSV'}
          </Button>
        </div>

        {/* Bookings Table */}
        <Card className="border border-border bg-card shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Loading bookings...</div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button
                onClick={fetchBookings}
                variant="outline"
                className="border-border hover:bg-muted/50"
              >
                Try Again
              </Button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No bookings yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="font-semibold text-foreground">Name</TableHead>
                    <TableHead className="font-semibold text-foreground">Roll Number</TableHead>
                    <TableHead className="font-semibold text-foreground">Slot Time</TableHead>
                    <TableHead className="font-semibold text-foreground">Booked At</TableHead>
                    <TableHead className="text-right font-semibold text-foreground">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="border-border hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground">{booking.name}</TableCell>
                      <TableCell className="text-foreground">{booking.roll_number}</TableCell>
                      <TableCell className="text-foreground font-semibold">{booking.slot_time}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(booking.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleDeleteBooking(booking.id)}
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 text-destructive border-destructive/30 hover:bg-destructive/10 font-medium text-xs"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
