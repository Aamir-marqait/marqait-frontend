import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "./card";

interface QuickLaunchCardProps {
  title: string;
  description: string;
  iconSrc: string;
  backgroundColor: string;
  iconBackgroundColor: string;
  onClick?: () => void;
}

export function QuickLaunchCard({
  title,
  description,
  iconSrc,
  backgroundColor,
  iconBackgroundColor,
  onClick,
}: QuickLaunchCardProps) {
  return (
    <Card 
      className={`w-full lg:w-[204px] h-[156px] border-0 hover:shadow-md transition-shadow cursor-pointer rounded-[10px] opacity-100 relative`}
      style={{ backgroundColor }}
      onClick={onClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div 
          className="w-10 h-10 rounded-[8px] flex items-center justify-center ml-4 mb-3"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <img src={iconSrc} alt="logo" />
        </div>
        <div className="px-4 flex-1">
          <h3 className="font-[Inter] font-[600] text-[16px] leading-[20px] tracking-[0%] text-[#161E54] mb-2">
            {title}
          </h3>
          <p className="font-[Inter] font-[400] text-[12px] leading-[100%] tracking-[0%] align-middle text-[#4B4B4B]">
            {description}
          </p>
        </div>
        <div className="absolute bottom-3 right-3">
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>
      </CardContent>
    </Card>
  );
}