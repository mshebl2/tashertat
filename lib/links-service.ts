export interface Link {
  id: string
  title: string
  url: string
  description: string
  category: "social" | "external" | "internal"
  isActive: boolean
  createdAt: Date
}

class LinksService {
  private storageKey = "teeshirtate_links"

  private getLinks(): Link[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : this.getDefaultLinks()
  }

  private saveLinks(links: Link[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(this.storageKey, JSON.stringify(links))
  }

  private getDefaultLinks(): Link[] {
    return [
      {
        id: "1",
        title: "صفحة الفيسبوك",
        url: "https://facebook.com/teeshirtate",
        description: "صفحتنا الرسمية على الفيسبوك",
        category: "social",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "2",
        title: "حساب الإنستغرام",
        url: "https://instagram.com/teeshirtate",
        description: "حسابنا على الإنستغرام",
        category: "social",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "3",
        title: "واتساب للطلبات",
        url: "https://wa.me/966500000000",
        description: "رقم الواتساب للطلبات والاستفسارات",
        category: "social",
        isActive: true,
        createdAt: new Date(),
      },
    ]
  }

  getAllLinks(): Link[] {
    return this.getLinks()
  }

  addLink(linkData: Omit<Link, "id" | "createdAt">): Link {
    const links = this.getLinks()
    const newLink: Link = {
      ...linkData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    links.push(newLink)
    this.saveLinks(links)
    return newLink
  }

  updateLink(id: string, linkData: Partial<Link>): Link | null {
    const links = this.getLinks()
    const index = links.findIndex((link) => link.id === id)
    if (index === -1) return null

    links[index] = { ...links[index], ...linkData }
    this.saveLinks(links)
    return links[index]
  }

  deleteLink(id: string): boolean {
    const links = this.getLinks()
    const filteredLinks = links.filter((link) => link.id !== id)
    if (filteredLinks.length === links.length) return false

    this.saveLinks(filteredLinks)
    return true
  }

  getLinksByCategory(category: Link["category"]): Link[] {
    return this.getLinks().filter((link) => link.category === category)
  }

  getActiveLinks(): Link[] {
    return this.getLinks().filter((link) => link.isActive)
  }
}

export const linksService = new LinksService()
