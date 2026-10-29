import type { Metadata } from "next";
import { LandingPage } from "@/src/components/landing-page";
const titles: Record<string, string> = {
  "": "Get to know your cycle",
  dashboard: "Overview",
  calendar: "Cycle calendar",
  journal: "Daily journal",
  insights: "My insights",
  settings: "Settings",
  about: "About",
  features: "Features",
  privacy: "Privacy & data",
  contact: "Get in touch",
  welcome: "Find your rhythm",
  login: "Sign in",
  signup: "Create account",
};
export async function generateMetadata({
  params,
}: {
  params: Promise<{ route?: string[] }>;
}): Promise<Metadata> {
  const { route } = await params;
  return { title: titles[(route || []).join("/")] || "In tune with you" };
}
export default async function Page({ params }: { params: Promise<{ route?: string[] }> }) {
  const { route } = await params;
  return !route?.length ? <LandingPage /> : null;
}
