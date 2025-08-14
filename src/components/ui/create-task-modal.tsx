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
      id: "logo-generator",
      title: "Logo Generator",
      subtitle: "Sub text",
      icon: <Image className="w-6 h-6" />,
      allowedInFree: true,
    },
  ];

  // Filter tasks based on user plan
  const filteredTasks = taskOptions.filter(task => {
    if (userPlan === "free") {
      return task.allowedInFree;
    }
    return true; // Show all tasks for professional and enterprise
  });

  const [selectedTask, setSelectedTask] = useState<string>(filteredTasks[0]?.id || "");

  const handleConfirm = () => {
    // Navigate to the respective page based on selected task
    switch (selectedTask) {
      case "generate-strategy":
        navigate("/strategy");
        break;
      case "create-campaign":
        navigate("/campaign");
        break;
      case "blog":
        navigate("/blog");
        break;
      case "social-post":
        navigate("/social-media-post-generator");
        break;
      case "logo-generator":
        navigate("/logo-generator");
        break;
      default:
        break;
    }
    onOpenChange(false);
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
          {filteredTasks.map((task) => {
            const isSelected = selectedTask === task.id;

            return (
              <div key={task.id} className="relative">
                <button
                  onClick={() => setSelectedTask(task.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-500">{task.subtitle}</p>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
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
            disabled={!selectedTask}
            className="bg-gradient-to-r from-[#7000CC] via-[#8000E6] to-[#8E07F8] hover:from-[#6000BB] hover:via-[#7000D5] hover:to-[#7D06E7] text-white px-6 shadow-[0px_2px_6px_0px_#7000CC40]"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}