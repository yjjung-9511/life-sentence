import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { matchSentence } from '@/lib/claude'
import { extractIp } from '@/lib/ip'
import { DrawRequest, DrawResponse } from '@/types'

const MAX_DRAWS_PER_DAY = 3

function getKstMidnight(): Date {
  // KST = UTC+9, 오늘 KST 00:00을 UTC로 계산
  const now = new Date()
  const kstOffset = 9 * 60 * 60 * 1000
  const kstNow = new Date(now.getTime() + kstOffset)
  const kstMidnight = new Date(
    Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate())
  )
  return new Date(kstMidnight.getTime() - kstOffset)
}

async function countTodayDrawsByIp(ip: string): Promise<number> {
  const db = getServiceClient()
  const since = getKstMidnight().toISOString()
  const { count } = await db
    .from('draws')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('drawn_at', since)
  return count ?? 0
}

export async function POST(req: NextRequest) {
  const ip = extractIp(req)
  const body = (await req.json()) as DrawRequest

  if (!body.name?.trim() || !body.concern?.trim()) {
    return NextResponse.json({ error: '이름과 고민을 입력해주세요.' }, { status: 400 })
  }

  const todayCount = await countTodayDrawsByIp(ip)
  if (todayCount >= MAX_DRAWS_PER_DAY) {
    return NextResponse.json(
      { error: '오늘은 이미 3번 받으셨어요. 내일 다시 방문해주세요.' },
      { status: 429 }
    )
  }

  const db = getServiceClient()

  // 승인된 문장 최신 50개 가져오기
  const { data: sentences } = await db
    .from('sentences')
    .select('id, text, author, book_title')
    .eq('is_approved', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (!sentences || sentences.length === 0) {
    return NextResponse.json({ error: '아직 문장이 없습니다.' }, { status: 503 })
  }

  // Claude로 매칭 (실패 시 랜덤 폴백)
  let matched: (typeof sentences)[number] | undefined
  try {
    const sentenceId = await matchSentence(sentences, body.name, body.concern)
    matched = sentences.find((s) => s.id === sentenceId)
  } catch {
    // Claude 응답 파싱 실패 시 랜덤 선택
  }

  if (!matched) {
    matched = sentences[Math.floor(Math.random() * sentences.length)]
  }

  return handleMatch(db, ip, body, matched, todayCount)
}

async function handleMatch(
  db: ReturnType<typeof getServiceClient>,
  ip: string,
  body: DrawRequest,
  sentence: { id: string; text: string; author: string; book_title: string | null },
  todayCount: number
) {
  // draw 기록 저장
  await db.from('draws').insert({
    ip_address: ip,
    visitor_name: body.name,
    concern: body.concern,
    sentence_id: sentence.id,
  })

  // gift_count 증가
  await db.rpc('increment_gift_count', { sentence_id: sentence.id })

  const response: DrawResponse = {
    sentence,
    remainingDraws: MAX_DRAWS_PER_DAY - (todayCount + 1),
  }
  return NextResponse.json(response)
}
