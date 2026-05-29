"use client";

import { PremiumProvider } from "@/contexts/PremiumContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <PremiumProvider>{children}</PremiumProvider>;
}
