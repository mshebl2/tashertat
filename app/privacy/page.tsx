import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, UserCheck } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">سياسة الخصوصية</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                مقدمة
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                تحدد هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها عند استخدام موقع تيشيرتاتي. نحن
                ملتزمون بضمان حماية خصوصيتك وأمان بياناتك.
              </p>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                المعلومات التي نجمعها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">المعلومات الشخصية:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>الاسم الكامل</li>
                    <li>عنوان البريد الإلكتروني</li>
                    <li>رقم الهاتف</li>
                    <li>عنوان التوصيل</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">معلومات الطلبات:</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>تفاصيل المنتجات المطلوبة</li>
                    <li>التصاميم المرفوعة</li>
                    <li>تفضيلات الطباعة والألوان</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                كيف نستخدم معلوماتك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  معالجة وتنفيذ طلباتك
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  التواصل معك بخصوص طلباتك
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  تحسين خدماتنا ومنتجاتنا
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  إرسال عروض وتحديثات (بموافقتك)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Protection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                حماية البيانات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  نتخذ إجراءات أمنية صارمة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الكشف أو
                  التدمير.
                </p>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">الإجراءات الأمنية:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>تشفير البيانات أثناء النقل والتخزين</li>
                    <li>وصول محدود للموظفين المخولين فقط</li>
                    <li>مراجعة دورية للأنظمة الأمنية</li>
                    <li>نسخ احتياطية آمنة للبيانات</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rights */}
          <Card>
            <CardHeader>
              <CardTitle>حقوقك</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-muted-foreground">
                <p>لديك الحق في:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>الوصول إلى بياناتك الشخصية</li>
                  <li>تصحيح أو تحديث معلوماتك</li>
                  <li>حذف بياناتك (في ظروف معينة)</li>
                  <li>الاعتراض على معالجة بياناتك</li>
                  <li>نقل بياناتك إلى خدمة أخرى</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">تواصل معنا</h3>
              <p className="text-primary-foreground/90 mb-4">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا:
              </p>
              <div className="space-y-2 text-sm">
                <p>البريد الإلكتروني: privacy@teeshirtate.com</p>
                <p>الواتساب: +966 54 408 9944</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
