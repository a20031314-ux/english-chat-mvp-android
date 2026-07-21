import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Talkbank",
  description: "Privacy Policy for the Talkbank English learning app.",
};

const sections = [
  {
    title: "Introduction",
    body: [
      "Talkbank (“we,” “us,” or “our”) helps users learn English through chat-based practice, corrections, and saved learning materials.",
      "This Privacy Policy explains how we collect, use, and protect information when you use Talkbank on Google Play or the web.",
      "By using Talkbank, you agree to the practices described in this policy.",
    ],
  },
  {
    title: "Information We Collect",
    body: [
      "Depending on how you use Talkbank, we may process:",
      "• Chat messages and learning content you submit so the app can provide corrections and practice feedback.",
      "• App usage information needed for free daily limits and premium features.",
      "• Purchase-related status for premium subscriptions (handled through Google Play Billing / RevenueCat).",
      "• Basic technical information such as device or platform details needed to run the app securely.",
      "Talkbank does not require you to create a username/password account to use the core features.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use information to:",
      "• Provide English chat, corrections, translations, and learning features.",
      "• Enforce free daily usage limits and unlock premium features.",
      "• Improve reliability, security, and user experience.",
      "• Respond to privacy or support requests.",
      "We do not sell personal information.",
    ],
  },
  {
    title: "AI Services",
    body: [
      "User messages may be temporarily processed by AI services (including OpenAI) to generate responses, corrections, and learning suggestions.",
      "This processing is used only to operate Talkbank features. We do not sell your chat content.",
    ],
  },
  {
    title: "In-App Purchases",
    body: [
      "Talkbank offers premium features through Google Play Billing.",
      "Payment details are processed by Google Play. We do not store your full payment card information.",
      "Subscription and entitlement status may be checked through Google Play and related billing services (such as RevenueCat) so premium access works correctly.",
    ],
  },
  {
    title: "Data Security",
    body: [
      "We take reasonable measures to protect information used by Talkbank.",
      "Data transmitted between the app and our servers is sent securely over HTTPS.",
      "No method of transmission or storage is 100% secure, but we work to protect your information against unauthorized access.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "Talkbank may use trusted third-party services to operate the app, including:",
      "• OpenAI — AI response generation",
      "• Google Play Billing — in-app purchases and subscriptions",
      "• RevenueCat — subscription status / entitlements",
      "• Vercel — hosting for web and API services",
      "These providers process information only as needed to provide their services and according to their own privacy policies.",
    ],
  },
  {
    title: "Children's Privacy",
    body: [
      "Talkbank is not directed to children under 13.",
      "We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information, please contact us and we will take appropriate steps.",
    ],
  },
  {
    title: "Changes to this Privacy Policy",
    body: [
      "We may update this Privacy Policy from time to time.",
      "When we make changes, we will update the “Last updated” date on this page. Continued use of Talkbank after changes means you accept the updated policy.",
    ],
  },
  {
    title: "Contact",
    body: [
      "If you have questions about this Privacy Policy or privacy-related requests, contact us:",
      "Email: a20031314@gmail.com",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="text-sm font-medium text-slate-500">Talkbank</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-600">Last updated: July 21, 2026</p>
        </header>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-600">
          <p className="font-medium text-slate-800">Developer: Talkbank</p>
          <p className="mt-1">
            Email:{" "}
            <a
              href="mailto:a20031314@gmail.com"
              className="text-slate-900 underline underline-offset-2 hover:text-slate-700"
            >
              a20031314@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
