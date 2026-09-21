export type Product = {
  id: string
  name: string
  description: string
  likes: number
}

const products: Product[] = [
  {
    id: '1',
    name: '머그컵',
    description: '없음',
    likes: 1,
  },
  {
    id: '2',
    name: '휴대폰',
    description: '아이폰 15',
    likes: 15,
  },
  {
    id: '3',
    name: '연필',
    description: '수능 샤프',
    likes: 24,
  },
  {
    id: '4',
    name: '노트',
    description: '아이패드',
    likes: 30,
  },
  {
    id: '5',
    name: '노트북',
    description: '레노버 리전 노트북',
    likes: 25,
  },
  {
    id: '6',
    name: 'nextjs',
    description: '배우는 중',
    likes: 10,
  },
]

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getProducts(): Promise<Product[]> {
  await delay(700)
  return products
}

export async function getProduct(id: string): Promise<Product | undefined> {
  await delay(400)
  return products.find((p) => p.id === id)
}

export async function likeProduct(id: string): Promise<number> {
  await delay(300)
  const product = products.find((p) => p.id === id)
  if (!product) return 0
  product.likes += 1
  return product.likes
}
