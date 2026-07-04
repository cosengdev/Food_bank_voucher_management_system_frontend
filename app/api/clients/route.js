import { NextResponse } from 'next/server'
import { mockClients } from '../../../lib/mockData'

const RAILWAY_URL = process.env.BACKEND_API_URL || 'https://foodbankvouchermanagementsystembackend-production-5ddf.up.railway.app/api/v1'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)

    const response = await fetch(`${RAILWAY_URL}/clients?${searchParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    const data = await response.json().catch(() => ({}))
    
    if (response.ok) {
      return NextResponse.json(data)
    }

    // Fallback to mock data if backend errors out or returns empty
    return NextResponse.json({ success: true, data: mockClients })
  } catch (error) {
    console.error('Clients API Proxy error:', error)
    return NextResponse.json({ success: true, data: mockClients })
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()

    const response = await fetch(`${RAILWAY_URL}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Create Client Proxy error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
