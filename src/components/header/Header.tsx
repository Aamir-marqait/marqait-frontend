import { Menu } from "lucide-react";
import SearchBar from "./SearchBar";
import CreditDisplay from "./CreditDisplay";
import NotificationButton from "./NotificationButton";
import UserProfile from "./UserProfile";

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
              <SearchBar />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            <CreditDisplay />
            <NotificationButton />
            <div className="w-px h-10 border-l border-[#CFD2DA]"></div>
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}