import { connectDB } from './mongodb'
import { Notice as NoticeModel } from '@/models/Notice'

export type Notice = {
  id: string
  title: string
  author: string
  content: string
  createdAt: string
}

type NoticeDocLike = {
  _id: unknown
  title: string
  author: string
  content: string
  createdAt?: Date
}

function toNotice(doc: NoticeDocLike): Notice {
  return {
    id: String(doc._id),
    title: doc.title,
    author: doc.author,
    content: doc.content,
    createdAt: (doc.createdAt ?? new Date()).toISOString().slice(0, 10),
  }
}

async function seedIfEmpty() {
  const count = await NoticeModel.countDocuments()
  if (count > 0) return

  await NoticeModel.insertMany([
    {
      title: 'MINTIA',
      author: '정일재',
      content: '일본에서 사온 민트인데 GOAT입니다.',
      createdAt: new Date('2026-09-01'),
    },
    {
      title: '컴퓨터 바꾸고 싶다',
      author: '정일재',
      content: '5년쓴 노트북 바꾸고 싶다.',
      createdAt: new Date('2026-09-03'),
    },
    {
      title: '개 피곤하다',
      author: '정일재',
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
    return undefined
  }
}

export async function createNotice(input: {
  title: string
  author: string
  content: string
}): Promise<Notice> {
  await connectDB()
  const doc = await NoticeModel.create(input)
  return toNotice(doc)
}
