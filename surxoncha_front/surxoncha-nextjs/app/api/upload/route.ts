import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

const STRAPI_URL = process.env.STRAPI_URL;

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

// Magic-byte signatures — the real, trustworthy check (never trust the filename or the
// browser-reported Content-Type alone).
const SIGNATURES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: "image/jpeg", bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // "RIFF...."WEBP at byte 8
];

function sniffMime(buffer: Buffer): string | null {
  for (const sig of SIGNATURES) {
    const offset = sig.offset ?? 0;
    const matches = sig.bytes.every((b, i) => buffer[offset + i] === b);
    if (matches) {
      if (sig.mime === "image/webp") {
        const isWebp = buffer.slice(8, 12).toString("ascii") === "WEBP";
        if (!isWebp) continue;
      }
      return sig.mime;
    }
  }
  // AVIF: ftyp box with "avif" brand around byte 4-12
  const ftyp = buffer.slice(4, 8).toString("ascii");
  if (ftyp === "ftyp" && buffer.slice(8, 12).toString("ascii").startsWith("avif")) {
    return "image/avif";
  }
  return null;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Tizimga kiring." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fayl topilmadi." }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Fayl hajmi 8MB dan oshmasligi kerak." },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const realMime = sniffMime(buffer);

  if (!realMime || !ALLOWED_MIME_TYPES.has(realMime)) {
    return NextResponse.json(
      { error: "Faqat JPEG, PNG, WebP yoki AVIF rasm fayllari qabul qilinadi." },
      { status: 400 }
    );
  }

  const uploadForm = new FormData();
  uploadForm.append("files", new Blob([buffer], { type: realMime }), file.name);

  const res = await fetch(`${STRAPI_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${session.strapiJwt}` },
    body: uploadForm,
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Yuklashda xatolik yuz berdi." }, { status: 502 });
  }

  const uploaded = await res.json();
  const asset = uploaded[0];
  return NextResponse.json({ id: asset.id, url: asset.url }, { status: 201 });
}
