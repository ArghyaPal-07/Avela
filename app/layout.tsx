import type { Metadata } from "next";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/400-italic.css";
import "./globals.css";
import { WellnessApp } from "@/components/wellness-app";
export const metadata: Metadata = {
  title: { default: "Avela — In tune with you", template: "%s | Avela" },
  description:
    "A gentler way to understand your cycle. Track your flow, feelings, and body with Avela.",
  robots: { index: false, follow: false },
};
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <WellnessApp>{children}</WellnessApp>
      </body>
    </html>
  );
}
