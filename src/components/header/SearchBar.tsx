import { Search, Command } from "lucide-react";

export default function SearchBar() {
  return (
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
  );
}