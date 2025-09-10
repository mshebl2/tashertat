export interface Category {
  id: string
  name: string // Added name property for consistency
  ar: string
  en: string
  createdAt: Date
}

class CategoriesService {
  private storageKey = "teeshirtate_categories"

  private getDefaultCategories(): Category[] {
    return [
      { id: "1", name: "تصاميم سعودية", ar: "تصاميم سعودية", en: "saudi-designs", createdAt: new Date() },
      { id: "2", name: "رياضة وكرة قدم", ar: "رياضة وكرة قدم", en: "sports-football", createdAt: new Date() },
      { id: "3", name: "أنمي ومانجا", ar: "أنمي ومانجا", en: "anime-manga", createdAt: new Date() },
      { id: "4", name: "تصاميم عصرية", ar: "تصاميم عصرية", en: "modern-designs", createdAt: new Date() },
      { id: "5", name: "مناسبات خاصة", ar: "مناسبات خاصة", en: "special-occasions", createdAt: new Date() },
      { id: "6", name: "رياضة ولياقة", ar: "رياضة ولياقة", en: "sports-fitness", createdAt: new Date() },
    ]
  }

  async getAllCategories(): Promise<Category[]> {
    // Server-side: try to fetch from API first, fallback to defaults
    let baseUrl = ""
    if (typeof window !== "undefined") {
      baseUrl = window.location.origin
    } else {
      baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    }
    try {
      const response = await fetch(`${baseUrl}/api/categories`)
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          return data.map((cat: any) => ({
            id: cat.id || cat._id,
            name: cat.name,
            ar: cat.name,
            en: cat.name_en || cat.name,
            createdAt: new Date(cat.created_at || cat.createdAt),
          }))
        }
      }
    } catch (error) {
      console.log("[v0] API not available, using default categories")
    }
    return this.getDefaultCategories()
  }

  async addCategory(arName: string): Promise<Category> {
    if (typeof window === "undefined") {
      // Server-side: use API
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: arName,
            name_en: arName
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "")
              .toLowerCase(),
          }),
        })

        if (response.ok) {
          const data = await response.json()
          return {
            id: data.id,
            name: data.name,
            ar: data.name,
            en: data.name_en || data.name,
            createdAt: new Date(data.created_at),
          }
        }
      } catch (error) {
        console.error("[v0] Failed to add category to API:", error)
      }
    } else {
      // Client-side: use API
      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: arName,
            name_en: arName
              .replace(/\s+/g, "-")
              .replace(/[^\w-]/g, "")
              .toLowerCase(),
          }),
        })

        if (response.ok) {
          const data = await response.json()
          return {
            id: data.id,
            name: data.name,
            ar: data.name,
            en: data.name_en || data.name,
            createdAt: new Date(data.created_at),
          }
        }
      } catch (error) {
        console.error("[v0] Failed to add category to API:", error)
      }
    }

    // Fallback to localStorage
    const categories = await this.getAllCategories()
    const newCategory: Category = {
      id: Date.now().toString(),
      name: arName,
      ar: arName,
      en: arName
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")
        .toLowerCase(),
      createdAt: new Date(),
    }

    const updatedCategories = [...categories, newCategory]

    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(updatedCategories))
    }

    return newCategory
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (typeof window === "undefined") {
      // Server-side: use API
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/categories?id=${id}`,
          {
            method: "DELETE",
          },
        )

        if (response.ok) {
          return true
        }
      } catch (error) {
        console.error("[v0] Failed to delete category from API:", error)
      }
    } else {
      // Client-side: use API
      try {
        const response = await fetch(`/api/categories?id=${id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          return true
        }
      } catch (error) {
        console.error("[v0] Failed to delete category from API:", error)
      }
    }

    // Fallback to localStorage
    const categories = await this.getAllCategories()
    const filteredCategories = categories.filter((cat) => cat.id !== id)

    if (filteredCategories.length === categories.length) {
      return false // Category not found
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(this.storageKey, JSON.stringify(filteredCategories))
    }
    return true
  }

  async getCategoryByArabicName(arName: string): Promise<Category | undefined> {
    const categories = await this.getAllCategories()
    return categories.find((cat) => cat.ar === arName || cat.name === arName)
  }
}

export const categoriesService = new CategoriesService()
