import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import campaignIcon from "../../assets/nav-icon/campaign.svg";
import analyticsIcon from "../../assets/nav-icon/analytics.svg";
import contentGeneratorIcon from "../../assets/nav-icon/content-generator.svg";

export function AgentActivity() {
  const activities = [
    {
      agent: "Campaign Agent",
      description: "Optimized add targeting for summer launch.",
      time: "Just Now",
      icon: campaignIcon,
    },
    {
      agent: "Analytics Agent",
      description: "Weekly performance report generated.",
      time: "5 minutes ago",
      icon: analyticsIcon,
    },
    {
      agent: "Content Creator Agent",
      description: "Optimized add targeting for summer launch.",
      time: "5 minutes ago",
      icon: contentGeneratorIcon,
    },
  ];

  return (
    <Card className="bg-white border-none shadow-none h-[400px]">
      <CardHeader>
        <CardTitle className="font-inter font-[600] text-[20px] leading-[100%] tracking-[0%] text-[#161E54]">
          Recent Agent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-[300px]">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="w-[335px] h-[111px] flex items-center gap-3 border-b border-[#EAECF0] pb-4"
          >
            <div className="w-[32px] h-[32px] rounded-[100px] bg-[#F0E3FF] flex items-center justify-center">
              <img 
                src={activity.icon} 
                alt={activity.agent} 
                className="w-4 h-4"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-inter font-[500] text-[16px] leading-[100%] tracking-[0%] text-[#1C1C1C]">
                {activity.agent}
              </div>
              <div className="font-inter font-[400] text-[14px] leading-[150%] tracking-[0px] text-[#4B4B4B] mt-1">
                {activity.description}
              </div>
              <div className="font-inter flex w-full justify-end font-[400] text-[12px] leading-[19.04px] tracking-[0%] text-[#7D7D7D] mt-2">
                {activity.time}
              </div>
            </div>
          </div>
        ))}

        <div className="pt-4 flex justify-center">
          <Button variant="link" className="font-[Inter] font-[400] text-[14px] leading-[20px] tracking-[0%] text-[#8F00FF] p-0 flex items-center gap-1">
            See full activity
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
