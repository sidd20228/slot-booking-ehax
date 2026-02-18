import { sql } from '@vercel/postgres'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

function isAdminAuthenticated(cookieStore: any): boolean {
  const authCookie = cookieStore.get('admin_auth')
  return authCookie?.value === 'true'
}

export async function POST(request: NextRequest) {
  try {
    const { name, rollNumber, slotTime } = await request.json()

    if (!name || !rollNumber || !slotTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slot is full (max 4 people)
    const slotCount = await sql`
      SELECT COUNT(*) as count FROM bookings WHERE slot_time = ${slotTime}
    `

    if (slotCount.rows[0].count >= 4) {
      return NextResponse.json(
        { error: 'This slot is full' },
        { status: 400 }
      )
    }

    // Insert booking
    const result = await sql`
      INSERT INTO bookings (name, roll_number, slot_time)
      VALUES (${name}, ${rollNumber}, ${slotTime})
      RETURNING id, name, roll_number, slot_time, created_at
    `

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const slotTime = request.nextUrl.searchParams.get('slot')

    if (!slotTime) {
      return NextResponse.json(
        { error: 'Slot time is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      SELECT COUNT(*) as count FROM bookings WHERE slot_time = ${slotTime}
    `

    return NextResponse.json({
      slotTime,
      booked: result.rows[0].count,
      available: 4 - result.rows[0].count,
    })
  } catch (error) {
    console.error('Error fetching slot availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slot availability' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    
    if (!isAdminAuthenticated(cookieStore)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = request.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      )
    }

    const result = await sql`
      DELETE FROM bookings WHERE id = ${id}
      RETURNING id
    `

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting booking:', error)
    return NextResponse.json(
      { error: 'Failed to delete booking' },
      { status: 500 }
    )
  }
}
