'use client'
import { useEffect, useState } from 'react'

interface TodaySentence {
  id: string
  text: string
  author: string
  book_title: string | null
  created_at: string
}

export default function TodaySection() {
  const [sentences, setSentences] = useState<TodaySentence[]>([])

  useEffect(() => {
    fetch('/api/sentences').then((r) => r.json()).then(setSentences)
  }, [])

  const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Seoul' })

  return (
    <section className="px-8 py-20 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 pb-4 border-b-2" style={{ borderColor: '#3a2e1e' }}>
          <div>
            <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--accent-light)' }}>오늘의 입고 문장</p>
            <h2 className="font-hahmlet text-3xl font-light" style={{ color: 'var(--text)' }}>오늘 새로 들어온 문장들</h2>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-sm" style={{ color: 'var(--text-sub)' }}>{today} 입고</p>
            <p className="text-sm" style={{ color: 'var(--accent-light)' }}>오늘 {sentences.length}개의 문장이 새로 기부되었습니다</p>
          </div>
        </div>
        {sentences.length === 0 ? (
          <p className="text-center py-12 text-sm" style={{ color: 'var(--text-sub)' }}>오늘 아직 기부된 문장이 없습니다. 첫 번째 기부자가 되어보세요.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sentences.map((s) => (
              <div key={s.id} className="rounded-lg p-5 relative overflow-hidden" style={{ background: '#f5ead4', border: '1px solid #e4d0a8' }}>
                <span className="text-[10px] tracking-widest mb-2 block" style={{ color: '#c8863a' }}>✦ 오늘 입고</span>
                <div className="relative h-14 overflow-hidden">
                  <p className="font-hahmlet text-sm font-light leading-relaxed" style={{ color: '#4a3820' }}>
                    &ldquo;{s.text}&rdquo;
                  </p>
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(to bottom, transparent 20%, #f5ead4 100%)' }} />
                </div>
                <p className="text-xs italic mt-3 relative" style={{ color: '#9a7a50' }}>
                  {s.book_title ? `${s.book_title} · ` : ''}{s.author}
                </p>
              </div>
            ))}
          </div>
        )}
        <p className="text-center mt-6 text-xs tracking-wider" style={{ color: '#b8906a' }}>
          전문은 오늘의 문장을 뽑으면 확인할 수 있어요 ↓
        </p>
      </div>
    </section>
  )
}
