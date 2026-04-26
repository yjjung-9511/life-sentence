import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function GET() {
  const db = getServiceClient()

  // KST 오늘 자정 계산
  const kstOffset = 9 * 60 * 60 * 1000
  const now = new Date()
  const kstNow = new Date(now.getTime() + kstOffset)
  const kstMidnight = new Date(
    Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate())
  )
  const since = new Date(kstMidnight.getTime() - kstOffset).toISOString()

  const { data } = await db
    .from('sentences')
    .select('id, text, author, book_title, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(9)

  return NextResponse.json(data ?? [])
}
