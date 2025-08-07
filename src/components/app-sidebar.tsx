import { useLocation, Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
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

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
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

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform bg-[rgba(255,255,255,1)] transition-all duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-[0px_2px_5px_0px_rgba(23,26,31,0.09),0px_0px_2px_0px_rgba(23,26,31,0.12)] ${
          isCollapsed ? "w-16" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full"} relative`}
        style={{
          boxShadow:
            "0px 2px 5px 0px rgba(23, 26, 31, 0.09), 0px 0px 2px 0px rgba(23, 26, 31, 0.12)",
        }}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b border-gray-200 p-6 ${
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
              <div className="w-8 h-8  flex items-center justify-center">
                <img
                  src={logo || "/placeholder.svg"}
                  alt="MARQAIT"
                  className="h-6"
                />
              </div>
            )}

            {/* Collapse/Expand button for desktop */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className={`hidden lg:flex items-center cursor-pointer justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-sm ${
                  isCollapsed ? "" : "ml-3"
                }`}
                title={isCollapsed ? "Expand sidebar " : "Collapse sidebar"}
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center ">
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 space-y-1 ${isCollapsed ? "p-2" : "p-4"}`}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;

            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={() => {
                  // Close mobile sidebar when navigating
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={`group flex items-center rounded-lg text-sm font-medium transition-all duration-200 ${
                  isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3"
                } ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
                title={isCollapsed ? item.title : undefined}
              >
                <img
                  src={item.icon || "/placeholder.svg"}
                  alt={item.title}
                  className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? "brightness-0 invert"
                      : "group-hover:brightness-110"
                  }`}
                />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
