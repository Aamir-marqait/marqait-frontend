import { Bell } from "lucide-react";

export default function NotificationButton() {
  return (
    <button className="relative p-2 rounded-full text-gray-600 cursor-pointer hover:bg-gray-100 hover:text-gray-800">
      <Bell className="h-6 w-6 text-[#30005E]" />
      <div className="absolute top-1 right-1 w-4 h-4 bg-[#8F00FF] text-[#FFFFFF] text-[9px] font-semibold font-poppins leading-[100%] text-center rounded-full flex items-center justify-center">
        3
      </div>
    </button>
  );
}