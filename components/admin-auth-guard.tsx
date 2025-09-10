"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface AdminAuthGuardProps {
  children: React.ReactNode
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()

    // Mock authentication state change
    const subscription = setInterval(() => {
      const isAuthenticated = Math.random() > 0.5 // Random mock logic
      setAuthenticated(isAuthenticated)
      if (!isAuthenticated) {
        router.push("/admin/login")
      }
    }, 5000)

    return () => clearInterval(subscription)
  }, [router])

  const checkAuth = async () => {
    // Mock user check
    const user = { id: 1, name: "Admin" } // Replace with real logic later
    if (user) {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
      router.push("/admin/login")
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
