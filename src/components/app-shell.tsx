"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const WellnessApp = dynamic(() => import("./wellness-app").then((m) => m.WellnessApp));

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return path === "/" ? children : <WellnessApp>{children}</WellnessApp>;
}
