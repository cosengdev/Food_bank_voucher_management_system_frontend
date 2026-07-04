import { NextResponse } from 'next/server'

const RAILWAY_HOST = process.env.BACKEND_API_URL || 'https://foodbankvouchermanagementsystembackend-production-5ddf.up.railway.app/api/v1'

async function proxyRequest(request, { params }) {
  try {
    const resolvedParams = await params
    const pathSegments = resolvedParams.path || []
    const path = pathSegments.join('/')
    
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()
    
    const targetUrl = `${RAILWAY_HOST}/${path}${queryString ? `?${queryString}` : ''}`
    
    const authHeader = request.headers.get('authorization')
    const contentType = request.headers.get('content-type')

    const headers = {
      'Content-Type': contentType || 'application/json',
      ...(authHeader ? { Authorization: authHeader } : {}),
    }

    let body = null
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        body = await request.text()
      } catch (e) {
        body = null
      }
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body && body.length > 0 ? body : undefined,
    })

    const responseText = await response.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      responseData = { message: responseText }
    }

    return NextResponse.json(responseData, { status: response.status })
  } catch (error) {
    console.error('API Proxy Error:', error)
    return NextResponse.json({ error: 'Failed to communicate with Railway backend server', details: error.message }, { status: 500 })
  }
}

export async function GET(request, context) {
  return proxyRequest(request, context)
}

export async function POST(request, context) {
  return proxyRequest(request, context)
}

export async function PATCH(request, context) {
  return proxyRequest(request, context)
}

export async function PUT(request, context) {
  return proxyRequest(request, context)
}

export async function DELETE(request, context) {
  return proxyRequest(request, context)
}
