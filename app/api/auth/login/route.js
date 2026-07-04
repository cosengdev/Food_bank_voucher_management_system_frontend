import { NextResponse } from 'next/server'

const RAILWAY_URL = process.env.BACKEND_API_URL || 'https://foodbankvouchermanagementsystembackend-production-5ddf.up.railway.app/api/v1'

export async function POST(request) {
  try {
    const body = await request.json()

    const response = await fetch(`${RAILWAY_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Login proxy error:', error)
    return NextResponse.json({ error: 'Failed to communicate with authentication backend' }, { status: 500 })
  }
}
