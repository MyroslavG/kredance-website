import { cleanService } from "./shared";

type CampaignLinkInput = {
  destination: string;
  source: string;
  medium: string;
  campaign: string;
  content?: string;
};

export function buildCampaignLink(input: CampaignLinkInput): string {
  const target = new URL(input.destination);
  if (
    target.origin !== "https://www.kredance.com" ||
    target.username ||
    target.password
  ) {
    throw new Error("Use a https://www.kredance.com page without login details.");
  }

  const services = target.searchParams.getAll("service");
  const intents = target.searchParams.getAll("intent");
  if (
    services.length > 1 ||
    (services.length === 1 && !cleanService(services[0])) ||
    intents.length > 1 ||
    (intents.length === 1 && intents[0] !== "review")
  ) {
    throw new Error("Use one supported service and, for a website review, intent=review.");
  }
  if (target.hash && !/^#[a-zA-Z0-9_.:-]{1,100}$/.test(target.hash)) {
    throw new Error("Use a page section with letters, numbers, dots, colons, dashes, or underscores.");
  }

  // Retain form context and the section, but discard old tracking and arbitrary data.
  target.search = "";
  if (services.length) target.searchParams.set("service", services[0]);
  if (intents.length) target.searchParams.set("intent", intents[0]);
  for (const key of ["source", "medium", "campaign", "content"] as const) {
    const value = input[key]?.trim() || "";
    if (key === "content" && !value) continue;
    if (!/^[a-zA-Z0-9 _.-]{1,100}$/.test(value)) {
      throw new Error(
        "Use short tracking labels with letters, numbers, spaces, dots, dashes, or underscores.",
      );
    }
    target.searchParams.set(`utm_${key}`, value);
  }
  return target.toString();
}
