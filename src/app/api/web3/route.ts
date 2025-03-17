import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'Web3 API is running' })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Handle Web3 interactions here
    return NextResponse.json({ success: true, data: body })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })
  }
} 