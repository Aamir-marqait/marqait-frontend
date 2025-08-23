import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import coinIcon from "../../assets/nav-icon/icon.png";
import { useCreditStore } from "../../stores/creditStore";
import { useSubscription } from "@/hooks/useSubscription";
import { ChevronRight, X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

const serviceData = [
  {
    service: "Logo Generator",
    date: "2025-08-01 12:07:23",
    credits: -23,
  },
  {
    service: "Image Generator",
    date: "2025-08-01 12:07:23",
    credits: -23,
  },
  {
    service: "Social Post Creator",
    date: "2025-08-01 12:07:23",
    credits: -45,
  },
];

export default function CreditDisplay() {
  const [isCreditHoverOpen, setIsCreditHoverOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const creditDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const {
    creditsBalance,
    fetchCreditsBalance,
    isLoading: isLoadingCredits,
  } = useCreditStore();
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

  // Fetch credits on component mount
  useEffect(() => {
    fetchCreditsBalance();
  }, [fetchCreditsBalance]);

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
          {isLoadingCredits ? (
            <>
              <div className="h-3 w-12  bg-[#e0c6fb] rounded animate-pulse"></div>
              <span className="font-Inter font-medium text-[12px] leading-[100%] text-gray-700">
                /
              </span>
              <div className="h-2 w-8 bg-[#e0c6fb] rounded animate-pulse"></div>
            </>
          ) : (
            <>
              <span className="font-Inter font-medium text-[14px] leading-[100%] text-gray-700">
                {totalAvailableCredits.toLocaleString()}
              </span>
              <span className="font-Inter font-medium text-[12px] leading-[100%] text-gray-700">
                /
              </span>
              <span className="font-Inter font-medium text-[12px] leading-[100%] text-gray-700">
                {creditLimit.toLocaleString()}
              </span>
            </>
          )}
        </div>
        <div className="py-3" style={{ border: "1px solid #1A1A1A40" }}></div>
        <div
          ref={creditDropdownRef}
          onMouseEnter={() => setIsCreditHoverOpen(true)}
          onMouseLeave={() => setIsCreditHoverOpen(false)}
          // onClick={handleUpgradeClick}
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
                        {isLoadingCredits ? (
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        ) : (
                          <span className="font-Inter font-normal text-[16px] leading-[100%] text-[#1C1C1C]">
                            {totalAvailableCredits.toLocaleString()}
                          </span>
                        )}
                        <span className="font-Inter font-normal text-[12px] leading-[100%] text-[#565E6C] mt-1">
                          0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Usage Details section */}

                  <button
                    onClick={() => {
                      setIsUsageModalOpen(true);
                      setIsCreditHoverOpen(false);
                    }}
                    className="cursor-pointer flex items-center gap-1 p-4 text-left hover:bg-gray-50 transition-colors"
                  >
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

      {/* Credit Usage Modal */}
      <Dialog open={isUsageModalOpen} onOpenChange={setIsUsageModalOpen}>
        <DialogContent
          className="bg-[#FFFFFFFA] rounded-2xl border-0 p-0 max-w-none w-full h-full sm:w-[1034px] sm:h-[686px] sm:max-h-[90vh] flex flex-col"
          style={{
            boxShadow:
              "0px 8px 8px -4px #0A0D120A, 0px 20px 24px -4px #0A0D121A",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <img src={coinIcon} alt="Coin" className="w-6 h-6" />
              <h2
                className="text-[#181D27]"
                style={{
                  fontFamily: "Inter",
                  fontWeight: 600,
                  fontSize: "24px",
                  lineHeight: "28px",
                  letterSpacing: "0%",
                }}
              >
                Credit Usage
              </h2>
            </div>
            <button
              onClick={() => setIsUsageModalOpen(false)}
              className="rounded-sm opacity-70 cursor-pointer transition-opacity hover:opacity-100"
            >
              <X className="h-6 w-6 text-[#181D27]" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-hidden px-6 pb-6">
            <div className="h-full">
              {/* Table Container with scroll */}
              <div className="h-full overflow-auto">
                <div className="min-w-full">
                  <table className="w-full">
                    {/* Header */}
                    <thead className="sticky top-0 bg-[#F0E5FF] z-10">
                      <tr>
                        <th
                          className="px-4 py-4 text-left text-[#8905F1]"
                          style={{
                            fontFamily: "Inter",
                            fontWeight: 600,
                            fontSize: "16px",
                            lineHeight: "100%",
                            letterSpacing: "0px",
                          }}
                        >
                          Service
                        </th>
                        <th
                          className="px-4 py-4 text-left text-[#8905F1]"
                          style={{
                            fontFamily: "Inter",
                            fontWeight: 600,
                            fontSize: "16px",
                            lineHeight: "100%",
                            letterSpacing: "0px",
                          }}
                        >
                          Date
                        </th>
                        <th
                          className="px-4 py-4 text-left text-[#8905F1]"
                          style={{
                            fontFamily: "Inter",
                            fontWeight: 600,
                            fontSize: "16px",
                            lineHeight: "100%",
                            letterSpacing: "0px",
                          }}
                        >
                          Credits Charged
                        </th>
                      </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                      {serviceData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td
                            className="px-4 py-4 text-[#1F2937]"
                            style={{
                              fontFamily: "Inter",
                              fontWeight: 500,
                              fontSize: "15px",
                              lineHeight: "14px",
                              letterSpacing: "0%",
                            }}
                          >
                            {item.service}
                          </td>
                          <td
                            className="px-4 py-4 text-[#1F2937]"
                            style={{
                              fontFamily: "Inter",
                              fontWeight: 500,
                              fontSize: "15px",
                              lineHeight: "14px",
                              letterSpacing: "0%",
                            }}
                          >
                            {item.date}
                          </td>
                          <td
                            className="px-4 py-4 text-[#1F2937]"
                            style={{
                              fontFamily: "Inter",
                              fontWeight: 500,
                              fontSize: "15px",
                              lineHeight: "14px",
                              letterSpacing: "0%",
                            }}
                          >
                            {item.credits}
                          </td>
                        </tr>
                      ))}

                      
                    </tbody>
                  </table>

                  {/* No More Data Message */}
                  <div className="py-6 text-center">
                    <p className="text-sm text-gray-500 sm:text-base">
                      No More Data
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
