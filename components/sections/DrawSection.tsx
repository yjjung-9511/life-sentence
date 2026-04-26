'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  badge?: string
}

export default function DrawSection({ badge }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [concern, setConcern] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, concern }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      router.push(`/result?id=${data.sentence.id}&name=${encodeURIComponent(name)}&remaining=${data.remainingDraws}`)
    } catch {
      setError('오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="px-8 py-20 border-b" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-2xl mx-auto">
        <p className="text-xs tracking-widest mb-3" style={{ color: 'var(--accent-light)' }}>오늘의 인생 문장</p>
        <h2 className="font-hahmlet text-3xl font-light mb-3" style={{ color: 'var(--text)' }}>
          오늘 당신에게 어울리는<br />문장을 받아보세요
        </h2>
        <p className="text-sm font-light leading-loose mb-8" style={{ color: 'var(--text-sub)' }}>
          이름과 요즘의 고민을 남겨주세요. AI가 읽고, 수백 개의 기부된 문장 중<br />
          지금 당신에게 가장 필요한 문장 하나를 건네드립니다.
          {badge && <span className="ml-2 bg-[#c8863a] text-white text-[10px] px-2 py-0.5 rounded-full">{badge}</span>}
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="이름을 알려주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 h-11 rounded text-sm outline-none"
            style={{ background: '#f0e6d0', border: '1px solid #ddd0b0', color: 'var(--text)' }}
          />
          <textarea
            placeholder="요즘 털어버리고 싶은 일, 자꾸 생각나는 후회, 꽉 막힌 것들을 자유롭게 써주세요. 잘 쓰지 않아도 됩니다."
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            required
            rows={4}
            className="px-4 py-3 rounded text-sm outline-none resize-none leading-relaxed"
            style={{ background: '#f0e6d0', border: '1px solid #ddd0b0', color: 'var(--text)' }}
          />
          <p className="text-xs leading-relaxed" style={{ color: '#b0906a' }}>
            🔒 제출된 정보는 외부에 공개되지 않으며, 오직 문장 큐레이션 목적으로만 활용됩니다.
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="font-hahmlet h-12 rounded text-sm tracking-wider transition-opacity disabled:opacity-50"
            style={{ background: 'var(--accent)', color: '#fdf0da' }}
          >
            {loading ? '문장을 찾는 중...' : '✦ 오늘의 문장 받기'}
          </button>
        </form>
      </div>
    </section>
  )
}
