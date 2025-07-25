"use client";
import { useLocation, Link } from "react-router-dom";
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
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-2">
            <img src={fullLogo} alt="MARQAIT" className="h-8" />
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          ></button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            const Icon = item.icon;

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
                className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {typeof Icon === "string" ? (
                  <img
                    src={Icon}
                    alt={item.title}
                    className={`h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                      isActive
                        ? "brightness-0 invert"
                        : "group-focus:brightness-0 group-focus:invert"
                    }`}
                  />
                ) : (
                  <Icon className="h-5 w-5 flex-shrink-0" />
                )}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
