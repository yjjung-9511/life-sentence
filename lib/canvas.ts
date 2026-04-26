import { Theme, THEMES } from '@/types'

export function buildMetaText(author: string, bookTitle?: string | null): string {
  if (bookTitle) return `${bookTitle} · ${author}`
  return author
}

export function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = []
  let line = ''

  for (const char of text) {
    const testLine = line + char
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      lines.push(line)
      line = char
    } else {
      line = testLine
    }
  }
  if (line) lines.push(line)
  return lines
}

async function loadFont(fontFamily: string): Promise<void> {
  const fontMap: Record<string, string> = {
    Hahmlet: 'https://fonts.gstatic.com/s/hahmlet/v14/BnX4l_m80YAgXsap9MsixEkp.woff2',
    'Noto Sans KR': 'https://fonts.gstatic.com/s/notosanskr/v36/PbykFmXiEBPT4ITbgNA5Cgm203Tq4JJWq209pU0DPdWuqxJFA4GNDCBYtw.0.woff2',
    'Noto Serif KR': 'https://fonts.gstatic.com/s/notoserifkr/v19/3JnmSDn90Gmq2mr3blnHaTZXTihK8BD9hFh.woff2',
  }

  const url = fontMap[fontFamily]
  if (!url) return

  try {
    const face = new FontFace(fontFamily, `url(${url})`, { weight: '300' })
    await face.load()
    document.fonts.add(face)
  } catch {
    // 폰트 로드 실패 시 시스템 기본 폰트로 폴백
  }
}

export async function generateCardImage(
  text: string,
  author: string,
  bookTitle: string | null,
  theme: Theme
): Promise<void> {
  const t = THEMES[theme]
  await loadFont(t.font)

  const SIZE = 1080
  const PAD = 80
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!

  // 배경
  ctx.fillStyle = t.bg
  ctx.fillRect(0, 0, SIZE, SIZE)

  // 따옴표 포함 텍스트
  const fullText = `"${text}"`
  const fontSize = 46
  const lineHeight = fontSize * 1.85
  ctx.fillStyle = t.text
  ctx.font = `300 ${fontSize}px "${t.font}"`

  const lines = wrapTextLines(ctx, fullText, SIZE - PAD * 2)
  lines.forEach((line, i) => {
    ctx.fillText(line, PAD, PAD + fontSize + i * lineHeight)
  })

  // 메타 (좌측 하단)
  const metaY = SIZE - 110
  ctx.fillStyle = t.meta
  ctx.font = `300 28px "${t.font}"`
  ctx.fillText(buildMetaText(author, bookTitle), PAD, metaY)

  // 브랜드
  ctx.fillStyle = t.brand
  ctx.font = `300 22px "${t.font}"`
  ctx.fillText('Life, Sentence', PAD, metaY + 42)

  // PNG 다운로드 (Promise로 래핑해야 await가 정상 동작)
  await new Promise<void>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('이미지 생성 실패')); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'life-sentence.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      resolve()
    }, 'image/png')
  })
}
