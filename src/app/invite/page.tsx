import type { Metadata } from "next";
import { InviteLanding } from "./InviteLanding";

export const metadata: Metadata = {
  title: "languagebank invite",
  description: "You're invited to learn languages together on languagebank.",
};

/** 초대 링크가 여는 웹 페이지(앱이 없는 사람용). 내용은 브라우저에서 /api/invite로 읽는다. */
export default function InvitePage() {
  return <InviteLanding />;
}
