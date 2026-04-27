import { NextRequest, NextResponse } from 'next/server'
import { extractTextFromImage } from '@/lib/claude'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
type AllowedType = (typeof ALLOWED_TYPES)[number]

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File | null

    if (!file) return NextResponse.json({ error: '이미지를 업로드해주세요.' }, { status: 400 })
    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: '이미지가 너무 큽니다. 4MB 이하 파일을 올려주세요.' }, { status: 400 })

    const mediaType: AllowedType = ALLOWED_TYPES.includes(file.type as AllowedType)
      ? (file.type as AllowedType)
      : 'image/jpeg'

    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    const text = await extractTextFromImage(base64, mediaType)
    return NextResponse.json({ text })
  } catch {
    return NextResponse.json({ error: '이미지 인식 중 오류가 발생했습니다. 다시 시도해주세요.' }, { status: 500 })
  }
}
