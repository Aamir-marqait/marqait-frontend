import { useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dashboardIcon from "../assets/nav-icon/dashboard.svg";
import adCampaign from "../assets/nav-icon/AdCampaigns.svg";
import analytics from "../assets/nav-icon/analytics.svg";
import campaignGenrator from "../assets/nav-icon/campaign.svg";
import contentCalender from "../assets/nav-icon/content-calendar.svg";
import contentGenerator from "../assets/nav-icon/content-generator.svg";
import imageEditor from "../assets/nav-icon/image-editor.svg";
import brandBook from "../assets/nav-icon/brand-book.svg";
import strategyGenerator from "../assets/nav-icon/strategy-generator.svg";
import socialPost from "../assets/nav-icon/social-post.svg";
import setting from "../assets/nav-icon/settings.svg";
import fullLogo from "../assets/app-logo/full-logo.png";
import logo from "../assets/app-logo/logo.png";
import coinIcon from "../assets/nav-icon/icon.png";
import { Progress } from "./ui/progress";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: dashboardIcon,
  },
  {
    title: "Strategy generator",
    url: "/strategy",
    icon: strategyGenerator,
  },
  {
    title: "Brand book creator",
    url: "/brand-book",
    icon: brandBook,
  },
  {
    title: "Logo Generator",
    url: "/logo-generator",
    icon: brandBook,
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
    icon: socialPost,
  },
  {
    title: "Post Generator",
    url: "/social-media-post-generator",
    icon: socialPost,
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
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation();
  const { user, userStats } = useAuthStore();
  
  // Calculate credit limit based on subscription
  const getCreditLimit = (subscription: string) => {
    switch (subscription) {
      case 'free': return 1000;
      case 'professional': return 10000;
      case 'enterprise': return 100000;
      default: return 1000;
    }
  };
  
  const creditsSpent = userStats?.total_credits_spent || 17;
  const creditLimit = getCreditLimit(userStats?.current_subscription || 'free');
  const progressPercentage = Math.round((creditsSpent / creditLimit) * 100);
  
  // Filter navigation items based on user plan
  const getFilteredNavigationItems = () => {
    const userPlan = user?.plan || 'free'; // Default to free if no plan
    
    if (userPlan === 'free') {
      // Free users see only Dashboard, Logo Generator, and Social Media Post Generator
      return navigationItems.filter(item => 
        item.url === '/dashboard' || 
        item.url === '/logo-generator' || 
        item.url === '/social-media-post-generator'
      );
    }
    
    // Professional and Enterprise users see all items EXCEPT Logo Generator and Social Media Post Generator
    return navigationItems.filter(item => 
      item.url !== '/logo-generator' && 
      item.url !== '/social-media-post-generator'
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

            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className={`hidden lg:flex items-center cursor-pointer justify-center w-8 h-8  bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-sm ${
                  isCollapsed ? "" : "ml-3"
                }`}
                title={isCollapsed ? "Expand sidebar " : "Collapse sidebar"}
              >
                <ChevronLeft className="h-4 w-4 text-black" />
                <ChevronRight className="h-4 w-4 text-black" />
              </button>
            )}
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
                    ? "bg-gradient-to-r from-[#7000CC] via-[#8000E6] to-[#8E07F8] text-white shadow-sm font-semibold"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                <img
                  src={item.icon}
                  alt={item.title}
                  className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? "brightness-0 invert"
                      : "group-hover:brightness-110"
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate whitespace-nowrap overflow-hidden font-Inter">
                    {item.title}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {!isCollapsed && (
          <div
            className="border-t p-4 bg-white"
            style={{ borderTop: "1px solid #BEBEBE99" }}
          >
            <div className="flex space-x-4">
              <img src={coinIcon} alt="Coin" className="w-9 h-9" />
              <div className="flex-1">
                <div className="flex items-end gap-3 mb-3">
                  <div className="flex-1">
                    <div className="font-Inter font-semibold text-[24px] leading-[100%] text-[#172935]">
                      {creditsSpent}
                      <span className="font-Inter font-normal text-[16px] leading-[100%]">
                        /{creditLimit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="font-Inter font-normal text-[12px] leading-[100%] text-[#172935]">
                    {progressPercentage}%
                  </div>
                </div>
                <div className="mb-4">
                  <Progress value={progressPercentage} className="h-2 bg-[#E6D4FF]" />
                </div>
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
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
