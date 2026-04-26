'use client'
import { Theme, THEMES } from '@/types'

interface Props {
  text: string
  author: string
  bookTitle?: string | null
  theme: Theme
}

const FONT_CLASS: Record<Theme, string> = {
  navy: 'font-hahmlet',
  white: '',
  cream: '',
}

export default function SentenceCard({ text, author, bookTitle, theme }: Props) {
  const t = THEMES[theme]
  const fontStyle = theme === 'cream' ? { fontFamily: "'Noto Serif KR', serif" } : {}
  const metaText = bookTitle ? `${bookTitle} · ${author}` : author

  return (
    <div
      className="w-full aspect-square p-8 flex flex-col"
      style={{ background: t.bg, borderRadius: '4px', border: theme !== 'navy' ? `1px solid ${t.meta}33` : 'none' }}
    >
      <p
        className={`flex-1 text-lg leading-loose word-break-keep-all ${FONT_CLASS[theme]}`}
        style={{ color: t.text, fontWeight: 300, ...fontStyle }}
      >
        &ldquo;{text}&rdquo;
      </p>
      <div className="mt-auto pt-4">
        <p
          className={`text-xs italic leading-relaxed ${FONT_CLASS[theme]}`}
          style={{ color: t.meta, ...fontStyle }}
        >
          {metaText}
        </p>
        <p className="text-[10px] tracking-widest mt-1" style={{ color: t.brand }}>
          Life, Sentence
        </p>
      </div>
    </div>
  )
}
