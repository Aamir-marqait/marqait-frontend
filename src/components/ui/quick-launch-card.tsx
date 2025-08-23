"use client";

import { ArrowRight, Crown } from "lucide-react";
import { Card, CardContent } from "./card";
import { useState } from "react";

interface QuickLaunchCardProps {
  title: string;
  description: string;
  iconSrc: string;
  backgroundColor: string;
  iconBackgroundColor: string;
  onClick?: () => void;
  className?: string;
  isPremium?: boolean;
  upgradeText?: string;
}

export function QuickLaunchCard({
  title,
  description,
  iconSrc,
  backgroundColor,
  iconBackgroundColor,
  onClick,
  className = "",
  isPremium = false,
  upgradeText = "Upgrade Premium",
}: QuickLaunchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`w-full h-[140px] sm:h-[156px] border-0 hover:shadow-md transition-shadow cursor-pointer rounded-[10px] opacity-100 relative ${className}`}
      style={{ backgroundColor }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent
        className={`p-3 sm:p-4 flex flex-col h-full transition-all duration-200 ${
          isPremium && isHovered ? "blur-sm" : ""
        }`}
      >
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 -mt-7 rounded-[8px] flex items-center justify-center mb-2 sm:mb-3"
          style={{ backgroundColor: iconBackgroundColor }}
        >
          <img
            src={iconSrc || "/placeholder.svg"}
            alt="logo"
            className="w-4 h-4 sm:w-7 sm:h-7"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-[Inter] font-[600] text-sm sm:text-[16px] leading-[20px] tracking-[0%] text-[#161E54] mb-1 sm:mb-2">
            {title}
          </h3>
          <p className="font-[Inter] font-[400] text-xs sm:text-[12px] leading-[100%] tracking-[0%] align-middle text-[#4B4B4B]">
            {description}
          </p>
        </div>
        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3">
          <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
        </div>
      </CardContent>

      {isPremium && (
        <>
          {!isHovered && (
            <div className="absolute top-2 right-2 flex flex-col items-center">
              <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-[#FF9A0C] mb-1" />
              <span className="font-[Inter] font-[500] text-[10px] sm:text-[12px] leading-[100%] text-[#FF9A0C]">
                Premium
              </span>
            </div>
          )}

          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <span className="bg-gradient-to-r from-[#7000CC] via-[#8000E6] to-[#8E07F8] shadow-[0px_2px_6px_0px_#7000CC40] font-[Inter] font-[700] text-xs sm:text-[14px] leading-[20px] tracking-[0px] text-center capitalize text-[#FFFFFF] px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2">
                <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                {upgradeText}
              </span>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
