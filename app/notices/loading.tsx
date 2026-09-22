export default function NoticesLoading() {
  return (
    <div className="mx-auto max-w-2xl flex-1 px-8 py-16">
      <div className="mb-8 h-7 w-40 animate-pulse rounded bg-black/[.06] dark:bg-white/[.08]" />
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex h-16 animate-pulse items-center justify-center rounded-lg bg-black/[.04] text-sm text-gray-400 dark:bg-white/[.06] dark:text-gray-500"
          >
            로딩 중...
          </div>
        ))}
      </div>
    </div>
  )
}
