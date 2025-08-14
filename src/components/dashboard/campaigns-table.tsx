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
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            ● Active
          </Badge>
        );
      case "Draft":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            ● Draft
          </Badge>
        );
      case "Scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            ● Scheduled
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <Card className="bg-white border-none shadow-none h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Current Campaigns Overview
        </CardTitle>
        <Select defaultValue="today">
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[300px]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  Campaign Name
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  Reach
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  Engagement
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  Conversions
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  Budget
                </th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-2 text-sm font-medium text-gray-900">
                    {campaign.name}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-600">
                    {campaign.reach}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-600">
                    {campaign.engagement}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-600">
                    {campaign.conversions}
                  </td>
                  <td className="py-4 px-2 text-sm text-gray-600">
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
