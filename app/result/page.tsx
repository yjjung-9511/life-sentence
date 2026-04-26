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
  const [theme, setTheme] = useState<Theme>('cream')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

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
    setSaveError('')
    try {
      await generateCardImage(sentence.text, sentence.author, sentence.book_title, theme)
    } catch (e) {
      setSaveError('저장에 실패했습니다. 다시 시도해주세요.')
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  if (!sentence) {
    return (
      <div className="flex items-center justify-center min-h-screen text-sm" style={{ color: '#9a7a50', background: '#fdf3e4' }}>
        문장을 불러오는 중...
      </div>
    )
  }

  const metaText = sentence.book_title ? `${sentence.book_title} · ${sentence.author}` : sentence.author

  return (
    <main style={{ background: '#fdf3e4' }}>
      <nav
        className="px-8 py-5 border-b flex items-center justify-between sticky top-0 z-10"
        style={{ borderColor: '#e4d0a8', background: '#fdf3e4' }}
      >
        <span className="font-hahmlet text-xl font-light" style={{ color: '#3a2e1e' }}>Life, Sentence</span>
        <button onClick={() => router.push('/')} className="text-sm" style={{ color: '#9a7a50' }}>← 처음으로</button>
      </nav>

      {/* 섹션 1: 건네는 문장 — 뷰포트 전체 높이, 스크롤 전까지 섹션 2 안 보임 */}
      <section
        className="px-8 border-b flex items-center"
        style={{ borderColor: '#e4d0a8', minHeight: 'calc(100vh - 64px)' }}
      >
        <div className="max-w-5xl mx-auto w-full py-16">
          <p className="text-[10px] tracking-widest mb-10" style={{ color: '#c8863a' }}>
            {name}님에게 건네는 문장입니다.
          </p>

          <div className="relative pl-8">
            {/* 장식용 큰따옴표 */}
            <span
              className="font-hahmlet absolute left-0 -top-3 select-none leading-none"
              style={{ fontSize: '5rem', color: '#c8863a', opacity: 0.22 }}
            >
              &ldquo;
            </span>
            <p
              className="font-hahmlet text-xl font-light leading-loose"
              style={{
                color: '#2e2010',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(200, 134, 58, 0.4)',
                textDecorationThickness: '1px',
                textUnderlineOffset: '7px',
              }}
            >
              {sentence.text}
            </p>
          </div>

          <p className="mt-8 text-sm italic" style={{ color: '#9a7a50' }}>
            — {metaText}
          </p>

          <p className="mt-5">
            <button
              onClick={() => router.push('/#draw')}
              className="text-xs px-3 py-1 rounded-full transition-opacity hover:opacity-70"
              style={{ background: '#f0e4cc', color: '#b0906a' }}
            >
              오늘 {remaining}번 더 받을 수 있어요 →
            </button>
          </p>
        </div>
      </section>

      {/* 섹션 2: 카드 만들기 — 좌(테마 선택) + 우(실시간 미리보기) */}
      <section className="px-8 py-14 border-b" style={{ borderColor: '#e4d0a8' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-widest mb-2" style={{ color: '#c8863a' }}>카드 만들기</p>
          <h2 className="font-hahmlet text-2xl font-light mb-8" style={{ color: '#3a2e1e' }}>
            이 문장, 간직하고 싶으신가요?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* 좌: 테마 선택 + 저장 버튼 */}
            <div>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: '#9a7a50' }}>
                테마를 고르면 오른쪽 미리보기에 바로 반영됩니다.
              </p>
              <ThemeSelector
                selected={theme}
                onChange={setTheme}
                previewText={sentence.text.slice(0, 18) + '…'}
              />
              <button
                onClick={handleSave}
                disabled={saving}
                className="font-hahmlet w-full h-12 rounded text-sm tracking-wider mt-5 disabled:opacity-50"
                style={{ background: '#c8863a', color: '#fdf0da' }}
              >
                {saving ? '저장 중...' : '이미지로 저장하기'}
              </button>
              {saveError && <p className="text-xs text-red-500 mt-2">{saveError}</p>}
            </div>

            {/* 우: 실시간 카드 미리보기 */}
            <div>
              <p className="text-xs mb-4" style={{ color: '#9a7a50' }}>미리보기</p>
              <SentenceCard
                text={sentence.text}
                author={sentence.author}
                bookTitle={sentence.book_title}
                theme={theme}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 섹션 3: 문장 기부 */}
      <section className="px-8 py-14" style={{ background: '#f0e6d0' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-widest mb-2" style={{ color: '#c8863a' }}>문장 기부</p>
          <h2 className="font-hahmlet text-2xl font-light mb-3" style={{ color: '#3a2e1e' }}>
            당신만의 문장도 있지 않나요?
          </h2>
          <p className="text-sm font-light leading-loose mb-8" style={{ color: '#9a7a50' }}>
            어떤 시절 당신을 버티게 해준 문장을 기부해주세요.<br />
            오늘처럼 누군가가 그 문장을 필요로 하고 있을지 모릅니다.
          </p>
          <button
            onClick={() => router.push('/#donate')}
            className="font-hahmlet h-12 px-8 rounded text-sm tracking-wider"
            style={{ background: 'transparent', border: '1.5px solid #c8a870', color: '#8a6a3a' }}
          >
            내 문장 기부하러 가기 →
          </button>
        </div>
      </section>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen text-sm" style={{ background: '#fdf3e4' }}>
        로딩 중...
      </div>
    }>
      <ResultContent />
    </Suspense>
  )
}
