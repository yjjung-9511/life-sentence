'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SentenceCard from '@/components/SentenceCard'
import ThemeSelector from '@/components/ThemeSelector'
import { generateCardImage } from '@/lib/canvas'
import { supabase } from '@/lib/supabase'
import { Theme, Sentence } from '@/types'

function ResultContent() {
  const params = useSearchParams()
  const router = useRouter()
  const id = params.get('id')
  const name = params.get('name') ?? ''
  const remaining = Number(params.get('remaining') ?? 0)

  const [sentence, setSentence] = useState<Pick<Sentence, 'id' | 'text' | 'author' | 'book_title'> | null>(null)
  const [theme, setTheme] = useState<Theme>('navy')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) { router.replace('/'); return }
    supabase
      .from('sentences')
      .select('id, text, author, book_title')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!data) { router.replace('/'); return }
        setSentence(data)
      })
  }, [id, router])

  async function handleSave() {
    if (!sentence) return
    setSaving(true)
    try {
      await generateCardImage(sentence.text, sentence.author, sentence.book_title, theme)
    } finally {
      setSaving(false)
    }
  }

  if (!sentence) {
    return <div className="flex items-center justify-center min-h-screen text-sm" style={{ color: 'var(--text-sub)' }}>문장을 불러오는 중...</div>
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <nav className="px-8 py-5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <span className="font-hahmlet text-xl font-light" style={{ color: 'var(--text)' }}>Life, Sentence</span>
        <button onClick={() => router.push('/')} className="text-sm" style={{ color: 'var(--text-sub)' }}>← 처음으로</button>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-hahmlet font-light text-sm mb-5 leading-loose" style={{ color: 'var(--text-sub)' }}>
            {name}님,<br />오늘 당신에게 건네는 문장입니다.
          </p>
          <SentenceCard
            text={sentence.text}
            author={sentence.author}
            bookTitle={sentence.book_title}
            theme={theme}
          />
          <p className="text-center mt-4">
            <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#f0e4cc', color: '#b0906a' }}>
              오늘 {remaining}번 더 받을 수 있어요
            </span>
          </p>
        </div>

        <div>
          <h2 className="font-hahmlet text-xl font-light mb-2" style={{ color: 'var(--text)' }}>
            이 문장, 간직하고 싶으신가요?
          </h2>
          <p className="text-sm font-light leading-loose mb-5" style={{ color: 'var(--text-sub)' }}>
            테마를 고르면 왼쪽 카드에 바로 반영됩니다.<br />
            마음에 드는 모습으로 이미지를 저장하세요.
          </p>
          <ThemeSelector
            selected={theme}
            onChange={setTheme}
            previewText={sentence.text.slice(0, 20) + '...'}
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="font-hahmlet w-full h-12 rounded text-sm tracking-wider mt-4 disabled:opacity-50"
            style={{ background: 'var(--accent)', color: '#fdf0da' }}
          >
            {saving ? '저장 중...' : '이미지로 저장'}
          </button>

          <div className="my-6 h-px" style={{ background: 'var(--border)' }} />

          <h3 className="text-sm font-medium mb-2" style={{ color: '#6a5030' }}>당신만의 문장도 있지 않나요?</h3>
          <p className="text-sm font-light leading-loose mb-4" style={{ color: 'var(--text-sub)' }}>
            어떤 시절 당신을 버티게 해준 문장을 기부해주세요.<br />
            오늘처럼 누군가가 그 문장을 필요로 하고 있을지 모릅니다.
          </p>
          <button
            onClick={() => router.push('/#donate')}
            className="w-full h-11 rounded text-sm"
            style={{ background: 'transparent', border: '1.5px solid #c8a870', color: '#8a6a3a' }}
          >
            내 문장 기부하러 가기 →
          </button>
        </div>
      </div>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-sm">로딩 중...</div>}>
      <ResultContent />
    </Suspense>
  )
}
