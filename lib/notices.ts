export type Notice = {
  id: string
  title: string
  author: string
  content: string
  createdAt: string
}

const notices: Notice[] = [
  {
    id: '1',
    title: 'MINTIA',
    author: '정일재',
    content: '일본에서 사온 민트인데 GOAT입니다.',
    createdAt: '2026-09-01',
  },
  {
    id: '2',
    title: '컴퓨터 바꾸고 싶다',
    author: '정일재',
    content: '5년쓴 노트북 바꾸고 싶다.',
    createdAt: '2026-09-03',
  },
  {
    id: '3',
    title: '개 피곤하다',
    author: '정일재',
    content: '요즘 할게 좀 많은거같다. 할게 없는거 보단 나은듯하다.',
    createdAt: '2026-09-24',
  },
]

let nextId = 4

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getNotices(): Promise<Notice[]> {
  await delay(600)
  return [...notices].sort((a, b) => (a.id < b.id ? 1 : -1))
}

export async function getNotice(id: string): Promise<Notice | undefined> {
  await delay(400)
  return notices.find((n) => n.id === id)
}

export async function createNotice(input: {
  title: string
  author: string
  content: string
}): Promise<Notice> {
  await delay(300)
  const notice: Notice = {
    id: String(nextId++),
    title: input.title,
    author: input.author,
    content: input.content,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  notices.push(notice)
  return notice
}
