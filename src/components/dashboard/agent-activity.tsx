import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function AgentActivity() {
  const activities = [
    {
      agent: "Campaign Agent",
      description: "Optimized add targeting for summer launch.",
      time: "Just Now",
      icon: "🎯",
    },
    {
      agent: "Analytics Agent",
      description: "Weekly performance report generated.",
      time: "5 minutes ago",
      icon: "📊",
    },
    {
      agent: "Content Creator Agent",
      description: "Optimized add targeting for summer launch.",
      time: "5 minutes ago",
      icon: "✍️",
    },
  ];

  return (
    <Card className="bg-white border-none shadow-none h-[400px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Recent Agent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto max-h-[300px]">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm">
                {activity.agent}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {activity.description}
              </div>
              <div className="text-xs text-gray-400 mt-2">{activity.time}</div>
            </div>
          </div>
        ))}

        <div className="pt-4">
          <Button variant="link" className="text-purple-600 text-sm p-0">
            See full activity →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
