import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./dialog";
import { Button } from "./button";
import { X, Star, Crown, Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

interface PlanRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planType: "professional" | "enterprise";
}

export function PlanRequestModal({
  open,
  onOpenChange,
  planType,
}: PlanRequestModalProps) {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const planConfig = {
    professional: {
      title: "Professional Plan",
      price: "$97",
      credits: "10,000",
      icon: <Star className="w-6 h-6" />,
      color: "#8F00FF",
    },
    enterprise: {
      title: "Enterprise Plan",
      price: "$257",
      credits: "100,000",
      icon: <Crown className="w-6 h-6" />,
      color: "#8F00FF",
    },
  };

  const config = planConfig[planType];

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setIsLoading(false);
      setShowThankYou(false);
    }
  }, [open]);

  // Auto-close thank you modal after 3 seconds
  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => {
        setShowThankYou(false);
        onOpenChange(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showThankYou, onOpenChange]);

  const handleRequest = async () => {
    if (!user) return;

    setIsLoading(true);

    const name = `${user.first_name} ${user.last_name}`.trim();
    const email = user.email_address;

    try {
      // Web3Forms submission
      const formData = new FormData();
      formData.append("access_key", "0a3a70cf-9b31-4dcd-9b68-934df7b505fa");
      formData.append("subject", `${config.title} Request`);
      formData.append(
        "message",
        `${name}(${email}) is requesting access to the ${config.title}. Please review this request and contact the user to discuss their requirements and provide access to the premium features.`
      );
      formData.append("from_name", "Marqait Platform");
      formData.append("reply_to", email);

      // Minimum 5 second loading
      const [response] = await Promise.all([
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        }),
        new Promise((resolve) => setTimeout(resolve, 5000)),
      ]);

      if (response.ok) {
        setShowThankYou(true);
      } else {
        console.error("Form submission failed");
        // Could add error handling here
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // Could add error handling here
    } finally {
      setIsLoading(false);
    }
  };

  if (showThankYou) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[480px] bg-white border-0 shadow-xl rounded-2xl p-8">
          <div className="flex flex-col items-center text-center space-y-6 py-8">
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #DCFFE3 0%, #B3F5C0 100%)",
                color: "#16A34A",
              }}
            >
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-3">
              <h3 className="font-Inter font-semibold text-2xl text-[#1D2127]">
                Thank You!
              </h3>
              <p className="font-Inter text-lg text-[#52575D] leading-relaxed max-w-sm">
                Your request has been submitted successfully. We will connect
                with you soon to discuss your requirements.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white border-0 shadow-xl rounded-2xl p-8">
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

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Plan Details */}
          <div className="space-y-3">
            <h3 className="font-Inter font-semibold text-xl text-[#1D2127]">
              {config.title}
            </h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="font-Inter font-bold text-3xl text-[#1D2127]">
                {config.price}
              </span>
              <span className="font-Inter text-lg text-[#52575D]">
                /per month
              </span>
            </div>
            <p className="font-Inter text-base text-[#52575D]">
              {config.credits} credits included
            </p>
          </div>

          {/* Request Message */}
          <div className="space-y-2">
            <p className="font-Inter text-lg text-[#1D2127] leading-relaxed">
              To access the {config.title}, please submit a request.
            </p>
            <p className="font-Inter text-base text-[#52575D] leading-relaxed">
              Our team will review and contact you shortly.
            </p>
          </div>
        </div>

        <DialogFooter className="pt-0 flex w-full gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1 h-12 px-6 py-3 gap-2 cursor-pointer rounded-xl border border-[#D5D7DA] bg-[#FFFFFF] shadow-sm font-Inter font-semibold text-base text-[#414651] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRequest}
            disabled={!user || isLoading}
            className="flex-1 h-12 px-6 cursor-pointer py-3 gap-2 rounded-xl border border-[#8F00FF] font-Inter font-semibold text-base text-[#FFFFFF] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:
                "linear-gradient(90deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)",
              boxShadow: "0px 1px 2px 0px rgba(10, 13, 18, 0.05)",
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Request Access"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
