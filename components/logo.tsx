import Image from "next/image"

export default function Logo({ className = "text-2xl font-bold" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-28 h-10">
        <Image src="/الشعار ابض شفاف.png" alt="شعار تيشيرتاتي" fill className="object-contain" priority />
      </div>
    </div>
  )
}
