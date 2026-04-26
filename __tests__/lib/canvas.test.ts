import { buildMetaText, wrapTextLines } from '@/lib/canvas'

describe('buildMetaText', () => {
  it('책 제목이 있으면 "책제목 · 작가명" 반환', () => {
    expect(buildMetaText('도종환', '흔들리며 피는 꽃')).toBe('흔들리며 피는 꽃 · 도종환')
  })

  it('책 제목이 없으면 작가명만 반환', () => {
    expect(buildMetaText('도종환', null)).toBe('도종환')
    expect(buildMetaText('도종환', undefined)).toBe('도종환')
  })
})

describe('wrapTextLines', () => {
  it('maxWidth보다 긴 텍스트를 여러 줄로 나눈다', () => {
    const mockCtx = {
      measureText: (t: string) => ({ width: t.length * 10 }),
    } as unknown as CanvasRenderingContext2D

    const lines = wrapTextLines(mockCtx, 'Hello World Test', 100)
    expect(lines.length).toBeGreaterThan(1)
  })
})
