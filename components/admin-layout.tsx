"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, ShoppingCart, Users, Menu, LogOut, Home, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "لوحة التحكم",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "إدارة المنتجات",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "إدارة الطلبات",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "إدارة العملاء",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "إدارة الروابط",
    href: "/admin/links",
    icon: ExternalLink,
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()
  const pathname = usePathname()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary">لوحة التحكم</h2>
        <p className="text-sm text-muted-foreground">تيشيرتاتي</p>
      </div>

      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {item.title}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Home className="w-4 h-4 ml-2" />
              العودة للمتجر
            </Button>
          </Link>
          <Button variant="outline" className="w-full justify-start bg-transparent" onClick={logout}>
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:right-0 lg:z-50 lg:w-72 lg:overflow-y-auto lg:bg-card lg:border-l">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent 
          side="right" 
          className="w-72 p-0"
          aria-describedby="admin-menu-description"
        >
          <SheetTitle className="sr-only">قائمة لوحة التحكم</SheetTitle>
          <p id="admin-menu-description" className="sr-only">
            قائمة الوصول السريع لوظائف لوحة التحكم مثل إدارة المنتجات والطلبات والروابط
          </p>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pr-72">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-background border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">إدارة المتجر</h1>
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="sm">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
