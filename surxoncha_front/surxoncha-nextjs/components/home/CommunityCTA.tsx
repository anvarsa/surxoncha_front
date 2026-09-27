import Link from "next/link";

export function CommunityCTA() {
  return (
    <section className="bg-primary text-white rounded-lg px-6 py-12 sm:px-12 text-center">
      <h2 className="text-h2-mobile md:text-h2-desktop font-extrabold mb-3">
        Siz ham Surxoncha hikoyasini yarating
      </h2>
      <p className="text-white/80 max-w-xl mx-auto mb-7">
        Mahallangizda muhim voqea bo'ldimi? Qiziqarli insonni bilasizmi? Yangi loyiha
        boshladingizmi? Bizga yuboring.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/submit"
          className="rounded bg-white text-primary font-bold px-5 py-2.5 text-sm hover:opacity-90 transition"
        >
          Yangilik yuborish
        </Link>
        <Link
          href="/join"
          className="rounded border border-white/40 text-white font-bold px-5 py-2.5 text-sm hover:bg-white/10 transition"
        >
          Muxbir bo'lish
        </Link>
      </div>
    </section>
  );
}
