import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export function CampaignsTable() {
  const campaigns = [
    {
      name: "Lorem Ipsum Name",
      reach: "12.6k",
      engagement: "8.2%",
      conversions: "12",
      budget: "75%",
      status: "Active",
    },
    {
      name: "Lorem Ipsum Name",
      reach: "4.1k",
      engagement: "89%",
      conversions: "89",
      budget: "75%",
      status: "Draft",
    },
    {
      name: "Lorem Ipsum Name",
      reach: "12.6k",
      engagement: "12%",
      conversions: "1200",
      budget: "20%",
      status: "Scheduled",
    },
    {
      name: "Lorem Ipsum Name",
      reach: "12.6k",
      engagement: "8.2%",
      conversions: "12,500",
      budget: "75%",
      status: "Active",
    },
    {
      name: "Lorem Ipsum Name",
      reach: "12.6k",
      engagement: "8.2%",
      conversions: "12,500",
      budget: "75%",
      status: "Scheduled",
    },
    {
      name: "Lorem Ipsum Name",
      reach: "12.6k",
      engagement: "8.2%",
      conversions: "12,500",
      budget: "75%",
      status: "Active",
    },
    {
      name: "Lorem Ipsum Name",
      reach: "12.6k",
      engagement: "8.2%",
      conversions: "12,500",
      budget: "75%",
      status: "Active",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge className="bg-[#ECFDF3] text-[#037847] hover:bg-[#ECFDF3] rounded-[16px] font-[Inter] font-[500] text-[12px] leading-[18px] tracking-[0%] text-center flex items-center gap-1">
            <div className="w-[6px] h-[6px] rounded-full bg-[#14BA6D]"></div>
            Active
          </Badge>
        );
      case "Draft":
        return (
          <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] rounded-[16px] font-[Inter] font-[500] text-[12px] leading-[18px] tracking-[0%] text-center flex items-center gap-1">
            <div className="w-[6px] h-[6px] rounded-full bg-[#92400E]"></div>
            Draft
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="bg-[#DBEAFE] text-[#396AFF] hover:bg-[#DBEAFE] rounded-[16px] font-[Inter] font-[600] text-[12px] leading-[18px] tracking-[0%] text-center flex items-center gap-1">
            <div className="w-[6px] h-[6px] rounded-full bg-[#396AFF]"></div>
            Scheduled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="rounded-[16px]">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-white border-none shadow-none h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-[Inter] font-[600] text-[20px] leading-[100%] tracking-[0%] text-[#161E54]">
          Current Campaigns Overview
        </CardTitle>
        <Select defaultValue="today">
          <SelectTrigger className="w-[109px] h-[38px] rounded-lg gap-3 border border-[#F2F2F2] p-[10px] bg-white shadow-[0px_2px_4px_0px_#0000000A] font-[Inter] font-[600] text-[14px] leading-[18px] tracking-[-0.5px] text-center text-[#7A7A7A] cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-none shadow-none mr-10">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[300px] ">
        <div className="overflow-x-auto rounded-t-lg">
          <table className="w-full border border-[#EAECF0] rounded-t-lg">
            <thead className=" bg-[#f9f5f5] border border-[#EAECF0] ">
              <tr>
                <th className="text-left py-3 px-2 font-[Inter] font-[500] text-[12px] leading-[18px] tracking-[0%] text-[#667085]">
                  Campaign Name
                </th>
                <th className="text-left py-3 px-2 font-[Inter] font-[500] text-[12px] leading-[18px] tracking-[0%] text-[#667085]">
                  Reach
                </th>
                <th className="text-left py-3 px-2 font-[Inter] font-[500] text-[12px] leading-[18px] tracking-[0%] text-[#667085]">
                  Engagement
                </th>
                <th className="text-left py-3 px-2 font-[Inter] font-[500] text-[12px] leading-[18px] tracking-[0%] text-[#667085]">
                  Conversions
                </th>
                <th className="text-left py-3 px-2 font-[Inter] font-[500] text-[12px] leading-[18px] tracking-[0%] text-[#667085]">
                  Budget
                </th>
                <th className="text-left py-3 px-2 font-[Inter] font-[500] text-[12px] leading-[18px] tracking-[0%] text-[#667085]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-2 font-[Inter] font-[500] text-[14px] leading-[20px] tracking-[0%] text-[#1C1C1C]">
                    {campaign.name}
                  </td>
                  <td className="py-4 px-2 font-[Inter] font-[400] text-[14px] leading-[20px] tracking-[0%] text-[#667085]">
                    {campaign.reach}
                  </td>
                  <td className="py-4 px-2 font-[Inter] font-[400] text-[14px] leading-[20px] tracking-[0%] text-[#667085]">
                    {campaign.engagement}
                  </td>
                  <td className="py-4 px-2 font-[Inter] font-[400] text-[14px] leading-[20px] tracking-[0%] text-[#667085]">
                    {campaign.conversions}
                  </td>
                  <td className="py-4 px-2 font-[Inter] font-[400] text-[14px] leading-[20px] tracking-[0%] text-[#667085]">
                    {campaign.budget}
                  </td>
                  <td className="py-4 px-2">
                    {getStatusBadge(campaign.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
