import { NextRequest } from 'next/server'

export function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return false
  return auth.slice(7) === process.env.ADMIN_PASSWORD
}
