import Link from "next/link"
import { Mail, MapPin } from "lucide-react"
import Logo from "@/components/logo"
import { db } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { FaInstagram, FaWhatsapp, FaSnapchatGhost, FaTiktok } from "react-icons/fa"
import { FaPinterest } from "react-icons/fa6"

const SocialIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="w-5 h-5 text-white">{children}</span>
)

export default async function Footer() {
  // Load categories from Firestore (server component)
  let categories: Array<{ id: string; name: string; slug?: string }> = []
  try {
    const categoriesRef = collection(db, "categories")
    const q = query(categoriesRef, orderBy("name"))
    const snap = await getDocs(q)
    categories = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
  } catch (err) {
    // Fail silently and show no categories section
    categories = []
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link href="/">
                <Logo className="text-xl font-bold" />
              </Link>
            </div>
            <p className="text-primary-foreground/80 mb-4 leading-relaxed">
              متجرك المتخصص في التيشيرتات المخصصة عالية الجودة. نقدم تصاميم مبتكرة تعبر عن شخصيتك.
            </p>
            <div className="flex gap-4">
              <Link href="https://instagram.com/teeshirtate" className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <SocialIcon><FaInstagram /></SocialIcon>
              </Link>
              <Link href="https://snapchat.com/add/teeshirtate" className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <SocialIcon><FaSnapchatGhost /></SocialIcon>
              </Link>
              <Link href="https://tiktok.com/@teeshirtate" className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <SocialIcon><FaTiktok /></SocialIcon>
              </Link>
              <Link href="https://wa.me/966544089944" className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <SocialIcon><FaWhatsapp /></SocialIcon>
              </Link>
              <Link href="https://www.pinterest.com/teeshirtate/" className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <SocialIcon><FaPinterest /></SocialIcon>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-design"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  تصاميم حسب الطلب
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories (from Firestore) */}
          {categories.length > 0 && (
            <div>
              <h4 className="font-bold text-lg mb-4">الأقسام</h4>
              <ul className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/category/${encodeURIComponent(category.slug || category.name)}`}
                      className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <SocialIcon><FaWhatsapp /></SocialIcon>
                <a
                  href="https://wa.me/966544089944"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                >
                  +966544089944
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:TeeShirtate@gmail.com"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                >
                  TeeShirtate@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span className="text-primary-foreground/80 text-sm">الرياض مخرج ١٥ شارع الامير سعد بن عبدالرحمن الاول (المية) حي الروابي</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">© 2024 تيشيرتاتي. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
            >
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
