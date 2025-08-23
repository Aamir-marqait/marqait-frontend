"use client";

import { Button } from "@/components/ui/button";
import { QuickLaunchCard } from "@/components/ui/quick-launch-card";
import { CreateTaskModal } from "@/components/ui/create-task-modal";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import campaignLogo from "../../assets/dashboard/campaign.svg";
import social from "../../assets/dashboard/social.svg";
import blog from "../../assets/dashboard/blog.svg";
import brand from "../../assets/dashboard/brandbook.svg";
import image from "../../assets/dashboard/image.svg";
import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { CalendarWidget } from "@/components/dashboard/calendar-widget";
import { CampaignsTable } from "@/components/dashboard/campaigns-table";
import { AgentActivity } from "@/components/dashboard/agent-activity";

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
  const firstName = user?.first_name || "User";
  const userPlan = user?.plan || "free";

  const handleUpgradeClick = () => {
    navigate("/account/upgrade/credit");
  };

  // Base quick launch items
  const baseQuickLaunchItems = [
    {
      id: "social-post",
      title: "Social Post",
      description: "Generate social media post with one click.",
      iconSrc: social,
      backgroundColor: "#FFF4DE",
      iconBackgroundColor: "#FF947A",
      allowedInFree: true,
    },
    {
      id: "logo-generator",
      title: userPlan === "free" ? "Logo Generator" : "Brand Book",
      description:
        userPlan === "free"
          ? "Create stunning logos."
          : "Develop brand guidelines.",
      iconSrc: brand,
      backgroundColor: "#F3E8FF",
      iconBackgroundColor: "#BF83FF",
      allowedInFree: true,
    },
    {
      id: "campaign",
      title: "Generate Campaign",
      description: "Create a new marketing campaign.",
      iconSrc: campaignLogo,
      backgroundColor: "#FFE2E5",
      iconBackgroundColor: "#FA5A7D",
      allowedInFree: false,
    },
    {
      id: "blog",
      title: "Blog Writer",
      description: "Write engaging blog content.",
      iconSrc: blog,
      backgroundColor: "#DCFCE7",
      iconBackgroundColor: "#3CD856",
      allowedInFree: false,
    },
    {
      id: "image",
      title: "Edit AI Image",
      description: "Create and edit images.",
      iconSrc: image,
      backgroundColor: "#F2DFF7",
      iconBackgroundColor: "#9B59B6",
      allowedInFree: false,
    },
  ];

  // Sort items to put free tier items first
  const quickLaunchItems = baseQuickLaunchItems.sort((a, b) => {
    if (a.allowedInFree && !b.allowedInFree) return -1;
    if (!a.allowedInFree && b.allowedInFree) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="font-[Inter] text-2xl sm:text-3xl lg:text-[33.92px] font-[700] leading-[100%] tracking-[0%] text-gray-900 mb-2">
              Hello {firstName}
              <span className="font-[Inter] text-2xl sm:text-3xl lg:text-[33.92px] font-[700] leading-[100%] tracking-[0%]">
                {" "}
                👋
              </span>
            </h1>
            <p className="font-[Inter] font-[400] text-base sm:text-lg lg:text-[20.49px] leading-[100%] tracking-[0%] text-[#4B4B4B]">
              Ready to create something amazing today?
            </p>
          </div>
          <Button
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="cursor-pointer bg-gradient-to-r from-[#7000CC] via-[#8000E6] to-[#8E07F8] hover:from-[#6000BB] hover:via-[#7000D5] hover:to-[#7D06E7] text-[#FFFFFF] px-4 sm:px-6 py-3 rounded-[8px] font-[Inter] font-[700] text-[14px] leading-[20px] tracking-[0px] text-center shadow-[0px_2px_6px_0px_#7000CC40] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>

        {/* Quick Launch */}
        <div>
          <h2 className="font-[Inter] font-[600] text-lg sm:text-[20px] leading-[100%] tracking-[0%] text-[#161E54] mb-4 sm:mb-6">
            Quick Launch
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {quickLaunchItems.map((item) => {
              const isRestricted = userPlan === "free" && !item.allowedInFree;

              return (
                <QuickLaunchCard
                  key={item.id}
                  title={item.title}
                  description={item.description}
                  iconSrc={item.iconSrc}
                  backgroundColor={item.backgroundColor}
                  iconBackgroundColor={item.iconBackgroundColor}
                  isPremium={isRestricted}
                  upgradeText="Upgrade Premium"
                  onClick={isRestricted ? handleUpgradeClick : undefined}
                />
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
          {/* Top Row - Chart and Calendar */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="xl:col-span-2">
              <EngagementChart />
            </div>
            <div>
              <CalendarWidget />
            </div>
          </div>

          {/* Bottom Row - Campaigns Table and Agent Activity */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
            <div className="xl:col-span-2">
              <CampaignsTable />
            </div>
            <div>
              <AgentActivity />
            </div>
          </div>
        </div>
      </div>

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onOpenChange={setIsCreateTaskModalOpen}
      />
    </div>
  );
}
