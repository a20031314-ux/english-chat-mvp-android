import { notFound } from "next/navigation";
import { isAppBuild } from "@/lib/server/buildTarget";
import { SubscribePage } from "./SubscribeClient";

export default function Subscribe() {
  if (!isAppBuild()) notFound();
  return <SubscribePage />;
}
