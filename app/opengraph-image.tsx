import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Life, Sentence'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

async function loadHahmletFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Hahmlet:wght@300',
      { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } }
    ).then((r) => r.text())

    // Google Fonts CSS의 마지막 @font-face가 Latin 서브셋
    const matches = Array.from(css.matchAll(/src: url\((.+?)\) format/g))
    const fontUrl = matches[matches.length - 1]?.[1]
    if (!fontUrl) return null

    return fetch(fontUrl).then((r) => r.arrayBuffer())
  } catch {
    return null
  }
}

export default async function Image() {
  const hahmletFont = await loadHahmletFont()

  const fontOptions = hahmletFont
    ? [{ name: 'Hahmlet', data: hahmletFont, weight: 300 as const, style: 'normal' as const }]
    : undefined

  return new ImageResponse(
    (
      <div
        style={{
          background: '#fdf3e4',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flex: 1 }}>
          {/* 좌: 타이틀 — Hahmlet 적용 */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05, fontFamily: 'Hahmlet, serif' }}>
            <span style={{ fontSize: 128, fontWeight: 300, color: '#3a2e1e' }}>Life,</span>
            <span style={{ fontSize: 128, fontWeight: 300, color: '#3a2e1e' }}>Sentence</span>
          </div>
          {/* 우: 카피 */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', maxWidth: 380, paddingBottom: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: 20 }}>
              <span style={{ fontSize: 22, fontWeight: 300, color: '#5a4228', lineHeight: 1.9 }}>인생의 어느 굴곡에서,</span>
              <span style={{ fontSize: 22, fontWeight: 300, color: '#5a4228', lineHeight: 1.9 }}>당신을 버티게 해준 문장이 있었나요.</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: 16, fontWeight: 300, color: '#9a8060', lineHeight: 1.9 }}>매일 새로운 문장이 기부됩니다.</span>
              <span style={{ fontSize: 16, fontWeight: 300, color: '#9a8060', lineHeight: 1.9 }}>오늘 당신에게 어울리는 문장은 무엇일까요.</span>
            </div>
          </div>
        </div>
        {/* 하단 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '2px solid #d4b880',
            paddingTop: 24,
            marginTop: 32,
          }}
        >
          <span style={{ fontSize: 13, color: '#c8863a', letterSpacing: 6, fontWeight: 400 }}>
            LIFE-SENTENCE.VERCEL.APP
          </span>
          <span style={{ fontSize: 24, color: '#c8863a' }}>✦</span>
        </div>
      </div>
    ),
    { ...size, fonts: fontOptions }
  )
}
