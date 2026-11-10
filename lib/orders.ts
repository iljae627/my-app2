import { isObjectIdOrHexString } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { decrementStock } from '@/lib/products'
import type { CartLine } from '@/lib/cart'
import { Product } from '@/models/Product'
import { Order as OrderModel } from '@/models/Order'

export type OrderItem = { productId: string; name: string; price: number; qty: number }
export type Order = {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  createdAt: string
}
type OrderDoc = {
  _id: unknown
  userId: unknown
  items: { productId: unknown; name: string; price: number; qty: number }[]
  total: number
  createdAt: Date
}

function toOrder(doc: OrderDoc): Order {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    items: doc.items.map((item) => ({ ...item, productId: String(item.productId) })),
    total: doc.total,
    createdAt: doc.createdAt.toISOString(),
  }
}

export class CheckoutError extends Error {}

// 재고 차감과 주문 저장을 한 트랜잭션으로 처리합니다.
// 어느 상품이든 품절되거나 저장이 실패하면 모든 변경을 되돌립니다.
export async function createOrder(userId: string, lines: CartLine[]): Promise<Order> {
  if (!lines.length) throw new CheckoutError('empty')
  const quantities = new Map<string, number>()
  for (const line of lines) {
    const qty = (quantities.get(line.productId) ?? 0) + line.qty
    if (!isObjectIdOrHexString(line.productId) || !Number.isSafeInteger(line.qty) || line.qty < 1 || !Number.isSafeInteger(qty)) {
      throw new CheckoutError('invalid')
    }
    quantities.set(line.productId, qty)
  }

  const db = await connectDB()
  // 새 컬렉션도 트랜잭션 시작 전에 준비합니다.
  await OrderModel.init()
  return db.connection.transaction(async (session) => {
    const items: OrderItem[] = []
    for (const [productId, qty] of quantities) {
      const product = await Product.findById(productId).session(session).lean<{
        name: string; price: number; stock: number
      } | null>()
      if (!product || product.stock < qty) throw new CheckoutError('stock')
      if (!(await decrementStock(productId, qty, session))) throw new CheckoutError('stock')
      items.push({ productId, qty, name: product.name, price: product.price })
    }
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
    const [doc] = await OrderModel.create([{ userId, items, total }], { session })
    return toOrder(doc.toObject())
  })
}

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  await connectDB()
  const docs = await OrderModel.find({ userId }).sort({ createdAt: -1 }).lean<OrderDoc[]>()
  return docs.map(toOrder)
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!isObjectIdOrHexString(id)) return null
  await connectDB()
  const doc = await OrderModel.findById(id).lean<OrderDoc | null>()
  return doc ? toOrder(doc) : null
}
