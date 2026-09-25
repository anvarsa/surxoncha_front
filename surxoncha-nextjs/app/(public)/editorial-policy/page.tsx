import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tahririyat siyosati | SURXONCHA.UZ",
  description: "Surxoncha.uz'ning fakt tekshirish, manba, tuzatish va reklama siyosati.",
};

const SECTIONS = [
  {
    title: "Fakt tekshirish",
    body: "Har bir material nashr etilishidan oldin muharrir tomonidan tekshiriladi: faktlar, raqamlar va iqtiboslar manbasi bilan solishtiriladi. Tasdiqlanmagan ma'lumot 'taxminiy' yoki 'noaniq manba' deb belgilanadi.",
  },
  {
    title: "Manbaga havola",
    body: "Boshqa nashrdan olingan ma'lumot yoki iqtibos har doim manba ko'rsatilgan holda beriladi. Muallif o'z kuzatuvi asosida yozgan material alohida belgilanmaydi.",
  },
  {
    title: "Tuzatish siyosati",
    body: "Nashr qilingan maqolada xatolik topilsa, matn jim tarzda o'zgartirilmaydi. Maqola oxirida tuzatish sanasi va nima o'zgartirilgani ko'rsatiladi.",
  },
  {
    title: "Manfaatlar to'qnashuvi",
    body: "Muallif o'zi yoki yaqin oila a'zosi ishtirok etgan biznes yoki tashkilot haqida yozayotganda buni tahririyatga oldindan ma'lum qilishi shart.",
  },
  {
    title: "Foydalanuvchi materiali",
    body: "Contributor'lar tomonidan yuborilgan har qanday material Editorial Queue orqali tekshiruvdan o'tadi. Tasdiqlanmagan material saytda ko'rinmaydi.",
  },
  {
    title: "Reklama va homiylik",
    body: "Homiylik qilingan (sponsored) material har doim aniq belgi bilan ko'rsatiladi va tahririyat materialidan vizual jihatdan ajratiladi.",
  },
  {
    title: "Maxfiylik",
    body: "Foydalanuvchilarning email, telefon va boshqa shaxsiy ma'lumotlari hech qachon ommaviy profilda ko'rsatilmaydi.",
  },
];

export default function EditorialPolicyPage() {
  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-h2-mobile md:text-h2-desktop font-extrabold mb-8">
        Tahririyat siyosati
      </h1>
      <div className="space-y-7">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="text-base font-bold mb-1.5">{s.title}</h2>
            <p className="text-sm text-muted leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
