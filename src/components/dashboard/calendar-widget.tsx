import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarWidget() {
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
    <Card className="bg-white border-none shadow-none h-[459px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Calendar
        </CardTitle>
        <div className="flex items-center justify-between mt-4">
          <div>
            <div className="text-sm text-gray-500">Aug 10, Mon</div>
            <div className="text-xs text-gray-400 mt-1">Today</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.map((event, index) => (
          <div key={index} className={`border-l-4 ${event.color} pl-3 py-2`}>
            <div className="font-medium text-gray-900 text-sm">
              {event.title}
            </div>
            <div className="text-xs text-gray-500 mt-1">{event.time}</div>
          </div>
        ))}

        <div className="pt-4">
          <Button variant="link" className="text-purple-600 text-sm p-0">
            See full calendar →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
