import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { QuickLaunchCard } from "@/components/ui/quick-launch-card";
import { CreateTaskModal } from "@/components/ui/create-task-modal";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowRight,
  Plus,
  Users,
  TrendingUp,
  MousePointer,
  ChevronDown,
  Pin,
  MoreHorizontal,
  Crown,
} from "lucide-react";
import campaignLogo from "../../assets/dashboard/campaign.svg";
import social from "../../assets/dashboard/social.svg";
import blog from "../../assets/dashboard/blog.svg";
import brand from "../../assets/dashboard/brandbook.svg";
import image from "../../assets/dashboard/image.svg";

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-[Inter] text-[33.92px] font-[700] leading-[100%] tracking-[0%] text-gray-900 mb-2">
              Hello {firstName}
              <span className="font-[Inter] text-[33.92px] font-[700] leading-[100%] tracking-[0%]">
                {" "}
                👋
              </span>
            </h1>
            <p className="font-[Inter] font-[400] text-[20.49px] leading-[100%] tracking-[0%] text-[#4B4B4B]">
              Ready to create something amazing today?
            </p>
          </div>
          <Button 
            onClick={() => setIsCreateTaskModalOpen(true)}
            className="cursor-pointer bg-gradient-to-r from-[#7000CC] via-[#8000E6] to-[#8E07F8] hover:from-[#6000BB] hover:via-[#7000D5] hover:to-[#7D06E7] text-[#FFFFFF] px-6 py-3 rounded-[8px] font-[Inter] font-[700] text-[14px] leading-[20px] tracking-[0px] text-center shadow-[0px_2px_6px_0px_#7000CC40]"
          >
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>

        {/* Quick Launch */}
        <div>
          <h2 className="font-[Inter] font-[600] text-[20px] leading-[100%] tracking-[0%] text-[#161E54] mb-6">
            Quick Launch
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {quickLaunchItems.map((item) => {
              const isRestricted = userPlan === "free" && !item.allowedInFree;

              return (
                <div key={item.id} className="relative">
                  <QuickLaunchCard
                    title={item.title}
                    description={item.description}
                    iconSrc={item.iconSrc}
                    backgroundColor={item.backgroundColor}
                    iconBackgroundColor={item.iconBackgroundColor}
                    className={
                      isRestricted ? "blur-sm pointer-events-none" : ""
                    }
                  />
                  {isRestricted && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={handleUpgradeClick}
                        className="bg-gradient-to-r from-[#7000CC] via-[#8000E6] to-[#8E07F8] hover:from-[#6000BB] hover:via-[#7000D5] hover:to-[#7D06E7] text-white px-4 py-2 rounded-lg font-[Inter] font-[600] text-[12px] shadow-[0px_2px_6px_0px_#7000CC40] z-10 cursor-pointer flex items-center gap-2"
                      >
                        <Crown className="w-4 h-4" />
                        Upgrade to Premium
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Campaigns Overview */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Current Campaigns Overview
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  Today, 13 Jun 2025
                  <ChevronDown className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div className="space-y-6">
                {/* Campaign 1 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Summer Product Launch
                      </span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">12.6K</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">8.2%</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">124</div>
                        <div className="text-xs text-gray-500">Conversions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign 2 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Back-To-School Campaign
                      </span>
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        Draft
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">12.6K</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">8.2%</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">124</div>
                        <div className="text-xs text-gray-500">Conversions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign 3 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Summer Product Launch
                      </span>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Scheduled
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">12.6K</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">8.2%</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">124</div>
                        <div className="text-xs text-gray-500">Conversions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign 4 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Summer Product Launch
                      </span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700"
                >
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Agent Activity */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Agent Activity
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  Today, 13 Jun 2025
                  <ChevronDown className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div className="space-y-4">
                {/* Activity 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Campaign Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimized add targeting for summer launch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Just Now</p>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Analytics Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Weekly performance report generated.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">5 Minutes ago</p>
                  </div>
                </div>

                {/* Activity 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Content Creator Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimized add targeting for summer launch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">5 Minutes ago</p>
                  </div>
                </div>

                {/* Activity 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Campaign Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimized add targeting for summer launch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">5 Minutes ago</p>
                  </div>
                </div>

                {/* Activity 5 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Campaign Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimized add targeting for summer launch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">5 Minutes ago</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Sell all activities <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onOpenChange={setIsCreateTaskModalOpen}
      />
    </div>
  );
}
