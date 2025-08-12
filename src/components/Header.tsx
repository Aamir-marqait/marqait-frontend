import { Menu, Bell, Search, Command, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          {/* Mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-4 w-4 text-[#8F00FF]" />
                </div>
                <input
                  type="text"
                  placeholder="Search campaigns, content..."
                  className="pl-10 pr-12 py-2 w-80 bg-[#FFFFFF] border border-[#8F00FF] rounded-xl text-sm  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8F00FF] focus:border-transparent font-inter font-normal leading-[150%]"
                />
                <div className="absolute  text-[#8F00FF] right-3 flex flex-row items-center gap-1 top-1/2 transform -translate-y-1/2">
                  <Command className="h-4 w-4" />F
                </div>
              </div>
            </div>
          </div>

          {/* Right side icons */}
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
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[100px] flex items-center justify-center text-white text-sm font-semibold">
                  A
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-[#151D48] transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-5 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      // Add logout logic here
                      setIsDropdownOpen(false);
                    }}
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
