import { useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useEffect } from "react";
import { useSidebarStore } from "../stores/sidebarStore";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Lightbulb,
  BookOpen,
  SquareArrowOutUpRight,
} from "lucide-react";

import { useCreditStore } from "../stores/creditStore";
import adCampaign from "../assets/nav-icon/AdCampaigns.svg";
import analytics from "../assets/nav-icon/analytics.svg";
import campaignGenrator from "../assets/nav-icon/campaign.svg";
import contentCalender from "../assets/nav-icon/content-calendar.svg";
import contentGenerator from "../assets/nav-icon/content-generator.svg";
import imageEditor from "../assets/nav-icon/image-editor.svg";
import setting from "../assets/nav-icon/settings.svg";
import fullLogo from "../assets/app-logo/full-logo.png";
import logo from "../assets/app-logo/logo.png";
import coinIcon from "../assets/nav-icon/icon.png";
import supportIcon from "../assets/nav-icon/support.png";
import { Progress } from "./ui/progress";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Strategy generator",
    url: "/strategy",
    icon: "Lightbulb",
  },
  {
    title: "Brand book creator",
    url: "/brand-book",
    icon: "BookOpen",
  },
  {
    title: "Logo Generator",
    url: "/logo-generator",
    icon: "BookOpen",
  },
  {
    title: "Campaign generator",
    url: "/campaign",
    icon: campaignGenrator,
  },
  {
    title: "Content generator",
    url: "/content",
    icon: contentGenerator,
  },
  {
    title: "Social post creator",
    url: "/social-post",
    icon: "SquareArrowOutUpRight",
  },
  {
    title: "Post Generator",
    url: "/social-media-post-generator",
    icon: "SquareArrowOutUpRight",
  },
  {
    title: "Ad campaigns",
    url: "/ad-campaigns",
    icon: adCampaign,
  },
  {
    title: "Image editor",
    url: "/image-editor",
    icon: imageEditor,
  },
  {
    title: "Content calendar",
    url: "/content-calendar",
    icon: contentCalender,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: analytics,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: setting,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const { isCollapsed, toggleCollapsed } = useSidebarStore();
  const location = useLocation();
  const { user, userStats } = useAuthStore();
  const {
    creditsBalance,
    isLoading: isLoadingCredits,
    fetchCreditsBalance,
  } = useCreditStore();

  // Fetch credits balance on mount
  useEffect(() => {
    fetchCreditsBalance();
  }, [fetchCreditsBalance]);

  // Calculate credit limit based on subscription
  const getCreditLimit = (subscription: string) => {
    switch (subscription) {
      case "free":
        return 1000;
      case "professional":
        return 10000;
      case "enterprise":
        return 100000;
      default:
        return 1000;
    }
  };

  const creditLimit = getCreditLimit(userStats?.current_subscription || "free");
  const displayCredits = creditsBalance?.total_available || 0;
  const progressPercentage = Math.round((displayCredits / creditLimit) * 100);

  // Filter navigation items based on user plan
  const getFilteredNavigationItems = () => {
    const userPlan = user?.plan || "free"; // Default to free if no plan

    if (userPlan === "free") {
      // Free users see only Dashboard, Logo Generator, and Social Media Post Generator
      return navigationItems.filter(
        (item) =>
          item.url === "/dashboard" ||
          item.url === "/logo-generator" ||
          item.url === "/social-media-post-generator"
      );
    }

    return navigationItems.filter(
      (item) =>
        item.url !== "/logo-generator" &&
        item.url !== "/social-media-post-generator"
    );
  };

  const filteredNavigationItems = getFilteredNavigationItems();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50  bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`h-screen fixed top-0 left-0 z-50 transform bg-[rgba(255,255,255,1)] transition-all duration-300 ease-in-out shadow-[0px_2px_5px_0px_rgba(23,26,31,0.09),0px_0px_2px_0px_rgba(23,26,31,0.12)] flex flex-col ${
          isCollapsed ? "w-16" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{
          boxShadow:
            "0px 2px 5px 0px rgba(23, 26, 31, 0.09), 0px 0px 2px 0px rgba(23, 26, 31, 0.12)",
          borderRight: "1px solid #BEBEBE99",
        }}
      >
        <div
          className={`flex items-center justify-between border-b border-gray-200 p-4 ${
            isCollapsed ? "px-3" : "px-6"
          }`}
        >
          <div className="flex items-center gap-2">
            {!isCollapsed && (
              <img
                src={fullLogo || "/placeholder.svg"}
                alt="MARQAIT"
                className="h-6"
              />
            )}
            {isCollapsed && (
              <div className="w-7 h-8  flex items-center justify-center">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="MARQAIT"
                  className="h-6"
                />
              </div>
            )}

            <button
              onClick={toggleCollapsed}
              className={`hidden lg:flex items-center cursor-pointer justify-center w-8 h-8  bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-sm ${
                isCollapsed ? "" : "ml-3"
              }`}
              title={isCollapsed ? "Expand sidebar " : "Collapse sidebar"}
            >
              <ChevronLeft className="h-4 w-4 text-black" />
              <ChevronRight className="h-4 w-4 text-black" />
            </button>
          </div>
        </div>

        <nav
          className={`flex-1 space-y-1 overflow-y-auto ${
            isCollapsed ? "p-2" : "p-4"
          } ${!isCollapsed ? "pb-0" : ""}`}
        >
          {filteredNavigationItems.map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`group flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                  isCollapsed ? "justify-center p-3 w-12" : "gap-3 px-4 py-3"
                } ${
                  isActive
                    ? "bg-[#E6D4FF99] text-[#8905F1] shadow-sm font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                {item.icon === "LayoutDashboard" ? (
                  <LayoutDashboard
                    className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-[#8905F1]"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  />
                ) : item.icon === "Lightbulb" ? (
                  <Lightbulb
                    className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-[#8905F1]"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  />
                ) : item.icon === "BookOpen" ? (
                  <BookOpen
                    className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-[#8905F1]"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  />
                ) : item.icon === "SquareArrowOutUpRight" ? (
                  <SquareArrowOutUpRight
                    className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "text-[#8905F1]"
                        : "text-gray-600 group-hover:text-gray-900"
                    }`}
                  />
                ) : (
                  <img
                    src={item.icon}
                    alt={item.title}
                    className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "brightness-0 text-[#8905F1] invert"
                        : "group-hover:brightness-110"
                    }`}
                  />
                )}
                {!isCollapsed && (
                  <span className="truncate whitespace-nowrap overflow-hidden font-Inter">
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="bg-white">
          {/* Help and Support Section */}
          <div className={`${isCollapsed ? "p-2" : "px-4 py-2"} border-b`} style={{ borderBottom: "1px solid #BEBEBE99" }}>
            <Link
              to="/help-support"
              className={`group flex items-center rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 ${
                isCollapsed ? "justify-center p-3 w-12" : "gap-3 p-3"
              }`}
              title={isCollapsed ? "Help and Support" : undefined}
            >
              <img
                src={supportIcon}
                alt="Help and Support"
                className="h-5 w-5 flex-shrink-0 group-hover:brightness-110"
              />
              {!isCollapsed && (
                <span className="font-Inter">Help and Support</span>
              )}
            </Link>
          </div>

          {/* Credits Section - Show coin icon when collapsed, full section when expanded */}
          {isCollapsed ? (
            <div className="p-2">
              <Link 
                to="/account/upgrade/credit"
                className="flex items-center justify-center p-3 w-12 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
                title="Upgrade Credits"
              >
                <img src={coinIcon} alt="Credits" className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex space-x-4">
                {isLoadingCredits ? (
                  <div className="w-9 h-9 bg-gray-200 rounded-full animate-pulse"></div>
                ) : (
                  <img src={coinIcon} alt="Coin" className="w-9 h-9" />
                )}
                <div className="flex-1">
                  <div className="flex items-end gap-3 mb-3">
                    <div className="flex-1">
                      {isLoadingCredits ? (
                        <div className="flex items-center gap-1">
                          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      ) : (
                        <div className="font-Inter font-semibold text-[20px] leading-[100%] text-[#172935]">
                          {displayCredits}
                          <span className="font-Inter font-normal text-[13px] leading-[100%]">
                            /{creditLimit.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="font-Inter font-normal text-[12px] leading-[100%] text-[#172935]">
                      {isLoadingCredits ? (
                        <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                      ) : (
                        `${progressPercentage}%`
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    {isLoadingCredits ? (
                      <div className="h-2 w-full bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <Progress
                        value={progressPercentage}
                        className="h-2 bg-[#E6D4FF]"
                      />
                    )}
                  </div>
                  {isLoadingCredits ? (
                    <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                  ) : (
                    <Link to="/account/upgrade/credit">
                      <button
                        className="cursor-pointer h-8 px-3 py-1 rounded-lg border border-[#7F56D9] font-Inter font-semibold text-[14px] leading-[24px] text-white transition-all duration-200 hover:shadow-lg flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(180deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)",
                          boxShadow: "0px 1px 2px 0px rgba(10, 13, 18, 0.05)",
                        }}
                      >
                        Upgrade
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
