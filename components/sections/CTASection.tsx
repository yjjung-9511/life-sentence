'use client'

export default function CTASection() {
  function copyLink() {
    navigator.clipboard.writeText(window.location.origin)
    alert('링크가 복사되었습니다.')
  }

  return (
    <>
      <section className="px-8 py-20" style={{ background: '#3a2e1e' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="font-hahmlet text-2xl font-light leading-relaxed mb-3" style={{ color: '#e8d4a8' }}>
            마음에 닿는 문장이 있었나요?<br />
            오늘 당신에게 어울리는 문장을 직접 받아보세요.
          </h2>
          <p className="text-sm font-light leading-loose mb-10" style={{ color: '#9a8060' }}>
            AI가 지금 당신의 고민을 읽고, 가장 필요한 문장을 골라드립니다.<br />
            혹은 이 공간을 오늘 힘든 누군가에게 먼저 건네보세요.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl p-6" style={{ background: '#2a2010', border: '1px solid #5a4828' }}>
              <p className="text-[10px] tracking-widest mb-2" style={{ color: '#8a7040' }}>오늘의 문장</p>
              <h3 className="font-hahmlet text-lg font-light mb-2" style={{ color: '#e8d4a8' }}>내 문장 받으러 가기</h3>
              <p className="text-xs font-light leading-loose mb-5" style={{ color: '#7a6a4a' }}>
                이름과 고민을 남기면 AI가 지금 당신에게 가장 어울리는 문장을 건네드립니다.
              </p>
              <a href="#draw" className="font-hahmlet flex items-center justify-center h-11 rounded text-sm tracking-wider"
                style={{ background: '#c8863a', color: '#fff8ec' }}>
                ✦ 오늘의 문장 받기
              </a>
            </div>
            <div className="rounded-xl p-6" style={{ background: '#2a2010', border: '1px solid #5a4828' }}>
              <p className="text-[10px] tracking-widest mb-2" style={{ color: '#8a7040' }}>공유하기</p>
              <h3 className="font-hahmlet text-lg font-light mb-2" style={{ color: '#e8d4a8' }}>이 공간을 친구에게</h3>
              <p className="text-xs font-light leading-loose mb-5" style={{ color: '#7a6a4a' }}>
                오늘 힘든 하루를 보내고 있는 누군가에게 이 공간을 먼저 건네보세요.
              </p>
              <button onClick={copyLink} className="w-full h-11 rounded text-sm"
                style={{ background: 'transparent', border: '1px solid #5a4828', color: '#a89060' }}>
                링크 복사하기
              </button>
            </div>
          </div>
        </div>
      </section>
      <footer className="px-8 py-5 flex justify-between items-center text-xs" style={{ background: '#1e160a', color: '#5a4830' }}>
        <span>© 2026 Life, Sentence</span>
        <a href="/admin" className="underline" style={{ color: '#7a6040' }}>관리자 로그인</a>
      </footer>
    </>
  )
}
