import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Plus,
  Users,
  TrendingUp,
  MousePointer,
  ChevronDown,
  Pin,
  MoreHorizontal,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Hello Anas Sabah 👋
            </h1>
            <p className="text-gray-600 text-lg">
              Ready to create something amazing today?
            </p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Quick Launch */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Launch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Generate Campaign */}
            <Card className="bg-red-100 border-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-200 rounded-xl flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-red-500 rounded-md"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Generate Campaign
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create a new marketing campaign.
                </p>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </CardContent>
            </Card>

            {/* Create Social Post */}
            <Card className="bg-orange-100 border-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-orange-500 rounded-md"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Create Social Post
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Generate social media post with one click.
                </p>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </CardContent>
            </Card>

            {/* Blog Writer */}
            <Card className="bg-green-100 border-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-green-500 rounded-md"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Blog Writer
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Write engaging blog content.
                </p>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </CardContent>
            </Card>

            {/* Brand Book */}
            <Card className="bg-purple-100 border-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-md"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Brand Book</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Develop brand guidelines.
                </p>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </CardContent>
            </Card>

            {/* Edit AI Image */}
            <Card className="bg-purple-100 border-0 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center mb-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-md"></div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Edit AI Image
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create and edit images.
                </p>
                <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Campaigns Overview */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Current Campaigns Overview
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  Today, 13 Jun 2025
                  <ChevronDown className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div className="space-y-6">
                {/* Campaign 1 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Summer Product Launch
                      </span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">12.6K</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">8.2%</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">124</div>
                        <div className="text-xs text-gray-500">Conversions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign 2 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Back-To-School Campaign
                      </span>
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        Draft
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">12.6K</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">8.2%</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">124</div>
                        <div className="text-xs text-gray-500">Conversions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign 3 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Summer Product Launch
                      </span>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                        Scheduled
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">12.6K</div>
                        <div className="text-xs text-gray-500">Reach</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">8.2%</div>
                        <div className="text-xs text-gray-500">Engagement</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="font-semibold text-gray-900">124</div>
                        <div className="text-xs text-gray-500">Conversions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Campaign 4 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">
                        Summer Product Launch
                      </span>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">75% Complete</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700"
                >
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Agent Activity */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Recent Agent Activity
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  Today, 13 Jun 2025
                  <ChevronDown className="w-4 h-4 ml-1" />
                </div>
              </div>

              <div className="space-y-4">
                {/* Activity 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Campaign Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimized add targeting for summer launch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Just Now</p>
                  </div>
                </div>

                {/* Activity 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Analytics Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Weekly performance report generated.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">5 Minutes ago</p>
                  </div>
                </div>

                {/* Activity 3 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Content Creator Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimized add targeting for summer launch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">5 Minutes ago</p>
                  </div>
                </div>

                {/* Activity 4 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Campaign Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimized add targeting for summer launch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">5 Minutes ago</p>
                  </div>
                </div>

                {/* Activity 5 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Campaign Agent
                      </h4>
                      <div className="flex items-center gap-2">
                        <Pin className="w-4 h-4 text-gray-400" />
                        <MoreHorizontal className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Optimized add targeting for summer launch.
                    </p>
                    <p className="text-xs text-gray-500 mt-2">5 Minutes ago</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="ghost"
                  className="text-purple-600 hover:text-purple-700"
                >
                  Sell all activities <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
