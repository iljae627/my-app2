import mongoose from 'mongoose'
import { connectDB } from './mongodb'
import { Notice as NoticeModel } from '@/models/Notice'

// 6주차의 MongoDB 조회 위에, 9주차부터 "누가 썼는가"가 추가됩니다.
// author(자유 입력 텍스트) 대신 authorId/authorName을 저장합니다 — 이 값은
// 사용자가 폼에 입력하는 게 아니라 로그인 세션에서 서버가 채워 넣습니다
// (lib/actions.ts의 createNoticeAction 참고).

export type Notice = {
  id: string
  title: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

// Mongoose 문서를 화면에서 쓰는 평범한 객체(Notice)로 변환합니다.
type NoticeDocLike = {
  _id: unknown
  title: string
  content: string
  author?: string
  authorId?: unknown
  authorName?: string
  createdAt?: Date
}

function toNotice(doc: NoticeDocLike): Notice {
  return {
    id: String(doc._id),
    title: doc.title,
    content: doc.content,
    authorId: doc.authorId ? String(doc.authorId) : '',
    authorName: doc.authorName ?? doc.author ?? '작성자',
    createdAt: (doc.createdAt ?? new Date()).toISOString().slice(0, 10),
  }
}

async function seedIfEmpty() {
  const count = await NoticeModel.countDocuments()
  if (count > 0) return

  const defaultAuthorId = mongoose.Types.ObjectId.createFromHexString('000000000000000000000001')

  await NoticeModel.insertMany([
    {
      title: 'MINTIA',
      author: '정일재',
      authorName: '정일재',
      authorId: defaultAuthorId,
      content: '일본에서 사온 민트인데 GOAT입니다.',
      createdAt: new Date('2026-09-01'),
    },
    {
      title: '컴퓨터 바꾸고 싶다',
      author: '정일재',
      authorName: '정일재',
      authorId: defaultAuthorId,
      content: '5년쓴 노트북 바꾸고 싶다.',
      createdAt: new Date('2026-09-03'),
    },
    {
      title: '개 피곤하다',
      author: '정일재',
      authorName: '정일재',
      authorId: defaultAuthorId,
      content: '요즘 할게 좀 많은거같다. 할게 없는거 보단 나은듯하다.',
      createdAt: new Date('2026-09-24'),
    },
  ])
}

export async function getNotices(): Promise<Notice[]> {
  await connectDB()
  await seedIfEmpty()
  const docs = await NoticeModel.find().sort({ createdAt: -1 }).lean()
  return docs.map((doc) => toNotice(doc as NoticeDocLike))
}

export async function getNotice(id: string): Promise<Notice | undefined> {
  await connectDB()
  try {
    const doc = await NoticeModel.findById(id).lean()
    return doc ? toNotice(doc as NoticeDocLike) : undefined
  } catch {
    // id가 MongoDB ObjectId 형식이 아니면 findById가 에러를 던집니다.
    return undefined
  }
}

export async function createNotice(input: {
  title: string
  content: string
  authorId: string
  authorName: string
}): Promise<Notice> {
  await connectDB()
  const doc = await NoticeModel.create(input)
  return toNotice(doc)
}

// 삭제는 아무나 호출할 수 있는 함수가 아닙니다 — 이 함수 자체는 그냥
// DB에서 지우기만 할 뿐이고, "지울 권한이 있는가"는 반드시 호출하는 쪽
// (lib/actions.ts의 deleteNoticeAction)에서 먼저 확인해야 합니다.
export async function deleteNotice(id: string): Promise<void> {
  await connectDB()
  await NoticeModel.findByIdAndDelete(id)
}
