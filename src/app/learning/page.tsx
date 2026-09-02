import { notFound } from "next/navigation";
import { isAppBuild } from "@/lib/server/buildTarget";
import { LearningPage } from "./LearningClient";

export default function Learning() {
  if (!isAppBuild()) notFound();
  return <LearningPage />;
}
