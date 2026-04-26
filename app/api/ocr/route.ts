import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromImage } from '@/lib/claude'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('image') as File | null

  if (!file) return NextResponse.json({ error: '이미지를 업로드해주세요.' }, { status: 400 })
  if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: '이미지는 5MB 이하여야 합니다.' }, { status: 400 })

  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')

  const text = await extractTextFromImage(base64)
  return NextResponse.json({ text })
}
