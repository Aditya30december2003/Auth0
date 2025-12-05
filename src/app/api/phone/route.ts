import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import axios from 'axios'
import { getManagementApiToken } from '@/lib/auth0Token'

export async function POST(req: NextRequest) {


  const session = await auth0.getSession(req)
  if (!session?.user?.sub) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  
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
    const mgmtToken = await getManagementApiToken()
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

    
    return NextResponse.json({ 
      ok: true, 
      redirectTo: '/api/auth/refresh?returnTo=/profile'
    }, { status: 200 })
  } catch (err: any) {
    console.error('Auth0 update error:', err?.response?.data || err.message)
    return NextResponse.json({ error: 'Failed to update metadata' }, { status: 500 })
  }
}