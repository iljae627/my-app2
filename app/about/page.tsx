import Link from 'next/link'

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        이 페이지는 app/about/page.tsx입니다.
      </h1>
      <Link href="/" className="text-blue-500 hover:text-blue-700">
        Home으로 이동하기
      </Link>
    </div>
  )
}
