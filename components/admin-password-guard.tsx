"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AdminPasswordService } from "@/lib/admin-password"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, Eye, EyeOff } from "lucide-react"

interface AdminPasswordGuardProps {
  children: React.ReactNode
}

export default function AdminPasswordGuard({ children }: AdminPasswordGuardProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if password is already verified
    const verified = AdminPasswordService.isPasswordVerified()
    setIsVerified(verified)
    setIsLoading(false)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (AdminPasswordService.verifyPassword(password)) {
      setIsVerified(true)
      setPassword("")
    } else {
      setError("كلمة المرور غير صحيحة")
      setPassword("")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">لوحة التحكم الإدارية</CardTitle>
            <p className="text-muted-foreground">يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="admin-password" className="text-sm font-medium">
                  كلمة المرور الإدارية
                </label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    className="pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

              <Button type="submit" className="w-full" disabled={!password.trim()}>
                دخول لوحة التحكم
              </Button>

              <div className="text-xs text-muted-foreground text-center mt-4 p-3 bg-muted/50 rounded-md">
                <strong>للاختبار:</strong> كلمة المرور هي: admin2024
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

export { AdminPasswordGuard }
