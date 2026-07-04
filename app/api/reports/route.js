import { NextResponse } from 'next/server'
import { mockDashboardStats } from '../../../lib/mockData'

const RAILWAY_URL = process.env.BACKEND_API_URL || 'https://foodbankvouchermanagementsystembackend-production-5ddf.up.railway.app/api/v1'

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)

    const response = await fetch(`${RAILWAY_URL}/reports?${searchParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Fallback report structure
    return NextResponse.json({
      success: true,
      stats: {
        totalVouchers: mockDashboardStats.vouchersThisMonth,
        uniqueClients: mockDashboardStats.uniqueClients,
        repeatVouchers: mockDashboardStats.repeatVouchers,
        cancellations: 11,
      },
      rows: [
        { centre: 'Peckham Centre', vouchers: 148, clients: 112, repeats: 33, collection: 112, delivery: 36 },
        { centre: 'Brixton Centre', vouchers: 99, clients: 77, repeats: 25, collection: 70, delivery: 29 },
      ]
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
