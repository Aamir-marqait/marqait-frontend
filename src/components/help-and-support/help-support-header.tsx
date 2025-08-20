import { Bell, ChevronDown, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import fullLogo from "../../assets/app-logo/full-logo.png";
import { useAuthStore } from "@/stores/authStore";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const userInitial = user?.first_name?.charAt(0)?.toUpperCase() || "A";

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
          <div className="flex items-center space-x-3">
            <button className="relative p-2 rounded-full text-gray-600 cursor-pointer hover:bg-gray-100 hover:text-gray-800">
              <Bell className="h-6 w-6 text-[#30005E]" />
              <div className="absolute top-1 right-1 w-4 h-4 bg-[#8F00FF] text-[#FFFFFF] text-[9px] font-semibold font-poppins leading-[100%] text-center rounded-full flex items-center justify-center">
                3
              </div>
            </button>
            <div className="w-px h-10 border-l border-[#CFD2DA]"></div>
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
                <div className="absolute right-5 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
