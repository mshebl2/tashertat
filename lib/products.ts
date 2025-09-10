export interface Product {
  id: number
  name: string
  price: number
  originalPrice: number
  image: string
  category: string
  rating: number
  reviews: number
  description: string
  sizes: string[]
  colors: string[]
  printTypes: string[]
  inStock: boolean
  featured?: boolean
  isNew?: boolean
  isBestSeller?: boolean
  isOnSale?: boolean
  salePercentage?: number
}

export const products: Product[] = [
  {
    id: 1,
    name: "تيشيرت وطني - علم المملكة",
    price: 85,
    originalPrice: 120,
    image: "/saudi-arabia-flag-t-shirt-design.png",
    category: "تصاميم وطنية",
    rating: 4.8,
    reviews: 124,
    description:
      "تيشيرت وطني مميز بتصميم علم المملكة العربية السعودية. مصنوع من أجود أنواع القطن مع طباعة عالية الجودة تدوم طويلاً.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أبيض", "أسود", "أخضر", "كحلي"],
    printTypes: ["طباعة رقمية", "طباعة حريرية", "طباعة فينيل"],
    inStock: true,
    featured: true,
    isBestSeller: true,
  },
  {
    id: 2,
    name: "تيشيرت رياضي - كرة القدم",
    price: 95,
    originalPrice: 130,
    image: "/football-sports-t-shirt-design.png",
    category: "تصاميم قوة ورياضة",
    rating: 4.9,
    reviews: 89,
    description: "تيشيرت رياضي مثالي لمحبي كرة القدم. خامة مريحة وتصميم عصري يناسب جميع الأعمار.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أبيض", "أسود", "أحمر", "أزرق"],
    printTypes: ["طباعة رقمية", "طباعة حريرية"],
    inStock: true,
    isNew: true,
    isOnSale: true,
    salePercentage: 25,
  },
  {
    id: 3,
    name: "تيشيرت أنمي - ناروتو",
    price: 75,
    originalPrice: 110,
    image: "/naruto-anime-t-shirt-design.png",
    category: "تصاميم أنمي",
    rating: 4.7,
    reviews: 156,
    description: "تيشيرت أنمي بتصميم شخصية ناروتو المحبوبة. جودة طباعة ممتازة وألوان زاهية.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أبيض", "أسود", "برتقالي", "أزرق"],
    printTypes: ["طباعة رقمية", "طباعة فينيل"],
    inStock: true,
    featured: true,
    isOnSale: true,
    salePercentage: 15,
  },
  {
    id: 4,
    name: "تيشيرت عصري - تصميم هندسي",
    price: 80,
    originalPrice: 115,
    image: "/modern-geometric-t-shirt-design.png",
    category: "تصاميم عصرية",
    rating: 4.6,
    reviews: 67,
    description: "تيشيرت بتصميم هندسي عصري ومميز. يناسب الإطلالات الكاجوال والعصرية.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أبيض", "أسود", "رمادي", "كحلي"],
    printTypes: ["طباعة رقمية", "طباعة حريرية"],
    inStock: true,
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 5,
    name: "تيشيرت وطني - شعار الرؤية 2030",
    price: 90,
    originalPrice: 125,
    image: "/saudi-patriotic-designs.png",
    category: "تصاميم وطنية",
    rating: 4.9,
    reviews: 203,
    description: "تيشيرت يحمل شعار رؤية المملكة 2030. تصميم أنيق يعبر عن الفخر الوطني.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["أبيض", "أخضر", "كحلي"],
    printTypes: ["طباعة رقمية", "طباعة حريرية", "طباعة فينيل"],
    inStock: true,
    featured: true,
    isBestSeller: true,
    isOnSale: true,
    salePercentage: 20,
  },
  {
    id: 6,
    name: "تيشيرت مناسبات - عيد الفطر",
    price: 70,
    originalPrice: 100,
    image: "/special-occasions-t-shirt-designs.png",
    category: "تصاميم المناسبات",
    rating: 4.5,
    reviews: 78,
    description: "تيشيرت خاص بمناسبة عيد الفطر المبارك. تصميم جميل ومناسب للعائلة.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["أبيض", "ذهبي", "أخضر"],
    printTypes: ["طباعة رقمية", "طباعة فينيل"],
    inStock: true,
    isNew: true,
    isOnSale: true,
    salePercentage: 30,
  },
]

export const categories = [
  {
    name: "تصاميم وطنية",
    image: "/saudi-patriotic-designs.png",
    count: 45,
    description: "تصاميم تعبر عن الفخر والانتماء الوطني",
  },
  {
    name: "تصاميم المناسبات",
    image: "/special-occasions-t-shirt-designs.png",
    count: 32,
    description: "تصاميم خاصة بالمناسبات والأعياد",
  },
  {
    name: "تصاميم قوة ورياضة",
    image: "/sports-and-fitness-t-shirt-designs.png",
    count: 28,
    description: "تصاميم رياضية تحفيزية",
  },
  {
    name: "تصاميم عصرية",
    image: "/modern-trendy-t-shirt-designs.png",
    count: 56,
    description: "تصاميم عصرية تواكب أحدث الصيحات",
  },
  {
    name: "تصاميم أنمي",
    image: "/naruto-anime-t-shirt-design.png",
    count: 42,
    description: "تصاميم شخصيات الأنمي المحبوبة",
  },
  {
    name: "تصاميم أفلام ومسلسلات",
    image: "/modern-geometric-t-shirt-design.png",
    count: 38,
    description: "تصاميم مستوحاة من الأفلام والمسلسلات",
  },
  {
    name: "تصاميم حسب الطلب",
    image: "/custom-t-shirt-printing-showcase.png",
    count: 0,
    description: "ارفع تصميمك الخاص واطبعه على التيشيرت",
  },
]

export function getProductsByCategory(categoryName: string): Product[] {
  return products.filter((product) => product.category === categoryName)
}

export function getProductById(id: number): Product | undefined {
  return products.find((product) => product.id === id)
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery),
  )
}
