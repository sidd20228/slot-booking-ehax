import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

function isAdminAuthenticated(cookieStore: any): boolean {
  const authCookie = cookieStore.get('admin_auth')
  return authCookie?.value === 'true'
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    if (!isAdminAuthenticated(cookieStore)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const result = await sql`
      SELECT id, name, roll_number, slot_time, created_at 
      FROM bookings 
      ORDER BY slot_time ASC, created_at ASC
    `

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
