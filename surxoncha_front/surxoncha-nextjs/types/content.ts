// SURXONCHA.UZ — Core content types
// Bu fayl Strapi content-type'lariga mos keladi (2-qismda yaratiladi).

export type ArticleStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "revision_requested"
  | "approved"
  | "published"
  | "rejected"
  | "archived";

export type UserRole =
  | "administrator"
  | "editor"
  | "moderator"
  | "contributor"
  | "reporter"
  | "registered_user"
  | "public_visitor";

export type MediaInterest =
  | "journalism"
  | "smm"
  | "mobileography"
  | "photography"
  | "videography"
  | "video_editing"
  | "copywriting"
  | "design"
  | "podcast"
  | "technology";

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogImage?: MediaAsset;
  ogType?: "article" | "website";
  noIndex?: boolean;
}

export interface MediaAsset {
  id: number;
  url: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  mime?: string;
}

export type MediaPlatform = "upload" | "telegram" | "youtube" | "instagram";

export interface HomePhoto {
  id: number;
  title: string;
  slug: string;
  description?: string;
  image: MediaAsset;
  platform: MediaPlatform;
  sourceUrl?: string;
  isStory: boolean;
  featured?: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface HomeVideo {
  id: number;
  title: string;
  slug: string;
  description?: string;
  platform: MediaPlatform;
  sourceUrl: string;
  videoFile?: MediaAsset;
  thumbnail?: MediaAsset;
  featured?: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Region {
  id: number;
  name: string;
  slug: string;
  description?: string;
  coverImage?: MediaAsset;
  featured?: boolean;
  seo?: SEO;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface AuthorProfile {
  id: number;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: MediaAsset;
  region?: Region;
  role: UserRole;
  mediaInterests?: MediaInterest[];
  telegram?: string;
  instagram?: string;
  portfolioUrl?: string;
  joinedAt: string;
  // Never exposed publicly: email, phone, dateOfBirth
}

export interface GalleryImage {
  id: number;
  image: MediaAsset;
  caption?: string;
}

export interface CorrectionNote {
  id: number;
  note: string;
  correctedAt: string;
  editor?: AuthorProfile;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // rich text / markdown
  coverImage: MediaAsset;
  gallery?: GalleryImage[];
  videoUrl?: string;
  category: Category;
  region?: Region;
  author: AuthorProfile;
  tags?: Tag[];
  source?: string;
  status: ArticleStatus;
  contentType: "news" | "interview" | "reportage" | "business" | "youth";
  featured: boolean;
  breaking: boolean;
  sponsored?: boolean;
  readingTime: number; // minutes
  viewCount: number;
  seo: SEO;
  corrections?: CorrectionNote[];
  comments?: ArticleComment[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleComment {
  id: number;
  name: string;
  message: string;
  createdAt: string;
}

export interface ContributorApplication {
  id: number;
  fullName: string;
  region: Region;
  experience: string;
  specialization: MediaInterest[];
  portfolioUrl?: string;
  motivation: string;
  status: "pending" | "approved" | "rejected";
  reviewNote?: string;
  createdAt: string;
}

export interface EditorialAction {
  id: number;
  article: Article;
  editor: AuthorProfile;
  action: "approve" | "reject" | "request_revision" | "publish";
  note?: string;
  createdAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}
