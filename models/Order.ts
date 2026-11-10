import { Schema, model, models } from 'mongoose'

// 주문 시점의 상품명과 가격을 보존합니다.
const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    qty: { type: Number, required: true, min: 1, validate: Number.isSafeInteger },
  },
  { _id: false },
)

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
)

export const Order = models.Order || model('Order', orderSchema)
