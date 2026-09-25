import { z } from "zod";
import { MEDIA_INTERESTS } from "./auth";

export const applicationSchema = z.object({
  fullName: z.string().min(3, "To'liq ismni kiriting").max(100),
  regionSlug: z.string().min(1, "Hududni tanlang"),
  experience: z.string().min(20, "Tajribangiz haqida kamida 20 belgi yozing").max(2000),
  specialization: z.array(z.enum(MEDIA_INTERESTS)).min(1, "Kamida bitta yo'nalishni tanlang"),
  portfolioUrl: z.string().url("URL noto'g'ri").optional().or(z.literal("")),
  motivation: z.string().min(30, "Motivatsiyangizni kamida 30 belgida yozing").max(2000),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const CONTENT_TYPES = ["news", "interview", "reportage", "business", "youth"] as const;

export const CONTENT_TYPE_LABELS: Record<(typeof CONTENT_TYPES)[number], string> = {
  news: "Yangilik",
  interview: "Intervyu",
  reportage: "Reportaj",
  business: "Biznes",
  youth: "Yoshlar",
};

export const articleSubmissionSchema = z.object({
  contentType: z.enum(CONTENT_TYPES),
  title: z.string().min(10, "Sarlavha kamida 10 belgi").max(160, "Sarlavha 160 belgidan oshmasin"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug faqat kichik harf, raqam va tire (-) dan iborat bo'lsin"),
  categorySlug: z.string().min(1, "Kategoriyani tanlang"),
  regionSlug: z.string().optional().or(z.literal("")),
  excerpt: z.string().min(40, "Qisqacha mazmun kamida 40 belgi").max(300),
  content: z.string().min(200, "Maqola matni kamida 200 belgi bo'lsin"),
  coverImageId: z.number({ required_error: "Muqova rasmini yuklang" }),
  videoUrl: z.string().url("Video URL noto'g'ri").optional().or(z.literal("")),
  source: z.string().max(200).optional(),
  tags: z.string().max(200).optional(), // vergul bilan ajratilgan, serverda tag'larga aylantiriladi
  authorNotes: z.string().max(500).optional(),
});

export type ArticleSubmissionInput = z.infer<typeof articleSubmissionSchema>;
