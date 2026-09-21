'use server'

import { revalidatePath } from 'next/cache'
import { likeProduct as likeProductInDb } from '@/lib/products'

export async function likeProductAction(id: string) {
  const newLikes = await likeProductInDb(id)
  revalidatePath(`/products/${id}`) // 다른 탭도 최신값으로
  return newLikes
}
