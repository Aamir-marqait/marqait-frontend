import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import coinIcon from "../../assets/nav-icon/icon.png";
import { useCreditsBalance } from "@/hooks/useCreditsBalance";
import { useSubscription } from "@/hooks/useSubscription";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export default function CreditDisplay() {
  const [isCreditHoverOpen, setIsCreditHoverOpen] = useState(false);
  const creditDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { creditsBalance } = useCreditsBalance();
  const { subscriptionStatus } = useSubscription();

  // Calculate credit limit based on current subscription
  const creditLimit = useMemo(() => {
    if (subscriptionStatus?.current_subscription) {
      return subscriptionStatus.current_subscription.plan.credits;
    }

    // Fallback based on subscription tier
    const tier = subscriptionStatus?.subscription_tier?.toLowerCase() || "free";
    switch (tier) {
      case "pro":
      case "professional":
        return 10000;
      case "enterprise":
        return 100000;
      default:
        return 1000;
    }
  }, [subscriptionStatus]);

  // Show total available credits (subscription + custom credits)
  const totalAvailableCredits = creditsBalance?.total_available || 0;

  const handleUpgradeClick = () => {
    navigate("/account/upgrade/credit");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        creditDropdownRef.current &&
        !creditDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCreditHoverOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex items-center py-2 justify-center space-x-2 bg-[#F4EAFF] rounded-[100px] px-4">
        <img src={coinIcon} alt="Coin" className="w-5 h-5" />
        <div className="flex items-center gap-[1px]">
          <span className="font-Inter font-medium text-[14px] leading-[100%] text-gray-700">
            {totalAvailableCredits.toLocaleString()}
          </span>
          <span className="font-Inter font-medium text-[12px] leading-[100%] text-gray-700">
            /
          </span>
          <span className="font-Inter font-medium text-[12px] leading-[100%] text-gray-700">
            {creditLimit.toLocaleString()}
          </span>
        </div>
        <div className="py-3" style={{ border: "1px solid #1A1A1A40" }}></div>
        <div
          ref={creditDropdownRef}
          onMouseEnter={() => setIsCreditHoverOpen(true)}
          onMouseLeave={() => setIsCreditHoverOpen(false)}
          onClick={handleUpgradeClick}
          className="text-[#8F00FF] cursor-pointer relative"
          style={{
            fontFamily: "Inter",
            fontWeight: 500,
            fontSize: "12px",
            lineHeight: "100%",
            letterSpacing: "0%",
            borderRadius: "4px",
          }}
        >
          Upgrade
          {isCreditHoverOpen && (
            <>
              {/* Invisible bridge to maintain hover */}
              <div
                className="absolute top-full right-0 w-full h-2 z-50"
                onMouseEnter={() => setIsCreditHoverOpen(true)}
                onMouseLeave={() => setIsCreditHoverOpen(false)}
              ></div>
              <div
                className="absolute top-full right-0 bg-white rounded-lg z-50"
                style={{
                  boxShadow:
                    "0px 4px 6px -2px #0000000D, 0px 10px 15px -3px #0000001A, 0px 0px 0px 1px #0000000D",
                  width: "320px",
                  marginTop: "8px",
                }}
                onMouseEnter={() => setIsCreditHoverOpen(true)}
                onMouseLeave={() => setIsCreditHoverOpen(false)}
              >
                <div className="space-y-0">
                  {/* Header with Free and Upgrade button */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-100 cursor-default">
                    <span className="font-Inter font-medium text-[16px] leading-[100%] text-[#1C1C1C] cursor-default">
                      Free
                    </span>
                    <Button
                      size="sm"
                      onClick={handleUpgradeClick}
                      className="text-white px-4 py-2 font-Inter font-semibold text-[14px] leading-[24px] rounded-[8px] border border-[#7F56D9] cursor-pointer hover:opacity-90 transition-opacity"
                      style={{
                        background:
                          "linear-gradient(180deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)",
                        boxShadow: "0px 1px 2px 0px #0A0D120D",
                      }}
                    >
                      Upgrade
                    </Button>
                  </div>

                  {/* Credits section */}
                  <div className="p-4 cursor-default">
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-3">
                        <img src={coinIcon} alt="Coin" className="w-5 h-5" />
                        <div className="flex flex-col gap-2">
                          <span className="font-Inter font-normal text-[16px] leading-[100%] text-[#1C1C1C]">
                            Credits
                          </span>
                          <span className="font-Inter font-normal text-[12px] leading-[100%] text-[#565E6C] mt-1">
                            Non-Expiring Credits
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-Inter font-normal text-[16px] leading-[100%] text-[#1C1C1C]">
                          {totalAvailableCredits.toLocaleString()}
                        </span>
                        <span className="font-Inter font-normal text-[12px] leading-[100%] text-[#565E6C] mt-1">
                          0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Usage Details section */}

                  <button className="cursor-pointer flex items-center gap-1 p-4 text-left hover:bg-gray-50 transition-colors">
                    <span className="font-Inter font-normal text-[14px] leading-[100%] text-[#1C1C1C]">
                      Usage Details
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#1C1C1C]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
