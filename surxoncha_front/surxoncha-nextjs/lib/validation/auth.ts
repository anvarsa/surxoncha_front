import { z } from "zod";

export const MEDIA_INTERESTS = [
  "journalism",
  "smm",
  "mobileography",
  "photography",
  "videography",
  "video_editing",
  "copywriting",
  "design",
  "podcast",
  "technology",
] as const;

export const MEDIA_INTEREST_LABELS: Record<(typeof MEDIA_INTERESTS)[number], string> = {
  journalism: "Jurnalistika",
  smm: "SMM",
  mobileography: "Mobilografiya",
  photography: "Fotografiya",
  videography: "Videografiya",
  video_editing: "Video montaj",
  copywriting: "Copywriting",
  design: "Dizayn",
  podcast: "Podkast",
  technology: "Texnologiya",
};

const usernameRegex = /^[a-z0-9_]{3,24}$/;

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "Ismni to'liq kiriting").max(50),
    lastName: z.string().min(2, "Familiyani to'liq kiriting").max(50),
    username: z
      .string()
      .regex(usernameRegex, "Faqat kichik lotin harflari, raqam va _ (3-24 belgi)"),
    email: z.string().email("Email manzil noto'g'ri"),
    password: z
      .string()
      .min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak")
      .regex(/[A-Z]/, "Kamida bitta katta harf bo'lsin")
      .regex(/[0-9]/, "Kamida bitta raqam bo'lsin"),
    confirmPassword: z.string(),
    regionSlug: z.string().min(1, "Hududni tanlang"),
    mediaInterests: z
      .array(z.enum(MEDIA_INTERESTS))
      .min(1, "Kamida bitta yo'nalishni tanlang"),
    bio: z.string().max(500).optional(),
    telegram: z.string().max(64).optional(),
    instagram: z.string().max(64).optional(),
    portfolioUrl: z.string().url("URL noto'g'ri").optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar mos kelmadi",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(3, "Email yoki username kiriting"),
  password: z.string().min(1, "Parolni kiriting"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email manzil noto'g'ri"),
});

export const resetPasswordSchema = z
  .object({
    code: z.string().min(1),
    password: z.string().min(8, "Parol kamida 8 belgidan iborat bo'lishi kerak"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Parollar mos kelmadi",
    path: ["passwordConfirmation"],
  });
