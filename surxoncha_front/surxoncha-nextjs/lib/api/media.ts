export interface UploadedAsset {
  id: number;
  url: string;
}

export async function uploadImage(file: File): Promise<UploadedAsset> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Rasm yuklashda xatolik yuz berdi.");
  }
  return res.json();
}
