import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { X, Type, Hash, Image, Shapes, Zap, Shield } from "lucide-react";

interface LogoStyleOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface LogoStyleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStyle?: string;
  onStyleSelect: (style: string) => void;
}

const logoStyleOptions: LogoStyleOption[] = [
  {
    id: "WORDMARK",
    title: "Wordmark",
    description: "Text-based logo using company name",
    icon: <Type className="w-4 h-4" />,
  },
  {
    id: "LETTERMARK",
    title: "Lettermark",
    description: "Logo using company initials",
    icon: <Hash className="w-4 h-4" />,
  },
  {
    id: "PICTORIAL_MARK",
    title: "Pictorial Mark",
    description: "Icon or symbol-based logo",
    icon: <Image className="w-4 h-4" />,
  },
  {
    id: "ABSTRACT",
    title: "Abstract",
    description: "Abstract geometric design",
    icon: <Shapes className="w-4 h-4" />,
  },
  {
    id: "COMBINATION_MARK",
    title: "Combination Mark",
    description: "Text and symbol combined",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    id: "EMBLEM",
    title: "Emblem",
    description: "Text inside a symbol or icon",
    icon: <Shield className="w-4 h-4" />,
  },
];

export function LogoStyleModal({
  open,
  onOpenChange,
  currentStyle,
  onStyleSelect,
}: LogoStyleModalProps) {
  const [selectedStyle, setSelectedStyle] = useState<string>(
    currentStyle || ""
  );

  const handleConfirm = () => {
    if (selectedStyle) {
      onStyleSelect(selectedStyle);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-xl rounded-lg p-6">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-[Inter] font-[600] text-[20px] leading-[28px] tracking-[0%] text-[#181D27]">
              Choose Logo Style
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 my-6">
          {logoStyleOptions.map((option) => {
            const isSelected = selectedStyle === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedStyle(option.id)}
                className={`w-full flex flex-col items-center gap-3 p-4 rounded-[12px] text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-2 border-[#8F00FF] bg-[#F9F5FF]"
                    : "border border-[#E9EAEB] bg-[#FFFFFF] hover:border-gray-300"
                }`}
                style={{ minHeight: "120px" }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center text-gray-600"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "28px",
                    border: "4px solid #F9F5FF",
                    background: "#F4EBFF",
                    mixBlendMode: "multiply",
                  }}
                >
                  {option.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <h3
                    className={`font-[Inter] font-[500] text-[14px] leading-[18px] tracking-[0%] ${
                      isSelected ? "text-[#53389E]" : "text-gray-900"
                    }`}
                  >
                    {option.title}
                  </h3>
                  <p
                    className={`font-[Inter] font-[400] text-[12px] leading-[16px] tracking-[0%] ${
                      isSelected ? "text-[#53389E]" : "text-gray-500"
                    }`}
                  >
                    {option.description}
                  </p>
                </div>
               
              </button>
            );
          })}
        </div>

        <DialogFooter className="pt-0 flex w-full gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-[210px] h-[40px] px-[18px] py-[10px] gap-2 rounded-[12px] border border-[#D5D7DA] bg-[#FFFFFF] shadow-[0px_1px_2px_0px_#0A0D120D] font-[Inter] font-[600] text-[16px] leading-[24px] tracking-[0%] text-[#414651] cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedStyle}
            className="w-[210px] h-[40px] px-[18px] py-[10px] gap-2 rounded-[12px] border border-[#8F00FF] bg-[linear-gradient(90deg,#7000CC_0%,#8000E5_50%,#8E07F8_100%)] shadow-[0px_1px_2px_0px_#0A0D120D] font-[Inter] font-[600] text-[16px] leading-[24px] tracking-[0%] text-[#FFFFFF] cursor-pointer"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
