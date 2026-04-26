export default function HeroSection() {
  return (
    <header className="border-b px-8 py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8" style={{ borderColor: 'var(--border)' }}>
      <h1 className="font-hahmlet text-7xl md:text-8xl font-light leading-tight shrink-0" style={{ color: 'var(--text)' }}>
        Life,<br />Sentence
      </h1>
      <div className="md:max-w-sm md:text-right">
        <p className="font-hahmlet font-light text-base leading-loose mb-4" style={{ color: '#5a4228' }}>
          인생의 어느 굴곡에서,<br />
          당신을 버티게 해준 문장이 있었나요.<br /><br />
          누군가는 그 문장 하나로 오늘을 넘겼습니다.<br />
          그리고 그 문장은 지금 여기, 당신을 기다리고 있습니다.
        </p>
        <p className="text-sm font-light leading-loose mb-6" style={{ color: 'var(--text-sub)' }}>
          매일 새로운 문장이 기부됩니다.<br />
          오늘 당신에게 어울리는 문장은 무엇일까요.
        </p>
        <span className="text-xs tracking-widest" style={{ color: 'var(--accent-light)' }}>
          ↓ 아래로 스크롤해 오늘의 문장을 받아보세요
        </span>
      </div>
    </header>
  )
}
