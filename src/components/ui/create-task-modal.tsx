import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { useAuthStore } from "../../stores/authStore";
import {
  TrendingUp,
  Megaphone,
  Edit3,
  Share2,
  Image,
  Crown,
} from "lucide-react";

interface TaskOption {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  allowedInFree: boolean;
}

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTaskModal({ open, onOpenChange }: CreateTaskModalProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<string>("generate-strategy");
  const userPlan = user?.plan || "free";

  const taskOptions: TaskOption[] = [
    {
      id: "generate-strategy",
      title: "Generate Strategy",
      subtitle: "Sub text",
      icon: <TrendingUp className="w-6 h-6" />,
      allowedInFree: false,
    },
    {
      id: "create-campaign",
      title: "Create Campaign",
      subtitle: "Sub text",
      icon: <Megaphone className="w-6 h-6" />,
      allowedInFree: false,
    },
    {
      id: "blog",
      title: "Blog",
      subtitle: "Sub text",
      icon: <Edit3 className="w-6 h-6" />,
      allowedInFree: false,
    },
    {
      id: "social-post",
      title: "Social Post",
      subtitle: "Sub text",
      icon: <Share2 className="w-6 h-6" />,
      allowedInFree: true,
    },
    {
      id: "image",
      title: "Image",
      subtitle: "Sub text",
      icon: <Image className="w-6 h-6" />,
      allowedInFree: false,
    },
  ];

  const handleUpgradeClick = () => {
    navigate("/account/upgrade/credit");
    onOpenChange(false);
  };

  const handleConfirm = () => {
    // Handle task creation logic here
    console.log("Creating task:", selectedTask);
    onOpenChange(false);
  };

  const isTaskRestricted = (task: TaskOption) => {
    return userPlan === "free" && !task.allowedInFree;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-xl rounded-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-left">
            Create Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {taskOptions.map((task) => {
            const isRestricted = isTaskRestricted(task);
            const isSelected = selectedTask === task.id;

            return (
              <div key={task.id} className="relative">
                <button
                  onClick={() => !isRestricted && setSelectedTask(task.id)}
                  disabled={isRestricted}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected && !isRestricted
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  } ${
                    isRestricted
                      ? "opacity-50 cursor-not-allowed blur-[1px]"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.subtitle}</p>
                  </div>
                  {isSelected && !isRestricted && (
                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>

                {isRestricted && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={handleUpgradeClick}
                      className="bg-gradient-to-r from-[#7000CC] via-[#8000E6] to-[#8E07F8] hover:from-[#6000BB] hover:via-[#7000D5] hover:to-[#7D06E7] text-white px-4 py-2 rounded-lg font-[Inter] font-[600] text-[12px] shadow-[0px_2px_6px_0px_#7000CC40] z-10 cursor-pointer flex items-center gap-2"
                    >
                      <Crown className="w-4 h-4" />
                      Upgrade to Professional
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <DialogFooter className="pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedTask || isTaskRestricted(taskOptions.find(t => t.id === selectedTask)!)}
            className="bg-gradient-to-r from-[#7000CC] via-[#8000E6] to-[#8E07F8] hover:from-[#6000BB] hover:via-[#7000D5] hover:to-[#7D06E7] text-white px-6 shadow-[0px_2px_6px_0px_#7000CC40]"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}