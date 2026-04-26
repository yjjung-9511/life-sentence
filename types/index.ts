export type Theme = 'navy' | 'white' | 'cream'

export interface Sentence {
  id: string
  text: string
  author: string
  book_title: string | null
  donor_name: string
  donor_email: string
  is_approved: boolean
  gift_count: number
  created_at: string
}

export interface Draw {
  id: string
  ip_address: string
  visitor_name: string
  concern: string
  sentence_id: string
  drawn_at: string
}

export interface DrawRequest {
  name: string
  concern: string
}

export interface DrawResponse {
  sentence: Pick<Sentence, 'id' | 'text' | 'author' | 'book_title'>
  remainingDraws: number
}

export interface DonateRequest {
  text: string
  author: string
  book_title?: string
  donor_name: string
  donor_email: string
}

export const THEMES = {
  navy: {
    bg: '#1c2b4a',
    text: '#c8d8f0',
    meta: '#7a9ac0',
    brand: '#3a5a80',
    font: 'Hahmlet',
  },
  white: {
    bg: '#f4f2ee',
    text: '#2c2c2c',
    meta: '#888078',
    brand: '#b0a898',
    font: 'Noto Sans KR',
  },
  cream: {
    bg: '#fdf6e3',
    text: '#b5470a',
    meta: '#c4692a',
    brand: '#dba878',
    font: 'Noto Serif KR',
  },
} as const
