'use client'
import { useState } from 'react'
import { Sentence } from '@/types'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [sentences, setSentences] = useState<Sentence[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin', { headers: { Authorization: `Bearer ${password}` } })
    if (res.ok) {
      const data = await res.json()
      setSentences(data)
      setAuthed(true)
    } else {
      alert('비밀번호가 올바르지 않습니다.')
    }
    setLoading(false)
  }

  async function toggleApprove(id: string, current: boolean) {
    await fetch(`/api/admin/${id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${password}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_approved: !current }),
    })
    setSentences((prev) => prev.map((s) => s.id === id ? { ...s, is_approved: !current } : s))
  }

  async function deleteSentence(id: string) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    await fetch(`/api/admin/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${password}` },
    })
    setSentences((prev) => prev.filter((s) => s.id !== id))
  }

  const filtered = sentences.filter((s) =>
    filter === 'all' ? true : filter === 'approved' ? s.is_approved : !s.is_approved
  )

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <form onSubmit={login} className="flex flex-col gap-3 w-72">
          <h1 className="font-hahmlet text-2xl font-light text-center mb-4" style={{ color: 'var(--text)' }}>관리자 로그인</h1>
          <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}
            className="px-4 h-11 rounded text-sm outline-none" style={{ background: '#f0e6d0', border: '1px solid #ddd0b0' }} />
          <button type="submit" disabled={loading} className="font-hahmlet h-11 rounded text-sm" style={{ background: 'var(--accent)', color: '#fdf0da' }}>
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-hahmlet text-2xl font-light" style={{ color: 'var(--text)' }}>관리자 — Life, Sentence</h1>
          <div className="flex gap-2">
            {(['all', 'pending', 'approved'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1 rounded text-xs"
                style={{ background: filter === f ? 'var(--accent)' : '#f0e6d0', color: filter === f ? '#fdf0da' : 'var(--text-sub)' }}>
                {f === 'all' ? '전체' : f === 'pending' ? '승인 대기' : '승인됨'}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm mb-6" style={{ color: 'var(--text-sub)' }}>총 {filtered.length}개</p>
        <div className="flex flex-col gap-3">
          {filtered.map((s) => (
            <div key={s.id} className="rounded-lg p-5" style={{ background: '#f5ead4', border: '1px solid #e4d0a8' }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light leading-relaxed mb-2" style={{ color: '#3a2810' }}>{s.text}</p>
                  <p className="text-xs italic" style={{ color: '#9a7a50' }}>{s.book_title ? `${s.book_title} · ` : ''}{s.author}</p>
                  <p className="text-xs mt-1" style={{ color: '#b0906a' }}>
                    기부자: {s.donor_name} ({s.donor_email}) · 선물된 횟수: {s.gift_count}회 · {new Date(s.created_at).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleApprove(s.id, s.is_approved)}
                    className="px-3 py-1 rounded text-xs"
                    style={{ background: s.is_approved ? '#e0f0e0' : '#c8863a', color: s.is_approved ? '#2a6a2a' : '#fff' }}>
                    {s.is_approved ? '승인됨' : '승인'}
                  </button>
                  <button onClick={() => deleteSentence(s.id)}
                    className="px-3 py-1 rounded text-xs" style={{ background: '#fee2e2', color: '#dc2626' }}>
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
