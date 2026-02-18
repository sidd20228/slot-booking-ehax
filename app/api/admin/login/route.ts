import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USER_ID = 'EHAX'
const ADMIN_PASSWORD = 'ehax@thebest69#'

export async function POST(request: NextRequest) {
  try {
    const { userId, password } = await request.json()

    if (!userId || !password) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      )
    }

    if (userId === ADMIN_USER_ID && password === ADMIN_PASSWORD) {
      // Create response with auth token in cookie
      const response = NextResponse.json(
        { success: true, message: 'Login successful' },
        { status: 200 }
      )

      // Set auth cookie (httpOnly for security)
      response.cookies.set('admin_auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      })

      return response
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Error during login:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
