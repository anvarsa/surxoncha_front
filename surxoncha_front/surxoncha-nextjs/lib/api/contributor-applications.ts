import { strapiFetch } from "./client";
import type { ContributorApplication } from "@/types/content";

export async function createContributorApplication(
  jwt: string,
  payload: {
    applicantUserId: number;
    fullName: string;
    regionId: number;
    experience: string;
    specialization: string[];
    portfolioUrl?: string;
    motivation: string;
  }
) {
  return strapiFetch<{ data: ContributorApplication }>(`/contributor-applications`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    body: JSON.stringify({
      data: {
        applicant: payload.applicantUserId,
        fullName: payload.fullName,
        region: payload.regionId,
        experience: payload.experience,
        specialization: payload.specialization,
        portfolioUrl: payload.portfolioUrl || undefined,
        motivation: payload.motivation,
        status: "pending",
      },
    }),
  });
}
