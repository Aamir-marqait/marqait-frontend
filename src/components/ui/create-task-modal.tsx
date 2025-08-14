import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { useAuthStore } from "../../stores/authStore";
import { TrendingUp, Megaphone, Edit3, Share2, Image, X } from "lucide-react";

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
      icon: <TrendingUp style={{ width: '13.33px', height: '9.92px' }} />,
      allowedInFree: false,
    },
    {
      id: "create-campaign",
      title: "Create Campaign",
      subtitle: "Sub text",
      icon: <Megaphone style={{ width: '13.33px', height: '9.92px' }} />,
      allowedInFree: false,
    },
    {
      id: "blog",
      title: "Blog",
      subtitle: "Sub text",
      icon: <Edit3 style={{ width: '13.33px', height: '9.92px' }} />,
      allowedInFree: false,
    },
    {
      id: "social-post",
      title: "Social Post",
      subtitle: "Sub text",
      icon: <Share2 style={{ width: '15.33px', height: '11.92px' }} />,
      allowedInFree: true,
    },
    {
      id: "logo-generator",
      title: "Logo Generator",
      subtitle: "Sub text",
      icon: <Image style={{ width: '15.33px', height: '11.92px' }} />,
      allowedInFree: true,
    },
  ];

  // Filter tasks based on user plan
  const filteredTasks = taskOptions.filter((task) => {
    if (userPlan === "free") {
      return task.allowedInFree;
    }
    return true; // Show all tasks for professional and enterprise
  });

  const [selectedTask, setSelectedTask] = useState<string>(
    filteredTasks[0]?.id || ""
  );

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
      <DialogContent className="sm:max-w-[420px] bg-white border-0 shadow-xl rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-[Inter] font-[600] text-[20px] leading-[28px] tracking-[0%] text-[#181D27]">
            Create Task
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {filteredTasks.map((task) => {
            const isSelected = selectedTask === task.id;

            return (
              <div key={task.id} className="relative">
                <button
                  onClick={() => setSelectedTask(task.id)}
                  className={`w-full flex items-center gap-1 p-4 rounded-[12px] text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-2 border-[#8F00FF] bg-[#F9F5FF]"
                      : "border border-[#E9EAEB] bg-[#FFFFFF] hover:border-gray-300"
                  }`}
                  style={{ height: '72px' }}
                >
                  <div 
                    className="flex-shrink-0 flex items-center justify-center text-gray-600"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '28px',
                      border: '4px solid #F9F5FF',
                      background: '#F4EBFF',
                      mixBlendMode: 'multiply'
                    }}
                  >
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-[Inter] font-[500] text-[16px] leading-[20px] tracking-[0%] ${
                      isSelected ? "text-[#53389E]" : "text-gray-900"
                    }`}>
                      {task.title}
                    </h3>
                    <p className={`font-[Inter] font-[400] text-[14px] leading-[20px] tracking-[0%] ${
                      isSelected ? "text-[#53389E]" : "text-gray-500"
                    }`}>{task.subtitle}</p>
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

        <DialogFooter className="pt-0 flex w-full gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 cursor-pointer font-[Inter] font-[600] text-[16px] leading-[24px] tracking-[0%] text-[#414651] bg-[#FFFFFF] border border-[#D5D7DA] rounded-[12px]"
            style={{
              height: '44px',
              paddingTop: '10px',
              paddingRight: '18px',
              paddingBottom: '10px',
              paddingLeft: '18px',
              boxShadow: '0px 1px 2px 0px #0A0D120D'
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedTask}
            className="flex-1 cursor-pointer font-[Inter] font-[600] text-[16px] leading-[24px] tracking-[0%] text-[#FFFFFF] border border-[#8F00FF] rounded-[12px]"
            style={{
              height: '44px',
              paddingTop: '10px',
              paddingRight: '18px',
              paddingBottom: '10px',
              paddingLeft: '18px',
              background: 'linear-gradient(90deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)',
              boxShadow: '0px 1px 2px 0px #0A0D120D'
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
