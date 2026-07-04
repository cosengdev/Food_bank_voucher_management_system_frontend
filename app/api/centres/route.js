import { NextResponse } from 'next/server'
import { mockCentres } from '../../../lib/mockData'

const RAILWAY_URL = process.env.BACKEND_API_URL || 'https://foodbankvouchermanagementsystembackend-production-5ddf.up.railway.app/api/v1'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')

    const response = await fetch(`${RAILWAY_URL}/centres`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ success: true, data: mockCentres })
  } catch (error) {
    return NextResponse.json({ success: true, data: mockCentres })
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization')
    const body = await request.json()

    const response = await fetch(`${RAILWAY_URL}/centres`, {
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
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
