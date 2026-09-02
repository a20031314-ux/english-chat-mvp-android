import { AppHome } from "@/components/AppHome";
import { LandingPage } from "@/components/LandingPage";
import { isAppBuild } from "@/lib/server/buildTarget";

export default function Home() {
  if (!isAppBuild()) return <LandingPage />;
  return (
    <main className="min-h-screen w-full bg-transparent">
      <AppHome />
    </main>
  );
}
