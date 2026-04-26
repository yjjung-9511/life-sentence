import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Life, Sentence',
  description: '누군가의 인생을 버티게 해준 문장을 낯선 당신에게 건넵니다.',
  openGraph: {
    title: 'Life, Sentence',
    description: '누군가의 인생을 버티게 해준 문장을 낯선 당신에게 건넵니다.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
