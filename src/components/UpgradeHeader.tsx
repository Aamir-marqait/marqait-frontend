import { ChevronDown, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import fullLogo from "../assets/app-logo/full-logo.png";
import coinIcon from "../assets/nav-icon/icon.png";

export default function UpgradeHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, user, userStats } = useAuthStore();
  
  const userInitial = user?.first_name?.charAt(0)?.toUpperCase() || 'A';
  
  // Calculate credit limit based on subscription
  const getCreditLimit = (subscription: string) => {
    switch (subscription) {
      case 'free': return 1000;
      case 'professional': return 10000;
      case 'enterprise': return 100000;
      default: return 1000;
    }
  };
  
  const creditsSpent = userStats?.total_credits_spent || 55;
  const creditLimit = getCreditLimit(userStats?.current_subscription || 'free');

  const handleLogout = async () => {
    try {
      await logout();
      setIsDropdownOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm z-10 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <img
              src={fullLogo || "/placeholder.svg"}
              alt="MARQAIT"
              className="h-6"
            />
          </div>

          {/* Right side - Credit badge and user avatar */}
          <div className="flex items-center space-x-4">
            {/* Credit badge */}
            <div
              className="flex items-center justify-center space-x-2 bg-[#F4EAFF] rounded-[100px]"
              style={{ width: "117px", height: "44px" }}
            >
              <img src={coinIcon} alt="Coin" className="w-6 h-6" />
              <div className="flex items-center gap-[1px]">
                <span className="font-Inter font-medium text-[14px] leading-[100%] text-gray-700">
                  {creditsSpent}
                </span>
                <span className="font-Inter font-medium text-[12px] leading-[100%] text-gray-700">
                  /
                </span>
                <span className="font-Inter font-medium text-[12px] leading-[100%] text-gray-700">
                  {creditLimit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
              >
                {user?.profile_image_url ? (
                  <img 
                    src={user.profile_image_url} 
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-8 h-8 rounded-[100px] object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[100px] flex items-center justify-center text-white text-sm font-semibold">
                    {userInitial}
                  </div>
                )}
                <ChevronDown
                  className={`h-4 w-4 text-[#151D48] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
