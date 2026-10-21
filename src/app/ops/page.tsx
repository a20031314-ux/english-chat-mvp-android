import type { Metadata } from "next";
import { OpsInbox } from "./OpsInbox";

export const metadata: Metadata = {
  title: "신고함 | languagebank 운영",
  robots: { index: false, follow: false },
};

/**
 * 운영자 신고함: 사람이 보낸 신고와 AI 영상 검사가 남긴 것을 한곳에서 보고, 정지·해제를 누른다.
 * 웹 서버에서만(앱 빌드에서는 빠짐, scripts/build-capacitor.mjs). 키 없이는 아무것도 보이지 않는다.
 */
export default function OpsPage() {
  return <OpsInbox />;
}
