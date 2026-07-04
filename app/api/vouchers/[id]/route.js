import { NextResponse } from 'next/server'

const RAILWAY_URL = process.env.BACKEND_API_URL || 'https://foodbankvouchermanagementsystembackend-production-5ddf.up.railway.app/api/v1'

export async function PATCH(request, { params }) {
  try {
    const { id } = await params
    const authHeader = request.headers.get('authorization')
    const body = await request.json()

    const response = await fetch(`${RAILWAY_URL}/vouchers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json().catch(() => ({}))
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Update Voucher Status Proxy error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
