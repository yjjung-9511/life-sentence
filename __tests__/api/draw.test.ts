/**
 * @jest-environment node
 */
import { getKstMidnight } from '@/app/api/draw/route'

describe('getKstMidnight', () => {
  it('KST 자정을 UTC 기준 ISO 문자열로 반환한다', () => {
    const result = getKstMidnight()
    // KST 00:00 = UTC 전날 15:00
    expect(result.getUTCHours()).toBe(15)
    expect(result.getUTCMinutes()).toBe(0)
    expect(result.getUTCSeconds()).toBe(0)
  })
})
