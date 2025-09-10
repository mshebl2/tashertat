import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ShoppingCart, Truck, RotateCcw } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">الشروط والأحكام</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدماتنا
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                مقدمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                مرحباً بكم في تيشيرتاتي. باستخدام موقعنا الإلكتروني وخدماتنا، فإنكم توافقون على الالتزام بهذه الشروط
                والأحكام. إذا كنتم لا توافقون على أي من هذه الشروط، يرجى عدم استخدام خدماتنا.
              </p>
            </CardContent>
          </Card>

          {/* Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                الطلبات والدفع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">تأكيد الطلبات:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>جميع الطلبات تحتاج إلى تأكيد من فريقنا</li>
                  <li>نحتفظ بالحق في رفض أي طلب لأسباب فنية أو قانونية</li>
                  <li>الأسعار قابلة للتغيير دون إشعار مسبق</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">الدفع:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>الدفع عند الاستلام أو تحويل بنكي</li>
                  <li>يجب دفع 50% مقدماً للطلبات المخصصة</li>
                  <li>جميع الأسعار تشمل ضريبة القيمة المضافة</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Shipping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                الشحن والتوصيل
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">مدة التوصيل:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>التصاميم الجاهزة: 3-5 أيام عمل</li>
                  <li>التصاميم المخصصة: 7-10 أيام عمل</li>
                  <li>قد تختلف المدة حسب الموقع والكمية</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">رسوم الشحن:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>مجاني للطلبات أكثر من 200 ريال</li>
                  <li>25 ريال داخل الرياض</li>
                  <li>35 ريال لباقي مناطق المملكة</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Returns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                الإرجاع والاستبدال
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">شروط الإرجاع:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>يمكن إرجاع المنتجات خلال 7 أيام من الاستلام</li>
                  <li>يجب أن تكون المنتجات في حالتها الأصلية</li>
                  <li>التصاميم المخصصة غير قابلة للإرجاع إلا في حالة عيب في التصنيع</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">عملية الإرجاع:</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>تواصل معنا عبر الواتساب أو البريد الإلكتروني</li>
                  <li>سنرسل لك تعليمات الإرجاع</li>
                  <li>سيتم استرداد المبلغ خلال 5-7 أيام عمل</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card>
            <CardHeader>
              <CardTitle>الملكية الفكرية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                جميع التصاميم والمحتوى على موقعنا محمية بحقوق الطبع والنشر. العملاء مسؤولون عن ضمان أن التصاميم المرفوعة
                لا تنتهك حقوق الملكية الفكرية للآخرين.
              </p>
              <div>
                <h3 className="font-semibold text-foreground mb-2">التزامات العميل:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>عدم رفع تصاميم محمية بحقوق الطبع والنشر</li>
                  <li>عدم استخدام شعارات أو علامات تجارية بدون إذن</li>
                  <li>تحمل المسؤولية القانونية عن التصاميم المرفوعة</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card>
            <CardHeader>
              <CardTitle>حدود المسؤولية</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground space-y-3">
              <p>
                تيشيرتاتي غير مسؤولة عن أي أضرار غير مباشرة أو عرضية قد تنتج عن استخدام خدماتنا. مسؤوليتنا محدودة بقيمة
                المنتج المشترى.
              </p>
              <p>نبذل قصارى جهدنا لضمان دقة المعلومات على موقعنا، لكننا لا نضمن خلوها من الأخطاء.</p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">تواصل معنا</h3>
              <p className="text-primary-foreground/90 mb-4">لأي استفسارات حول الشروط والأحكام، تواصل معنا:</p>
              <div className="space-y-2 text-sm">
                <p>البريد الإلكتروني: legal@teeshirtate.com</p>
                <p>الواتساب: +966 54 408 9944</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
