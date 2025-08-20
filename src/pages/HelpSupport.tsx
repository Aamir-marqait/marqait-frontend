import { CommunityContact } from "@/components/help-and-support/community-contact";
import Header from "@/components/help-and-support/help-support-header";
import { SupportHero } from "@/components/help-and-support/hero-section";
import { SupportGrid } from "@/components/help-and-support/support-grid";

export default function HelpSupport() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-w-screen">
        <SupportHero />
        <SupportGrid />
        <CommunityContact />
      </div>
    </div>
  );
}
