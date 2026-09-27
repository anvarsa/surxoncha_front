import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Biz haqimizda | SURXONCHA.UZ",
  description: "Surxoncha.uz nima, nega yaratildi va qanday ishlaydi.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-2xl py-12 space-y-8">
      <div>
        <h1 className="text-h2-mobile md:text-h2-desktop font-extrabold mb-3">
          Surxoncha nima?
        </h1>
        <p className="text-muted">
          Surxoncha.uz — Surxondaryo viloyati bo'yicha yangiliklar, intervyular va
          reportajlarni to'playdigan mintaqaviy media platforma. Uni professional
          jurnalistlar emas, balki viloyatning o'zidan chiqqan yoshlar yozadi —
          shu sababli har bir material joyning haqiqiy hayotini aks ettiradi.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Nega yaratildi</h2>
        <p className="text-muted">
          Katta shaharlardagi milliy nashrlar Surxondaryodagi voqealarga kam
          e'tibor beradi. Surxoncha shu bo'shliqni to'ldirish uchun — tumanlardagi
          voqealar, odamlar va g'oyalarni ko'rinadigan qilish uchun tashkil etildi.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Missiya</h2>
        <p className="text-muted">
          Har bir tumanning o'z ovoziga ega bo'lishi, yoshlarning media sohasida
          real tajriba olishi va Surxondaryo haqidagi voqealarning ishonchli,
          tekshirilgan manbadan yetib borishi.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Tahririyat tamoyillari</h2>
        <p className="text-muted">
          Har bir maqola nashr qilinishidan oldin tahririyat tekshiruvidan o'tadi.
          To'liq qoidalar{" "}
          <Link href="/editorial-policy" className="text-primary underline">
            Tahririyat siyosati
          </Link>{" "}
          sahifasida.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Muxbir bo'lish</h2>
        <p className="text-muted mb-3">
          Jurnalistika, fotografiya, videografiya, dizayn yoki SMM bilan
          shug'ullanasizmi? Surxondaryoning istalgan tumanidan bo'lishingiz
          mumkin.
        </p>
        <Link href="/join" className="text-primary font-semibold hover:underline">
          Jamoaga qo'shilish →
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-2">Aloqa</h2>
        <p className="text-muted">
          Savol yoki taklifingiz bormi?{" "}
          <Link href="/contact" className="text-primary underline">
            Bizga yozing
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
