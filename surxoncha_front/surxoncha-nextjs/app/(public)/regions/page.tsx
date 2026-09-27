import type { Metadata } from "next";
import { getAllRegions } from "@/lib/api/regions";
import { RegionCard } from "@/components/region/RegionCard";
import { EmptyState } from "@/components/common/EmptyState";

export const metadata: Metadata = {
  title: "Hududlar | SURXONCHA.UZ",
  description: "Surxondaryo viloyati tumanlari bo'yicha yangiliklar.",
};

export const revalidate = 3600;

export default async function RegionsPage() {
  const { data: regions } = await getAllRegions();

  return (
    <div className="container py-8">
      <h1 className="text-h2-mobile md:text-h2-desktop font-extrabold mb-1">Hududlar</h1>
      <p className="text-muted mb-8">Surxondaryo viloyati tumanlari bo'yicha yangiliklar.</p>

      {regions.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {regions.map((r) => (
            <RegionCard key={r.slug} region={r} />
          ))}
        </div>
      ) : (
        <EmptyState title="Hududlar ro'yxati topilmadi." />
      )}
    </div>
  );
}
