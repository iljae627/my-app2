import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: '/api/hello에서 응답한 JSON 입니다. - 정일재',
    week: 4,
  })
}
