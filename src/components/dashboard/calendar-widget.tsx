"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState } from "react";

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateDate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${months[date.getMonth()]} ${date.getDate()}, ${
      days[date.getDay()]
    }`;
  };

  const getDateLabel = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return "";
  };

  const events = [
    {
      time: "16:00",
      title: "Summer Campaign has end!",
      color: "border-l-green-400",
    },
    {
      time: "14:00",
      title: "2 plus 1 promotions has end!",
      color: "border-l-yellow-400",
    },
    {
      time: "13:00",
      title: "Winter Campaign has end!",
      color: "border-l-blue-400",
    },
    {
      time: "09:00",
      title: "Summer Campaign has end!",
      color: "border-l-purple-400",
    },
  ];

  return (
    <Card className="bg-white border-none shadow-none h-[400px] sm:h-[459px] w-full">
      <CardHeader className="px-3 sm:px-6">
        <CardTitle className="font-[Inter] font-[600] text-lg sm:text-[20px] leading-[100%] tracking-[0%] text-[#161E54]">
          Calendar
        </CardTitle>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="font-[Inter] font-[400] text-sm sm:text-[14px] leading-[20px] tracking-[0%] text-[#7D7D7D] truncate">
              {formatDate(currentDate)}
            </div>
            {getDateLabel(currentDate) && (
              <div className="h-[18px] rounded-[4px] bg-[#F3F4F6] px-[7px] py-[3px] font-[Inter] font-[600] text-[10px] leading-[100%] tracking-[0%] text-[#4B5563] flex items-center justify-center whitespace-nowrap flex-shrink-0">
                {getDateLabel(currentDate)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="w-[20px] h-[20px] p-0 border border-[#DCDCDD] cursor-pointer"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-[20px] h-[20px] p-0 border border-[#DCDCDD] cursor-pointer"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-3 sm:px-6 pt-0 overflow-y-auto max-h-[280px] sm:max-h-[320px]">
        {events.map((event, index) => (
          <div
            key={index}
            className={`h-[50px] sm:h-[60px] rounded-[4px] border border-[#DCDCDD] border-l-4 ${event.color} px-3 sm:px-[15px] py-2 sm:py-[10px] gap-[5px] flex flex-col justify-center`}
          >
            <div className="font-[Inter] font-[400] text-sm sm:text-[14px] leading-[20px] tracking-[0%] text-[#1C1C1C] truncate">
              {event.title}
            </div>
            <div className="font-[Inter] font-[400] text-xs sm:text-[12px] leading-[100%] tracking-[0%] text-[#7D7D7D]">
              {event.time}
            </div>
          </div>
        ))}

        <div className="pt-4">
          <div className="w-full h-[2px] bg-[#F1F3F4] mb-2"></div>
          <div className="flex justify-center mb-4">
            <Button
              variant="link"
              className="font-[Inter] font-[400] text-sm sm:text-[14px] leading-[20px] tracking-[0%] text-[#8F00FF] p-0 flex items-center gap-1"
            >
              See full calendar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
