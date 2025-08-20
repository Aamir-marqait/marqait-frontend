import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SupportHero() {
  return (
    <section className="mb-6 bg-[linear-gradient(180deg,#EEE1FC_0%,#F9F4FF_100%,#FFFFFF_100%)] px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-4xl text-center">
        {/* Main heading */}
        <h1 className="font-bold text-[32px] leading-[100%] tracking-[0%] text-[#21242A] font-[Inter]">
          Standard Support
        </h1>

        {/* Description text */}
        <p className="mx-auto mt-3 max-w-3xl font-[350] text-[20px] leading-[150%] tracking-[0%] text-center text-[#333D44] font-[Inter]">
          Welcome to our comprehensive support center. As a Free Tier member,
          you have access to our knowledge base, community forums, and essential
          support resources to help you succeed.
        </p>

        {/* Search bar */}
        <div className="flex justify-center mt-10 md:mt-12">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              type="text"
              placeholder="Search..."
              className="block w-[503px] h-[46px] rounded-[12px] border-0 bg-[#FFFFFF] py-[10px] px-[12px] pl-12 font-normal text-[14px] leading-[150%] tracking-[0%] font-[Inter] shadow-[0px_2px_4px_0px_#0000001A] placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-500"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
