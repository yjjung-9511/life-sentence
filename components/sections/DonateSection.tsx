'use client'
import { useState, useRef } from 'react'

export default function DonateSection() {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')
  const [bookTitle, setBookTitle] = useState('')
  const [donorName, setDonorName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [ocrLoading, setOcrLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [ocrError, setOcrError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleOcr(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setOcrError('')
    if (file.size > 4 * 1024 * 1024) {
      setOcrError('이미지가 너무 큽니다. 4MB 이하 파일을 올려주세요.')
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    setOcrLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/ocr', { method: 'POST', body: formData })
      const data = await res.json().catch(() => ({ error: '서버 응답 오류' }))
      if (res.ok) {
        if (data.text) setText(data.text)
        else setOcrError('텍스트를 인식하지 못했습니다. 더 선명한 사진으로 시도해주세요.')
      } else {
        setOcrError(data.error || '인식 중 오류가 발생했습니다.')
      }
    } catch {
      setOcrError('네트워크 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setOcrLoading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author, book_title: bookTitle || undefined, donor_name: donorName, donor_email: email }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setSuccess(true)
      setText(''); setAuthor(''); setBookTitle(''); setDonorName(''); setEmail('')
    } catch {
      setError('오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="donate" className="px-8 py-20 border-b" style={{ background: '#fdf3e4', borderColor: 'var(--border)' }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-xs tracking-widest mb-3" style={{ color: 'var(--accent-light)' }}>문장 기부</p>
        <h2 className="font-hahmlet text-3xl font-light mb-3" style={{ color: 'var(--text)' }}>
          당신의 문장을<br />누군가에게 건네주세요
        </h2>
        <p className="text-sm font-light leading-loose mb-10" style={{ color: 'var(--text-sub)' }}>
          어떤 시절, 당신을 또 하루 나아가게 만들었던 문장이 있나요.<br />
          그 문장을 기부해주세요. 당신의 문장이 누군가의 오늘을 버티게 할지도 모릅니다.
        </p>
        {success ? (
          <div className="py-8 text-center">
            <p className="font-hahmlet text-lg font-light" style={{ color: 'var(--text)' }}>문장을 기부해주셔서 감사합니다 ✦</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-sub)' }}>검토 후 문장 풀에 추가됩니다.</p>
            <button className="mt-4 text-sm underline" style={{ color: 'var(--accent-light)' }} onClick={() => setSuccess(false)}>다른 문장 기부하기</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: '#8a6a3a' }}>방법 1. 책 사진으로 기부하기</p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-full h-32 rounded flex flex-col items-center justify-center gap-2 text-sm cursor-pointer"
                style={{ background: '#f0e6d0', border: '2px dashed #c8a870', color: '#9a7a48' }}>
                {ocrLoading ? '인식 중...' : <><span>📷 책 사진을 올려주세요</span><span className="text-xs" style={{ color: '#b8a080' }}>문장을 자동으로 인식합니다</span></>}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleOcr} />
              {ocrError && <p className="text-xs text-red-500 mt-2">{ocrError}</p>}
            </div>
            <div>
              <p className="text-xs font-medium mb-3" style={{ color: '#8a6a3a' }}>방법 2. 직접 입력하기</p>
              <textarea placeholder="기부할 문장을 입력하세요..." value={text} onChange={(e) => setText(e.target.value)} required rows={4}
                className="w-full px-4 py-3 rounded text-sm outline-none resize-none leading-relaxed mb-2"
                style={{ background: '#f0e6d0', border: '1px solid #ddd0b0', color: 'var(--text)' }} />
              {[
                { placeholder: '작가 이름 *', value: author, onChange: setAuthor, required: true },
                { placeholder: '책 제목 (없으면 생략 가능)', value: bookTitle, onChange: setBookTitle, required: false },
                { placeholder: '기부자 이름 *', value: donorName, onChange: setDonorName, required: true },
                { placeholder: '이메일 주소 *', value: email, onChange: setEmail, required: true },
              ].map((f) => (
                <input key={f.placeholder} type={f.placeholder.includes('이메일') ? 'email' : 'text'}
                  placeholder={f.placeholder} value={f.value} onChange={(e) => f.onChange(e.target.value)}
                  required={f.required} className="w-full px-4 h-11 rounded text-sm outline-none mb-2"
                  style={{ background: '#f0e6d0', border: '1px solid #ddd0b0', color: 'var(--text)' }} />
              ))}
              <p className="text-xs leading-relaxed mb-3 px-3 py-2 rounded" style={{ color: '#b0906a', background: '#f5e8cc', borderLeft: '3px solid #c8a060' }}>
                📮 이메일은 외부에 공개되지 않습니다. 당신의 문장이 몇 명에게 선물되었는지 알려드리기 위해서만 사용됩니다.
              </p>
              {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
              <button type="submit" disabled={loading}
                className="font-hahmlet w-full h-12 rounded text-sm tracking-wider disabled:opacity-50"
                style={{ background: 'var(--accent)', color: '#fdf0da' }}>
                {loading ? '저장 중...' : '문장 기부하기'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
