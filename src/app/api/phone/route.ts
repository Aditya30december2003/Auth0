// src/app/api/phone/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import axios from 'axios'

export async function POST(req: NextRequest) {

  // 1) Get the logged-in user from Auth0 session
  const session = await auth0.getSession(req)
  if (!session?.user?.sub) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // 2) Parse JSON body
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const phoneNumber = body?.phoneNumber as string | undefined
  if (!phoneNumber) {
    return NextResponse.json({ error: 'phoneNumber is required' }, { status: 400 })
  }

  try {
    const mgmtToken = process.env.API_TOKEN
    if (!mgmtToken) {
      console.error('Missing API_TOKEN env var')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const rawDomain = process.env.AUTH0_DOMAIN
    if (!rawDomain) {
      console.error('Missing AUTH0_DOMAIN env var')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const domain = rawDomain.replace('https://', '')

    // 3) Call Auth0 Management API to update user_metadata
    await axios.patch(
      `https://${domain}/api/v2/users/${encodeURIComponent(session.user.sub)}`,
      {
        user_metadata: {
          phoneNumber,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    // 4) CRITICAL: Return a success with a redirect URL
    // This tells the client to force a login refresh
    return NextResponse.json({ 
      ok: true, 
      redirectTo: '/api/auth/refresh?returnTo=/profile'
    }, { status: 200 })
  } catch (err: any) {
    console.error('Auth0 update error:', err?.response?.data || err.message)
    return NextResponse.json({ error: 'Failed to update metadata' }, { status: 500 })
  }
}