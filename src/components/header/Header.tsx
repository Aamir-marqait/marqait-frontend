"use client";

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
      <div className="max-w-[85rem] mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Mobile menu button */}
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-1.5 sm:p-2 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="flex items-center ml-2 sm:ml-0 sm:space-x-4">
              <SearchBar />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            <div className="hidden xs:block">
              <CreditDisplay />
            </div>
            <NotificationButton />
            <div className="hidden sm:block w-px h-8 sm:h-10 border-l border-[#CFD2DA]"></div>
            <UserProfile />
          </div>
        </div>
      </div>
    </header>
  );
}
