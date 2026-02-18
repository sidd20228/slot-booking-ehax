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
      SELECT name, roll_number, slot_time
      FROM bookings 
      ORDER BY slot_time ASC, created_at ASC
    `

    // Generate CSV
    let csv = 'Name,Roll Number,Slot Time\n'
    result.rows.forEach((row: any) => {
      csv += `"${row.name}","${row.roll_number}","${row.slot_time}"\n`
    })

    // Return as CSV file
    const response = new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="bookings-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })

    return response
  } catch (error) {
    console.error('Error exporting CSV:', error)
    return NextResponse.json(
      { error: 'Failed to export CSV' },
      { status: 500 }
    )
  }
}
