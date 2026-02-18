'use client'

import { useState, useEffect } from 'react'
import { AdminLogin } from '@/components/admin-login'
import { AdminDashboard } from '@/components/admin-dashboard'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if already authenticated from localStorage
    const savedAuth = localStorage.getItem('admin_authenticated')
    if (savedAuth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
    localStorage.setItem('admin_authenticated', 'true')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
    // Also clear the server-side cookie by calling logout endpoint
    fetch('/api/admin/logout', { method: 'POST' }).catch(console.error)
  }

  if (!mounted) {
    return null
  }

  return isAuthenticated ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLoginSuccess={handleLoginSuccess} />
  )
}
