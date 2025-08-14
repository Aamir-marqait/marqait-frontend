import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EngagementChart() {
  const data = [
    { month: "Jan", value: 300 },
    { month: "Feb", value: 250 },
    { month: "Mar", value: 200 },
    { month: "Apr", value: 750 },
    { month: "May", value: 350 },
    { month: "Jun", value: 400 },
    { month: "Jul", value: 150 },
    { month: "Aug", value: 950 },
    { month: "Sep", value: 850 },
    { month: "Oct", value: 6700 },
    { month: "Nov", value: 750 },
    { month: "Dec", value: 500 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className="w-[754px] h-[459px] rounded-lg bg-[#FFFFFF] opacity-100 border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Engagement Over Time
        </CardTitle>
        <Select defaultValue="last-year">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-year">Last Year</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-week">Last Week</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="relative w-[706px] h-[300px] mt-5">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-sm text-gray-500 pr-4">
            <span>10k+</span>
            <span>1k+</span>
            <span>800</span>
            <span>600</span>
            <span>400</span>
            <span>200</span>
            <span>0</span>
          </div>

          {/* Chart area */}
          <div className="ml-12 h-full relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 300"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8F00FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8F00FF" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* Area path */}
              <path
                d={`M 0 ${300 - (data[0].value / maxValue) * 280} 
                   L ${(800 / 11) * 1} ${300 - (data[1].value / maxValue) * 280}
                   L ${(800 / 11) * 2} ${300 - (data[2].value / maxValue) * 280}
                   L ${(800 / 11) * 3} ${300 - (data[3].value / maxValue) * 280}
                   L ${(800 / 11) * 4} ${300 - (data[4].value / maxValue) * 280}
                   L ${(800 / 11) * 5} ${300 - (data[5].value / maxValue) * 280}
                   L ${(800 / 11) * 6} ${300 - (data[6].value / maxValue) * 280}
                   L ${(800 / 11) * 7} ${300 - (data[7].value / maxValue) * 280}
                   L ${(800 / 11) * 8} ${300 - (data[8].value / maxValue) * 280}
                   L ${(800 / 11) * 9} ${300 - (data[9].value / maxValue) * 280}
                   L ${(800 / 11) * 10} ${
                  300 - (data[10].value / maxValue) * 280
                }
                   L 800 ${300 - (data[11].value / maxValue) * 280}
                   L 800 300 L 0 300 Z`}
                fill="url(#gradient)"
              />

              {/* Line */}
              <path
                d={`M 0 ${300 - (data[0].value / maxValue) * 280} 
                   L ${(800 / 11) * 1} ${300 - (data[1].value / maxValue) * 280}
                   L ${(800 / 11) * 2} ${300 - (data[2].value / maxValue) * 280}
                   L ${(800 / 11) * 3} ${300 - (data[3].value / maxValue) * 280}
                   L ${(800 / 11) * 4} ${300 - (data[4].value / maxValue) * 280}
                   L ${(800 / 11) * 5} ${300 - (data[5].value / maxValue) * 280}
                   L ${(800 / 11) * 6} ${300 - (data[6].value / maxValue) * 280}
                   L ${(800 / 11) * 7} ${300 - (data[7].value / maxValue) * 280}
                   L ${(800 / 11) * 8} ${300 - (data[8].value / maxValue) * 280}
                   L ${(800 / 11) * 9} ${300 - (data[9].value / maxValue) * 280}
                   L ${(800 / 11) * 10} ${
                  300 - (data[10].value / maxValue) * 280
                }
                   L 800 ${300 - (data[11].value / maxValue) * 280}`}
                stroke="#8F00FF"
                strokeWidth="2"
                fill="none"
              />

              {/* Peak point with label */}
              <circle
                cx={(800 / 11) * 9}
                cy={300 - (data[9].value / maxValue) * 280}
                r="4"
                fill="#8F00FF"
              />
            </svg>

            {/* Peak label */}
            <div
              className="absolute text-purple-600 font-semibold text-sm"
              style={{
                left: `${(9 / 11) * 100}%`,
                top: `${((maxValue - data[9].value) / maxValue) * 280 - 25}px`,
                transform: "translateX(-50%)",
              }}
            >
              6,700
            </div>
          </div>

          {/* X-axis labels */}
          <div className="ml-12 flex justify-between text-sm text-gray-500 mt-4">
            {data.map((item) => (
              <span key={item.month}>{item.month}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
