import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { Button } from "./button";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import coin from "../../assets/coin.svg";

interface LowCreditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LowCreditModal({ open, onOpenChange }: LowCreditModalProps) {
  const navigate = useNavigate();

  const handleBuyCredits = () => {
    onOpenChange(false);
    navigate("/account/upgrade/credit");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-xl rounded-2xl p-8">
        <DialogHeader>
          <div className="flex items-center justify-end mb-2">
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4">
            <h3 className="font-Inter font-semibold text-2xl lg:text-3xl text-[#1D2127]">
              Insufficient Credits
            </h3>
            <div className="space-y-3 max-w-md">
              <p className="font-Inter text-base lg:text-lg text-[#52575D] leading-relaxed">
                You don't have enough{" "}
                <span className="inline-flex items-center gap-1">credits</span>{" "}
                to complete this action.
              </p>
              <p className="font-Inter text-sm lg:text-base text-[#6B7280]">
                Purchase additional credits or upgrade your plan to continue
                using our AI-powered tools.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 flex w-full gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 h-12 px-6 py-3 gap-2 cursor-pointer rounded-xl border border-[#D5D7DA] bg-[#FFFFFF] shadow-sm font-Inter font-medium text-base text-[#414651] hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Button>
          <Button
            onClick={handleBuyCredits}
            className="flex-1 h-12 px-6 cursor-pointer py-3 gap-2 rounded-xl border border-[#8F00FF] font-Inter font-medium text-base text-[#FFFFFF] hover:opacity-90 transition-opacity"
            style={{
              background:
                "linear-gradient(90deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)",
              boxShadow: "0px 1px 2px 0px rgba(10, 13, 18, 0.05)",
            }}
          >
            <img src={coin} alt="" className="w-4 h-4" />
            Buy Credits
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
