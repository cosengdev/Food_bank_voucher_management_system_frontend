import { NextResponse } from 'next/server'
import { mockDashboardStats } from '../../../lib/mockData'

const RAILWAY_URL = process.env.BACKEND_API_URL || 'https://foodbankvouchermanagementsystembackend-production-5ddf.up.railway.app/api/v1'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')

    const response = await fetch(`${RAILWAY_URL}/stats`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ success: true, data: mockDashboardStats })
  } catch (error) {
    return NextResponse.json({ success: true, data: mockDashboardStats })
  }
}
