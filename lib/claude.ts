import Anthropic from '@anthropic-ai/sdk'
import { Sentence } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function extractUuid(raw: string): string {
  const uuidMatch = raw.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)
  if (uuidMatch) return uuidMatch[0]
  const cleaned = raw.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim()
  return JSON.parse(cleaned).id as string
}

// 문장 매칭: 2단계 — 고민 맥락 추론 후 전체 풀에서 최적 문장 선택
export async function matchSentence(
  sentences: Pick<Sentence, 'id' | 'text' | 'author' | 'book_title'>[],
  name: string,
  concern: string
): Promise<string> {
  // Stage 1: 고민의 표면 감정 + "왜 이 말을 할까" 맥락 추론
  const analysisRes = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: `사용자가 남긴 고민을 읽고, 이 사람이 "왜 이런 말을 할까"를 깊이 추론하세요.
겉으로 드러난 감정 너머에 있는 맥락과 진짜 필요를 파악하는 것이 목표입니다.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "surface_emotion": "표면적으로 드러나는 감정 1~3가지",
  "context_reasoning": "이 말을 하게 된 배경과 상황 추론 (2~3문장, 단정 짓지 말고 추론으로 서술)",
  "underlying_need": "지금 이 사람이 진짜로 필요로 하는 것 (위로인지, 용기인지, 인정인지, 시각의 전환인지)",
  "sentence_direction": "어떤 결의 문장이 닿을지 구체적인 방향 (예: 시간이 해결한다는 메시지보다 지금 이 감정을 있는 그대로 인정하는 문장)"
}`,
    messages: [{ role: 'user', content: `이름: ${name}\n고민: ${concern}` }],
  })

  // 분석 결과 파싱 (실패해도 원문 그대로 사용)
  const analysisRaw = (analysisRes.content[0] as { type: string; text: string }).text
  let analysis = analysisRaw
  try {
    const cleaned = analysisRaw.replace(/```(?:json)?\s*/g, '').replace(/```\s*$/g, '').trim()
    const parsed = JSON.parse(cleaned)
    analysis = `감정: ${parsed.surface_emotion}
맥락 추론: ${parsed.context_reasoning}
진짜 필요: ${parsed.underlying_need}
문장 방향: ${parsed.sentence_direction}`
  } catch { /* 원문 사용 */ }

  // Stage 2: 추론 결과를 바탕으로 전체 문장 풀에서 최적 선택
  const list = sentences
    .map((s) => `ID:${s.id}\n문장: ${s.text}\n작가: ${s.author}`)
    .join('\n\n')

  const selectRes = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    system: `당신은 깊은 공감 능력을 가진 문장 큐레이터입니다.
아래 [이 사람에 대한 분석]을 바탕으로 지금 이 사람에게 가장 필요한 문장 하나를 선택하세요.
억지 위로보다 정직한 공명을 우선하고, 읽은 후 조금이라도 달라질 수 있는 문장을 고르세요.
반드시 JSON 형식으로만 응답하세요: {"id": "선택한_문장의_UUID"}`,
    messages: [{
      role: 'user',
      content: `[이 사람에 대한 분석]\n${analysis}\n\n[원래 고민]\n${concern}\n\n[문장 목록]\n${list}`,
    }],
  })

  return extractUuid((selectRes.content[0] as { type: string; text: string }).text)
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
