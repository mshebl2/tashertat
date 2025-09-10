"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Menu, ChevronDown } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import CartDrawer from "@/components/cart-drawer"
import Logo from "@/components/logo"
import { FaInstagram, FaWhatsapp, FaSnapchatGhost, FaTiktok } from "react-icons/fa"
import { FaPinterest } from "react-icons/fa6"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="w-4 h-4 text-white">{children}</span>
)

const createSlug = (name: string): string => {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w-]/g, "")
    .toLowerCase()
}

const normalizeForSlug = (name: string): string => {
  return name
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w-]/g, "")
}

export default function Header() {
  const { state: cartState } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`/api/categories?t=${Date.now()}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        })
        if (response.ok) {
          const categoriesData = await response.json()
          // Use doc.id if id is missing, and always convert to string safely
          const mappedCategories = categoriesData.map((cat: any, idx: number) => ({
            id: (cat.id !== undefined && cat.id !== null) ? String(cat.id) : idx.toString(),
            name: cat.name,
            slug: cat.slug || normalizeForSlug(cat.name),
          }))
          setCategories(mappedCategories)
          console.log("[v0] Categories loaded:", mappedCategories)
        } else {
          throw new Error(`HTTP ${response.status}`)
        }
      } catch (error) {
        console.error("Error loading categories:", error)
        setCategories([])
      }
    }
    loadCategories()
  }, [])

  const handleCategoryClick = () => {
    setIsDropdownOpen(false)
  }

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false)
    setIsMobileProductsOpen(false)
  }

  return (
    <header
      className={`bg-primary text-primary-foreground shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "backdrop-blur-md bg-primary/95 shadow-xl" : "backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2 border-b border-primary-foreground/20">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="https://instagram.com/teeshirtate" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity p-1 min-w-[32px] min-h-[32px] flex items-center justify-center">
              <SocialIcon><FaInstagram /></SocialIcon>
            </Link>
            <Link href="https://snapchat.com/add/teeshirtate" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity p-1 min-w-[32px] min-h-[32px] flex items-center justify-center">
              <SocialIcon><FaSnapchatGhost /></SocialIcon>
            </Link>
            <Link href="https://tiktok.com/@teeshirtate" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity p-1 min-w-[32px] min-h-[32px] flex items-center justify-center">
              <SocialIcon><FaTiktok /></SocialIcon>
            </Link>
            <Link href="https://wa.me/966544089944" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity p-1 min-w-[32px] min-h-[32px] flex items-center justify-center">
              <SocialIcon><FaWhatsapp /></SocialIcon>
            </Link>
            <Link href="https://www.pinterest.com/teeshirtate/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity p-1 min-w-[32px] min-h-[32px] flex items-center justify-center">
              <SocialIcon><FaPinterest /></SocialIcon>
            </Link>
          </div>
          <div className="text-xs sm:text-sm hidden xs:block">{"مرحباً بكم في تيشيرتاتي"}</div>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity font-medium text-sm">
              الرئيسية
            </Link>

            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-primary-foreground/10 font-medium text-sm h-auto p-3 rounded-lg"
                >
                  المنتجات
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-64 bg-background border shadow-xl rounded-lg p-2">
                <div className="mb-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 text-right">
                    الأقسام المميزة
                  </div>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/products"
                      className="text-right w-full py-3 px-3 hover:bg-primary/10 rounded-md transition-colors font-medium text-primary flex items-center justify-between"
                      onClick={handleCategoryClick}
                    >
                      <span>تصفح جميع المنتجات</span>
                      <Badge variant="outline" className="text-xs">
                        الكل
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/custom-design"
                      className="text-right w-full py-3 px-3 hover:bg-primary/10 rounded-md transition-colors font-medium text-primary flex items-center justify-between"
                      onClick={handleCategoryClick}
                    >
                      <span>تصاميم حسب الطلب</span>
                      <Badge variant="secondary" className="text-xs">
                        مخصص
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/offers"
                      className="text-right w-full py-3 px-3 hover:bg-red-50 rounded-md transition-colors font-medium text-red-600 flex items-center justify-between"
                      onClick={handleCategoryClick}
                    >
                      <span>عروض وخصومات</span>
                      <Badge variant="destructive" className="text-xs">
                        خصم
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/new-products"
                      className="text-right w-full py-3 px-3 hover:bg-green-50 rounded-md transition-colors font-medium text-green-600 flex items-center justify-between"
                      onClick={handleCategoryClick}
                    >
                      <span>جديدنا</span>
                      <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                        جديد
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/best-sellers"
                      className="text-right w-full py-3 px-3 hover:bg-orange-50 rounded-md transition-colors font-medium text-orange-600 flex items-center justify-between"
                      onClick={handleCategoryClick}
                    >
                      <span>الأكثر مبيعاً</span>
                      <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">
                        مميز
                      </Badge>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                <div className="mt-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 text-right">جميع الأقسام</div>
                  <div className="grid grid-cols-1 gap-1">
                    {categories.map((category) => (
                      <DropdownMenuItem key={category.id} asChild>
                        <Link
                          href={`/category/${category.slug}`}
                          className="text-right w-full py-2 px-3 hover:bg-muted rounded-md transition-colors text-sm"
                          onClick={handleCategoryClick}
                        >
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className="hover:opacity-80 transition-opacity font-medium text-sm">
              من نحن
            </Link>
            <Link href="/contact" className="hover:opacity-80 transition-opacity font-medium text-sm">
              تواصل معنا
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <CartDrawer>
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-primary-foreground/10 min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartState.itemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartState.itemCount}
                  </Badge>
                )}
              </Button>
            </CartDrawer>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm" className="hover:bg-primary-foreground/10 min-w-[44px] min-h-[44px]">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] sm:w-80 z-[100] bg-background border-l overflow-y-auto"
                aria-describedby="nav-description"
              >
                <SheetTitle className="sr-only">قائمة التنقل الرئيسية</SheetTitle>
                <p id="nav-description" className="sr-only">
                  روابط التنقل الرئيسية للموقع، تتضمن الصفحة الرئيسية والمنتجات والعروض وغيرها
                </p>
                <div className="flex flex-col gap-4 mt-6">
                  <div className="text-right">
                    <h2 className="text-xl font-bold mb-4">القائمة</h2>
                  </div>

                  <Link
                    href="/"
                    className="text-lg hover:text-primary transition-colors py-3 px-2 border-b border-border text-right rounded-md hover:bg-muted"
                    onClick={handleMobileLinkClick}
                  >
                    الرئيسية
                  </Link>

                  <Collapsible open={isMobileProductsOpen} onOpenChange={setIsMobileProductsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className="w-full justify-between text-lg py-3 px-2 border-b border-border text-right rounded-md hover:bg-muted h-auto"
                      >
                        المنتجات
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${isMobileProductsOpen ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-2 mr-4">
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 text-right">
                          الأقسام المميزة
                        </div>
                        <Link
                          href="/products"
                          className="flex items-center justify-between text-primary hover:bg-primary/10 transition-colors py-2 px-3 rounded-md text-right"
                          onClick={handleMobileLinkClick}
                        >
                          <span>تصفح جميع المنتجات</span>
                          <Badge variant="outline" className="text-xs">
                            الكل
                          </Badge>
                        </Link>
                        <Link
                          href="/custom-design"
                          className="flex items-center justify-between text-primary hover:bg-primary/10 transition-colors py-2 px-3 rounded-md text-right"
                          onClick={handleMobileLinkClick}
                        >
                          <span>تصاميم حسب الطلب</span>
                          <Badge variant="secondary" className="text-xs">
                            مخصص
                          </Badge>
                        </Link>
                        <Link
                          href="/offers"
                          className="flex items-center justify-between text-red-600 hover:bg-red-50 transition-colors py-2 px-3 rounded-md text-right"
                          onClick={handleMobileLinkClick}
                        >
                          <span>عروض وخصومات</span>
                          <Badge variant="destructive" className="text-xs">
                            خصم
                          </Badge>
                        </Link>
                        <Link
                          href="/new-products"
                          className="flex items-center justify-between text-green-600 hover:bg-green-50 transition-colors py-2 px-3 rounded-md text-right"
                          onClick={handleMobileLinkClick}
                        >
                          <span>جديدنا</span>
                          <Badge variant="outline" className="text-xs border-green-200 text-green-600">
                            جديد
                          </Badge>
                        </Link>
                        <Link
                          href="/best-sellers"
                          className="flex items-center justify-between text-orange-600 hover:bg-orange-50 transition-colors py-2 px-3 rounded-md text-right"
                          onClick={handleMobileLinkClick}
                        >
                          <span>الأكثر مبيعاً</span>
                          <Badge variant="outline" className="text-xs border-orange-200 text-orange-600">
                            مميز
                          </Badge>
                        </Link>
                      </div>

                      <div className="border-t pt-2 mt-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 text-right">
                          جميع الأقسام
                        </div>
                        {categories.map((category) => (
                          <Link
                            key={category.id}
                            href={`/category/${category.slug}`}
                            className="block text-muted-foreground hover:text-primary hover:bg-muted transition-colors py-2 px-3 rounded-md text-right text-sm"
                            onClick={handleMobileLinkClick}
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  <Link
                    href="/about"
                    className="text-lg hover:text-primary transition-colors py-3 px-2 border-b border-border text-right rounded-md hover:bg-muted"
                    onClick={handleMobileLinkClick}
                  >
                    من نحن
                  </Link>
                  <Link
                    href="/contact"
                    className="text-lg hover:text-primary transition-colors py-3 px-2 border-b border-border text-right rounded-md hover:bg-muted"
                    onClick={handleMobileLinkClick}
                  >
                    تواصل معنا
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
