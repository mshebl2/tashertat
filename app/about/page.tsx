import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, Users, Truck, Shield, Palette, Phone, Mail } from "lucide-react"
import { Counter } from "@/components/counter"

export default function AboutPage() {
  const features = [
    {
      icon: Palette,
      title: "الإبداع",
      description: "نصنع تصميمات تنبض بالحياة",
    },
    {
      icon: Shield,
      title: "الجودة",
      description: "نلتزم بأفضل الخامات وأحدث تقنيات الطباعة",
    },
    {
      icon: Users,
      title: "التفرد",
      description: "كل عميل هو قصة مختلفة",
    },
    {
      icon: Heart,
      title: "العميل أولاً",
      description: "رضاك أساس نجاحنا",
    },
  ]

  const stats = [
    { number: 10000, label: "عميل سعيد", suffix: "+" },
    { number: 50000, label: "قطعة مباعة", suffix: "+" },
    { number: 500, label: "تصميم مختلف", suffix: "+" },
    { number: 99, label: "رضا العملاء", suffix: "%" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            من نحن
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">تيشيرتاتي</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            نحن في متجر تيشيرتاتي (إحدى متاجر مؤسسة إدراج للدعاية والإعلان) نؤمن أن التيشيرت أكثر من مجرد قطعة ملابس، بل
            أسلوب للتعبير عن شخصيتك وصناعة هوية مميزة. نقدم تشكيلة واسعة بتصاميم عصرية وخامات مريحة وجودة طباعة تدوم
            طويلًا، لنكون خيارك الأول دائمًا سواء اخترت من تصاميمنا الجاهزة أو أردت طباعة مخصصة تعكس أفكارك.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">رؤيتنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  أن نكون الوجهة الأولى والأفضل في عالم التيشيرتات المبتكرة التي تجمع بين الجودة، الأسلوب العصري،
                  والتعبير عن الذات.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-4">هدفنا</h2>
                <p className="text-muted-foreground leading-relaxed">
                  نمنحك تيشيرت يحكي قصتك بأسلوبك الخاص مع التزامنا بـ:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li>• خامات مختارة بعناية</li>
                  <li>• جودة طباعة عالية</li>
                  <li>• خدمة عملاء موثوقة وسريعة</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">أرقامنا تتحدث</h2>
            <p className="text-primary-foreground/90">إنجازاتنا التي حققناها بفضل ثقة عملائنا الكرام</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  <Counter end={stat.number} suffix={stat.suffix} duration={2500} />
                </div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">لماذا تختار تيشيرتاتي؟</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نقدم لك تجربة فريدة في عالم التيشيرتات المخصصة
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">قصتنا</h2>
            </div>

            <div className="prose prose-lg max-w-none text-center">
              <p className="text-muted-foreground leading-relaxed mb-6">
                بدأت فكرة "تيشيرتاتي" من شغف حقيقي بالتصميم والإبداع. أردنا أن نخلق مساحة يمكن للجميع من خلالها التعبير
                عن أنفسهم وشخصياتهم من خلال تيشيرتات مميزة وعالية الجودة.
              </p>

              <p className="text-muted-foreground leading-relaxed mb-6">
                منذ انطلاقتنا، ركزنا على تقديم تصاميم تعكس الثقافة العربية والسعودية، بالإضافة إلى التصاميم العصرية التي
                تواكب أحدث الاتجاهات العالمية. نؤمن بأن كل تيشيرت يحكي قصة، وهدفنا أن نساعدك في حكاية قصتك بأفضل طريقة
                ممكنة.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                اليوم، نفخر بخدمة آلاف العملاء في جميع أنحاء المملكة، ونستمر في تطوير منتجاتنا وخدماتنا لنبقى دائماً في
                المقدمة. شكراً لكم على ثقتكم، ونتطلع لأن نكون جزءاً من قصصكم المميزة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">قيمنا الأساسية</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">المبادئ التي نؤمن بها ونعمل من خلالها</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">سياسة الخصوصية</h2>
            </div>

            <Card>
              <CardContent className="p-8">
                <p className="text-muted-foreground leading-relaxed">
                  في تيشيرتاتي نحمي بياناتك الشخصية (الاسم، الجوال، البريد، عناوين الشحن والدفع) ونستخدمها فقط لإتمام
                  طلباتك وتحسين تجربتك، دون مشاركتها مع أي طرف ثالث إلا للشحن والدفع. يمكنك تعديل أو حذف بياناتك متى
                  أردت، ونوفر أنظمة أمان حديثة للحماية.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Shipping & Return Policy */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">سياسة الشحن والاستبدال</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">الشحن</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• تجهيز الطلب خلال 1 – 4 أيام عمل</li>
                    <li>• التوصيل عادة خلال 3 – 10 أيام مع رقم تتبع للطلب</li>
                    <li>• شحن لجميع مدن المملكة برسوم تظهر عند إتمام الطلب</li>
                    <li>• عروض شحن مجاني أحياناً</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">الاستبدال والاسترجاع</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• يمكن الاستبدال أو الاسترجاع خلال 7 أيام</li>
                    <li>• بشرط أن تكون القطعة بحالتها الأصلية</li>
                    <li>• المنتجات المخصصة لا تُسترجع إلا عند وجود عيب تصنيع</li>
                    <li>• إعادة المبلغ خلال 7 – 14 يوم عمل</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-8">تواصل معنا</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6" />
                <span className="text-lg">info@tshirtati.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6" />
                <span className="text-lg">0544089944</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
