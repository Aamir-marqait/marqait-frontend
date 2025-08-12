import { Menu, Bell, UserCircle, Search } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
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
                  className="pl-10 pr-4 py-2 w-80 bg-[#FFFFFF] border border-[#8F00FF] rounded-xl text-sm  placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8F00FF] focus:border-transparent font-inter font-normal leading-[150%]"
                />
              </div>
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800">
              <UserCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
