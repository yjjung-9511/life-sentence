import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/admin-auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const body = await req.json()
  const db = getServiceClient()
  const { error } = await db
    .from('sentences')
    .update({ is_approved: body.is_approved })
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: '업데이트 실패' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const db = getServiceClient()
  const { error } = await db.from('sentences').delete().eq('id', params.id)

  if (error) return NextResponse.json({ error: '삭제 실패' }, { status: 500 })
  return NextResponse.json({ success: true })
}
