import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function GET() {
  const db = getServiceClient()

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

  if (!data || data.length === 0) return NextResponse.json([])

  // 작가별로 그룹핑 후 라운드로빈으로 섞어 다양한 작가가 보이게 함
  const groups = new Map<string, typeof data>()
  for (const s of data) {
    const key = s.author
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(s)
  }

  const result: typeof data = []
  const lists = Array.from(groups.values())
  let i = 0
  while (result.length < 9 && lists.some((l) => i < l.length)) {
    for (const list of lists) {
      if (i < list.length) result.push(list[i])
      if (result.length >= 9) break
    }
    i++
  }

  return NextResponse.json(result)
}
