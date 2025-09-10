export interface Product {
  id: string
  name: string
  name_en?: string
  price: number
  original_price?: number
  originalPrice?: number
  image: string
  category: string
  category_en?: string
  description: string
  description_en?: string
  sizes?: string[]
  colors?: string[]
  print_types?: string[]
  printTypes?: string[]
  is_featured?: boolean
  is_new?: boolean
  is_best_seller?: boolean
  is_on_sale?: boolean
  sale_percentage?: number
  salePercentage?: number
  rating?: number
  reviews?: number
  notes?: string
  created_at?: string
}

class ProductService {
  private async fetchProducts(_query?: string): Promise<Product[]> {
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] Loading products directly from Firebase...");
    }
    try {
      const { db } = await import('@/lib/firebase')
      const { collection, getDocs, query: firestoreQuery, orderBy, connectFirestoreEmulator } = await import('firebase/firestore')
      
      // Connect to emulator if in development
      if (process.env.NODE_ENV === "development" && process.env.FIRESTORE_EMULATOR_HOST) {
        try {
          connectFirestoreEmulator(db, 'localhost', 8080);
        } catch (err) {
          console.warn("[v0] Could not connect to Firestore emulator:", err);
        }
      }
      
      const productsRef = collection(db, "products")
      const q = firestoreQuery(productsRef, orderBy("created_at", "desc"))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name || "",
          name_en: data.name_en || "",
          price: data.price || 0,
          original_price: data.original_price || 0,
          originalPrice: data.original_price || 0,
          image: data.image || "",
          category: data.category || "",
          category_en: data.category_en || "",
          description: data.description || "",
          description_en: data.description_en || "",
          sizes: data.sizes || [],
          colors: data.colors || [],
          print_types: data.print_types || [],
          printTypes: data.print_types || [],
          is_featured: data.is_featured || false,
          is_new: data.is_new || false,
          is_best_seller: data.is_best_seller || false,
          is_on_sale: data.is_on_sale || false,
          sale_percentage: data.sale_percentage || 0,
          salePercentage: data.sale_percentage || 0,
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          created_at: data.created_at || new Date().toISOString()
        } as Product
      })
    } catch (error) {
      console.error("[v0] Error fetching products:", error)
      return []
    }
  }

  async getAllProducts(): Promise<Product[]> {
    return this.fetchProducts()
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.getAllProducts();
    return products.filter((product) => product.category === category || product.category_en === category)
  }

  async getFeaturedProducts(): Promise<Product[]> {
    try {
      const { db } = await import('@/lib/firebase')
      const { collection, getDocs, query: firestoreQuery, where, connectFirestoreEmulator } = await import('firebase/firestore')

      if (process.env.NODE_ENV === "development" && process.env.FIRESTORE_EMULATOR_HOST) {
        try { connectFirestoreEmulator(db, 'localhost', 8080) } catch {}
      }

      // Try camelCase first: isFeatured
      let q = firestoreQuery(collection(db, 'products'), where('isFeatured', '==', true))
      let snap = await getDocs(q)
      if (snap.empty) {
        // Fallback to snake_case: is_featured
        q = firestoreQuery(collection(db, 'products'), where('is_featured', '==', true))
        snap = await getDocs(q)
      }

      const results = snap.docs.map(doc => {
        const data = doc.data() as any
        return {
          id: doc.id,
          name: data.name || "",
          name_en: data.name_en || "",
          price: data.price || 0,
          original_price: data.original_price || 0,
          originalPrice: data.original_price || 0,
          image: data.image || "",
          category: data.category || "",
          category_en: data.category_en || "",
          description: data.description || "",
          description_en: data.description_en || "",
          sizes: data.sizes || [],
          colors: data.colors || [],
          print_types: data.print_types || [],
          printTypes: data.print_types || [],
          is_featured: (data.isFeatured ?? data.is_featured) || false,
          is_new: (data.isNew ?? data.is_new) || false,
          is_best_seller: (data.isBestSeller ?? data.is_best_seller) || false,
          is_on_sale: (data.isOffer ?? data.is_on_sale) || false,
          sale_percentage: data.sale_percentage || 0,
          salePercentage: data.sale_percentage || 0,
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          created_at: data.created_at || new Date().toISOString(),
        } as Product
      })

      if (process.env.NODE_ENV === "development") {
        console.log(`[v0] Featured products (queried): ${results.length}`)
      }
      return results
    } catch (error) {
      console.warn('[v0] Falling back to filter for getFeaturedProducts due to error:', error)
      const products = await this.getAllProducts();
      const featuredProducts = products.filter((product) => product.is_featured)
      return featuredProducts
    }
  }

  async getNewProducts(): Promise<Product[]> {
    // Prefer querying Firestore directly by boolean flag
    try {
      const { db } = await import('@/lib/firebase')
      const { collection, getDocs, query: firestoreQuery, where, connectFirestoreEmulator } = await import('firebase/firestore')

      if (process.env.NODE_ENV === "development" && process.env.FIRESTORE_EMULATOR_HOST) {
        try { connectFirestoreEmulator(db, 'localhost', 8080) } catch {}
      }

      // Try camelCase field first: isNew
      let q = firestoreQuery(collection(db, 'products'), where('isNew', '==', true))
      let snap = await getDocs(q)
      if (snap.empty) {
        // Fallback to snake_case: is_new
        q = firestoreQuery(collection(db, 'products'), where('is_new', '==', true))
        snap = await getDocs(q)
      }

      const results = snap.docs.map(doc => {
        const data = doc.data() as any
        return {
          id: doc.id,
          name: data.name || "",
          name_en: data.name_en || "",
          price: data.price || 0,
          original_price: data.original_price || 0,
          originalPrice: data.original_price || 0,
          image: data.image || "",
          category: data.category || "",
          category_en: data.category_en || "",
          description: data.description || "",
          description_en: data.description_en || "",
          sizes: data.sizes || [],
          colors: data.colors || [],
          print_types: data.print_types || [],
          printTypes: data.print_types || [],
          is_featured: data.is_featured || false,
          is_new: (data.isNew ?? data.is_new) || false,
          is_best_seller: (data.isBestSeller ?? data.is_best_seller) || false,
          is_on_sale: (data.isOffer ?? data.is_on_sale) || false,
          sale_percentage: data.sale_percentage || 0,
          salePercentage: data.sale_percentage || 0,
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          created_at: data.created_at || new Date().toISOString(),
        } as Product
      })

      if (process.env.NODE_ENV === "development") {
        console.log(`[v0] New products (queried): ${results.length}`)
      }
      return results
    } catch (error) {
      console.warn('[v0] Falling back to filter for getNewProducts due to error:', error)
      const products = await this.getAllProducts();
      const newProducts = products.filter((product) => product.is_new);
      return newProducts;
    }
  }

  async getBestSellerProducts(): Promise<Product[]> {
    try {
      const { db } = await import('@/lib/firebase')
      const { collection, getDocs, query: firestoreQuery, where, connectFirestoreEmulator } = await import('firebase/firestore')

      if (process.env.NODE_ENV === "development" && process.env.FIRESTORE_EMULATOR_HOST) {
        try { connectFirestoreEmulator(db, 'localhost', 8080) } catch {}
      }

      // Try camelCase field first: isBestSeller
      let q = firestoreQuery(collection(db, 'products'), where('isBestSeller', '==', true))
      let snap = await getDocs(q)
      if (snap.empty) {
        // Fallback to snake_case: is_best_seller
        q = firestoreQuery(collection(db, 'products'), where('is_best_seller', '==', true))
        snap = await getDocs(q)
      }

      const results = snap.docs.map(doc => {
        const data = doc.data() as any
        return {
          id: doc.id,
          name: data.name || "",
          name_en: data.name_en || "",
          price: data.price || 0,
          original_price: data.original_price || 0,
          originalPrice: data.original_price || 0,
          image: data.image || "",
          category: data.category || "",
          category_en: data.category_en || "",
          description: data.description || "",
          description_en: data.description_en || "",
          sizes: data.sizes || [],
          colors: data.colors || [],
          print_types: data.print_types || [],
          printTypes: data.print_types || [],
          is_featured: data.is_featured || false,
          is_new: (data.isNew ?? data.is_new) || false,
          is_best_seller: (data.isBestSeller ?? data.is_best_seller) || false,
          is_on_sale: (data.isOffer ?? data.is_on_sale) || false,
          sale_percentage: data.sale_percentage || 0,
          salePercentage: data.sale_percentage || 0,
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          created_at: data.created_at || new Date().toISOString(),
        } as Product
      })

      if (process.env.NODE_ENV === "development") {
        console.log(`[v0] Best seller products (queried): ${results.length}`)
      }
      return results
    } catch (error) {
      console.warn('[v0] Falling back to filter for getBestSellerProducts due to error:', error)
      const products = await this.getAllProducts();
      const bestSellerProducts = products.filter((product) => product.is_best_seller);
      return bestSellerProducts;
    }
  }

  async getSaleProducts(): Promise<Product[]> {
    try {
      const { db } = await import('@/lib/firebase')
      const { collection, getDocs, query: firestoreQuery, where, connectFirestoreEmulator } = await import('firebase/firestore')

      if (process.env.NODE_ENV === "development" && process.env.FIRESTORE_EMULATOR_HOST) {
        try { connectFirestoreEmulator(db, 'localhost', 8080) } catch {}
      }

      // Try camelCase field first: isOffer
      let q = firestoreQuery(collection(db, 'products'), where('isOffer', '==', true))
      let snap = await getDocs(q)
      if (snap.empty) {
        // Fallback to snake_case: is_on_sale
        q = firestoreQuery(collection(db, 'products'), where('is_on_sale', '==', true))
        snap = await getDocs(q)
      }

      const results = snap.docs.map(doc => {
        const data = doc.data() as any
        return {
          id: doc.id,
          name: data.name || "",
          name_en: data.name_en || "",
          price: data.price || 0,
          original_price: data.original_price || 0,
          originalPrice: data.original_price || 0,
          image: data.image || "",
          category: data.category || "",
          category_en: data.category_en || "",
          description: data.description || "",
          description_en: data.description_en || "",
          sizes: data.sizes || [],
          colors: data.colors || [],
          print_types: data.print_types || [],
          printTypes: data.print_types || [],
          is_featured: data.is_featured || false,
          is_new: (data.isNew ?? data.is_new) || false,
          is_best_seller: (data.isBestSeller ?? data.is_best_seller) || false,
          is_on_sale: (data.isOffer ?? data.is_on_sale) || false,
          sale_percentage: data.sale_percentage || 0,
          salePercentage: data.sale_percentage || 0,
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          created_at: data.created_at || new Date().toISOString(),
        } as Product
      })

      if (process.env.NODE_ENV === "development") {
        console.log(`[v0] Sale products (queried): ${results.length}`)
      }
      return results
    } catch (error) {
      console.warn('[v0] Falling back to filter for getSaleProducts due to error:', error)
      const products = await this.getAllProducts();
      const saleProducts = products.filter((product) => product.is_on_sale);
      return saleProducts;
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      if (process.env.NODE_ENV === "development") {
        console.log("[v0] Getting product by ID:", id)
      }
      
      const { db } = await import('@/lib/firebase')
      const { doc, getDoc } = await import('firebase/firestore')
      
      const docRef = doc(db, "products", id)
      const docSnap = await getDoc(docRef)
      
      if (!docSnap.exists()) {
        console.log("[v0] Product not found:", id)
        return null
      }

      const data = docSnap.data()
      return {
        id: docSnap.id,
        name: data.name || "",
        name_en: data.name_en || "",
        price: data.price || 0,
        original_price: data.original_price || 0,
        originalPrice: data.original_price || 0,
        image: data.image || "",
        category: data.category || "",
        category_en: data.category_en || "",
        description: data.description || "",
        description_en: data.description_en || "",
        sizes: data.sizes || [],
        colors: data.colors || [],
        print_types: data.print_types || [],
        printTypes: data.print_types || [],
        is_featured: data.is_featured || false,
        is_new: data.is_new || false,
        is_best_seller: data.is_best_seller || false,
        is_on_sale: data.is_on_sale || false,
        sale_percentage: data.sale_percentage || 0,
        salePercentage: data.sale_percentage || 0,
        rating: data.rating || 0,
        reviews: data.reviews || 0,
        created_at: data.created_at || new Date().toISOString()
      } as Product
    } catch (error) {
      console.error("[v0] Error getting product by ID:", error)
      return null
    }
  }

  async updateProduct(id: string, data: any): Promise<boolean> {
    try {
      const { db } = await import('@/lib/firebase')
      const { doc, updateDoc } = await import('firebase/firestore')

      const mapped: Record<string, unknown> = {
        name: data.name,
        name_en: data.nameEn,
        price: data.price,
        original_price: data.originalPrice ?? null,
        image: data.image,
        category: data.category,
        category_en: data.categoryEn,
        description: data.description,
        description_en: data.descriptionEn,
        sizes: data.sizes,
        colors: data.colors,
        print_types: data.printTypes,
        notes: data.notes,
        is_featured: data.featured ?? data.is_featured,
        is_new: data.isNew ?? data.is_new,
        is_best_seller: data.isBestSeller ?? data.is_best_seller,
        is_on_sale: data.isOnSale ?? data.is_on_sale ?? data.isOffer,
        sale_percentage: data.salePercentage ?? data.sale_percentage ?? null,
      }

      // remove undefined keys
      Object.keys(mapped).forEach((k) => {
        if (mapped[k] === undefined) delete mapped[k]
      })

      await updateDoc(doc(db, 'products', id), mapped)
      return true
    } catch (error) {
      console.error('[v0] Error updating product:', error)
      return false
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const { db } = await import('@/lib/firebase')
      const { doc, deleteDoc } = await import('firebase/firestore')
      await deleteDoc(doc(db, 'products', id))
      return true
    } catch (error) {
      console.error('[v0] Error deleting product:', error)
      return false
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getAllProducts()
    const q = query.toLowerCase()
    return products.filter((p) =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p as any).name_en?.toLowerCase?.().includes(q) ||
      (p as any).description_en?.toLowerCase?.().includes(q) ||
      (p as any).category_en?.toLowerCase?.().includes(q),
    )
  }
}

export const productService = new ProductService();
