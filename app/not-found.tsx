import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="text-center px-4 max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            الصفحة غير موجودة
          </h2>
          <p className="text-muted-foreground mb-8">
            عذراً، لم نتمكن من العثور على الصفحة التي تبحث عنها
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full gap-2">
              <Home className="w-4 h-4" />
              العودة للرئيسية
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          
          <Link href="/products">
            <Button variant="outline" className="w-full gap-2">
              تصفح المنتجات
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>أو يمكنك التواصل معنا إذا كنت تعتقد أن هناك خطأ</p>
        </div>
      </div>
    </div>
  )
}
