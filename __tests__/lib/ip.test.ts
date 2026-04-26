import { extractIp } from '@/lib/ip'

// NextRequest의 모킹 버전
class MockNextRequest {
  headers: Map<string, string>

  constructor(url: string, options: { headers: Record<string, string> }) {
    this.headers = new Map(Object.entries(options.headers))
  }

  get(key: string): string | null {
    return this.headers.get(key) ?? null
  }
}

function makeRequest(headers: Record<string, string>) {
  return new MockNextRequest('http://localhost/api/draw', { headers }) as any
}

describe('extractIp', () => {
  it('x-forwarded-for 헤더가 있으면 첫 번째 IP 반환', () => {
    const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' })
    expect(extractIp(req)).toBe('1.2.3.4')
  })

  it('x-real-ip 헤더 폴백', () => {
    const req = makeRequest({ 'x-real-ip': '9.9.9.9' })
    expect(extractIp(req)).toBe('9.9.9.9')
  })

  it('헤더 없으면 unknown 반환', () => {
    const req = makeRequest({})
    expect(extractIp(req)).toBe('unknown')
  })
})
