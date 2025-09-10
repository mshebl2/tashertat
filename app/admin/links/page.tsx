"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Trash2, Edit, Plus, ExternalLink } from "lucide-react"
import { linksService, type Link } from "@/lib/links-service"
import AdminPasswordGuard from "@/components/admin-password-guard"
import AdminLayout from "@/components/admin-layout"

export default function AdminLinksPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<Link | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
    category: "external" as Link["category"],
    isActive: true,
  })

  useEffect(() => {
    loadLinks()
  }, [])

  const loadLinks = () => {
    setLinks(linksService.getAllLinks())
  }

  const resetForm = () => {
    setFormData({
      title: "",
      url: "",
      description: "",
      category: "external",
      isActive: true,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingLink) {
      linksService.updateLink(editingLink.id, formData)
      setEditingLink(null)
    } else {
      linksService.addLink(formData)
      setIsAddDialogOpen(false)
    }

    resetForm()
    loadLinks()
  }

  const handleEdit = (link: Link) => {
    setEditingLink(link)
    setFormData({
      title: link.title,
      url: link.url,
      description: link.description,
      category: link.category,
      isActive: link.isActive,
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الرابط؟")) {
      linksService.deleteLink(id)
      loadLinks()
    }
  }

  const toggleLinkStatus = (id: string, isActive: boolean) => {
    linksService.updateLink(id, { isActive })
    loadLinks()
  }

  const getCategoryBadge = (category: Link["category"]) => {
    const badges = {
      social: { text: "وسائل التواصل", className: "bg-blue-500 hover:bg-blue-600" },
      external: { text: "رابط خارجي", className: "bg-green-500 hover:bg-green-600" },
      internal: { text: "رابط داخلي", className: "bg-purple-500 hover:bg-purple-600" },
    }
    return badges[category]
  }

  const LinkForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">عنوان الرابط</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="url">الرابط</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          required
          placeholder="https://example.com"
        />
      </div>

      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">نوع الرابط</Label>
        <Select
          value={formData.category}
          onValueChange={(value: Link["category"]) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر نوع الرابط" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="social">وسائل التواصل</SelectItem>
            <SelectItem value="external">رابط خارجي</SelectItem>
            <SelectItem value="internal">رابط داخلي</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">الرابط نشط</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsAddDialogOpen(false)
            setEditingLink(null)
            resetForm()
          }}
        >
          إلغاء
        </Button>
        <Button type="submit">{editingLink ? "تحديث الرابط" : "إضافة الرابط"}</Button>
      </div>
    </form>
  )

  return (
    <AdminPasswordGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">إدارة الروابط</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة رابط جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>إضافة رابط جديد</DialogTitle>
                  <DialogDescription>
                    إضافة رابط جديد إلى الموقع وتحديد تفاصيله مثل العنوان والوصف والفئة
                  </DialogDescription>
                </DialogHeader>
                <LinkForm />
              </DialogContent>
            </Dialog>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {links.map((link) => (
              <Card key={link.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{link.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(link)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(link.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm truncate flex-1"
                      >
                        {link.url}
                      </a>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getCategoryBadge(link.category).className}>
                        {getCategoryBadge(link.category).text}
                      </Badge>

                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={link.isActive}
                          onCheckedChange={(checked) => toggleLinkStatus(link.id, checked)}
                          size="sm"
                        />
                        <span className="text-sm text-gray-600">{link.isActive ? "نشط" : "غير نشط"}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      تم الإنشاء: {new Date(link.createdAt).toLocaleDateString("ar-SA")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {links.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد روابط</p>
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>تعديل الرابط</DialogTitle>
              </DialogHeader>
              <LinkForm />
            </DialogContent>
          </Dialog>
        </div>
      </AdminLayout>
    </AdminPasswordGuard>
  )
}
