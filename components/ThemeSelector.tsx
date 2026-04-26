'use client'
import { Theme, THEMES } from '@/types'

interface Props {
  selected: Theme
  onChange: (theme: Theme) => void
  previewText?: string
}

const LABELS: Record<Theme, string> = { navy: 'NAVY', white: 'WHITE', cream: 'CREAM' }
const THEMES_ORDER: Theme[] = ['navy', 'white', 'cream']

export default function ThemeSelector({ selected, onChange, previewText = '흔들리지 않고 피는 꽃이...' }: Props) {
  return (
    <div className="flex flex-col gap-2">
      {THEMES_ORDER.map((theme) => {
        const t = THEMES[theme]
        const isSelected = selected === theme
        return (
          <button
            key={theme}
            onClick={() => onChange(theme)}
            className="flex items-center justify-between rounded px-4 py-3 transition-all text-sm"
            style={{
              background: t.bg,
              border: isSelected ? `2px solid #c8863a` : `1px solid ${t.meta}44`,
              fontFamily: theme === 'navy' ? "'Hahmlet', serif" : theme === 'cream' ? "'Noto Serif KR', serif" : "'Noto Sans KR', sans-serif",
            }}
          >
            <span style={{ color: t.text, fontWeight: 300 }} className="text-left leading-relaxed truncate max-w-[75%]">
              &ldquo;{previewText}&rdquo;
            </span>
            <span className="text-xs tracking-wider ml-2 shrink-0" style={{ color: t.meta }}>
              {LABELS[theme]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
