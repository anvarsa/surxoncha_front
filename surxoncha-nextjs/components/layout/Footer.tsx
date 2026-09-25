import Link from "next/link";
import { Camera, Send, Video } from "lucide-react";
import { getSiteSettings } from "@/lib/api/site";
import { getAllRegions } from "@/lib/api/regions";

export async function Footer() {
  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null;
  let regions: Awaited<ReturnType<typeof getAllRegions>>["data"] = [];
  try {
    [settings, { data: regions }] = await Promise.all([getSiteSettings(), getAllRegions()]);
  } catch {
    settings = null;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white mt-20">
      <div className="container py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <p className="text-lg font-extrabold mb-3">
            SURXONCHA<span className="text-secondary">.UZ</span>
          </p>
          <p className="text-sm text-white/70 max-w-xs">
            {settings?.tagline || "Surxondaryoni uning o'z yoshlari hikoya qiladi."}
          </p>
        </div>

        <FooterColumn
          title="Surxoncha"
          links={[
            { label: "Biz haqimizda", href: "/about" },
            { label: "Tahririyat siyosati", href: "/editorial-policy" },
            { label: "Aloqa", href: "/contact" },
          ]}
        />

        <FooterColumn
          title="Jamoa"
          links={[
            { label: "Muxbir bo'lish", href: "/join" },
            { label: "Xabar yuborish", href: "/submit" },
            { label: "Reklama", href: "/contact?subject=advertising" },
          ]}
        />

        <FooterColumn
          title="Hududlar"
          links={regions.slice(0, 6).map((r) => ({ label: r.name, href: `/regions/${r.slug}` }))}
        />
      </div>

      <div className="border-t border-white/15">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
          <p>{settings?.copyrightText || `© ${year} SURXONCHA.UZ. Barcha huquqlar himoyalangan.`}</p>
          <div className="flex items-center gap-3">
            {settings?.telegramUrl && (
              <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                <Send className="h-4 w-4 hover:text-secondary" />
              </a>
            )}
            {settings?.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Camera className="h-4 w-4 hover:text-secondary" />
              </a>
            )}
            {settings?.youtubeUrl && (
              <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Video className="h-4 w-4 hover:text-secondary" />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-secondary mb-3">{title}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-white/70 hover:text-white transition">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
