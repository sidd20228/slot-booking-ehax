'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AdminLoginProps {
  onLoginSuccess: () => void
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  })
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

    if (!formData.userId.trim()) {
      setError('Please enter user ID')
      return
    }

    if (!formData.password.trim()) {
      setError('Please enter password')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: formData.userId,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // Success - call callback
      onLoginSuccess()
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
            Admin Login
          </h1>
          <p className="text-muted-foreground">
            Access the booking dashboard
          </p>
        </div>

        <Card className="p-8 border border-border bg-card shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID Field */}
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-sm font-medium text-foreground">
                User ID
              </Label>
              <Input
                id="userId"
                name="userId"
                type="text"
                placeholder="Enter user ID"
                value={formData.userId}
                onChange={handleInputChange}
                className="h-10 border-border bg-background text-foreground placeholder-muted-foreground"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleInputChange}
                className="h-10 border-border bg-background text-foreground placeholder-muted-foreground"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !formData.userId || !formData.password}
              className="w-full h-10 text-base font-semibold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
