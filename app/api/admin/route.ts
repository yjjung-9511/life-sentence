import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const db = getServiceClient()
  const { data } = await db
    .from('sentences')
    .select('*')
    .order('created_at', { ascending: false })

  return NextResponse.json(data ?? [])
}
