import Anthropic from '@anthropic-ai/sdk'
import { Sentence } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// 문장 매칭: 사용자 고민 → 가장 어울리는 문장 ID 반환
export async function matchSentence(
  sentences: Pick<Sentence, 'id' | 'text' | 'author' | 'book_title'>[],
  name: string,
  concern: string
): Promise<string> {
  const list = sentences
    .map((s, i) => `[${i}] ID:${s.id}\n문장: ${s.text}\n작가: ${s.author}`)
    .join('\n\n')

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    system: `당신은 깊은 공감 능력을 가진 문장 큐레이터입니다.
사용자의 고민을 읽고 아래 기준으로 가장 적합한 문장 하나를 선택하세요:
1. 지금 감정 상태와 진짜로 공명하는가 (억지 위로가 아닌 정직한 공감)
2. 읽은 후 마음이 조금 가벼워지거나, 다시 걸어갈 힘이 생기는가
3. 이 사람의 구체적인 상황에 와닿는 문장인가

반드시 JSON 형식으로만 응답하세요: {"id": "선택한_문장의_UUID"}`,
    messages: [
      {
        role: 'user',
        content: `이름: ${name}\n고민: ${concern}\n\n아래 문장 중 지금 이 사람에게 가장 필요한 문장 하나를 골라주세요:\n\n${list}`,
      },
    ],
  })

  const raw = (response.content[0] as { type: string; text: string }).text
  // Claude가 JSON 대신 텍스트로 응답해도 UUID를 직접 추출
  const uuidMatch = raw.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
  if (uuidMatch) return uuidMatch[0]
  // fallback: JSON 파싱
  const cleaned = raw.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim()
  const parsed = JSON.parse(cleaned)
  return parsed.id as string
}

// OCR: 책 사진 → 문장 텍스트 추출
export async function extractTextFromImage(
  base64Image: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg'
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64Image },
          },
          {
            type: 'text',
            text: `이미지에서 책 텍스트를 추출하는 작업입니다. 이미지가 회전되어 있거나 기울어져 있어도 텍스트를 인식해주세요.

규칙:
1. 밑줄·형광펜·표시가 있는 문장이 있으면 그 문장만 추출
2. 표시가 없으면 이미지에서 읽히는 문장 중 가장 완전한 문장 하나를 추출
3. 추출한 텍스트만 반환 — 설명, 따옴표, 부가 문구 없이
4. 텍스트를 인식할 수 없는 경우에만 빈 문자열 반환`,
          },
        ],
      },
    ],
  })

  return (response.content[0] as { type: string; text: string }).text.trim()
}
