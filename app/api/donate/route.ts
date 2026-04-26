import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { DonateRequest } from '@/types'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as DonateRequest

  if (!body.text?.trim()) return NextResponse.json({ error: '문장을 입력해주세요.' }, { status: 400 })
  if (!body.author?.trim()) return NextResponse.json({ error: '작가 이름을 입력해주세요.' }, { status: 400 })
  if (!body.donor_name?.trim()) return NextResponse.json({ error: '이름을 입력해주세요.' }, { status: 400 })
  if (!isValidEmail(body.donor_email)) return NextResponse.json({ error: '이메일 형식이 올바르지 않습니다.' }, { status: 400 })

  const db = getServiceClient()
  const { error } = await db.from('sentences').insert({
    text: body.text.trim(),
    author: body.author.trim(),
    book_title: body.book_title?.trim() || null,
    donor_name: body.donor_name.trim(),
    donor_email: body.donor_email.trim().toLowerCase(),
    is_approved: false,
  })

  if (error) return NextResponse.json({ error: '저장에 실패했습니다.' }, { status: 500 })

  return NextResponse.json({ success: true })
}
