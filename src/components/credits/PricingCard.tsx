import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import coin from "../../assets/coin.svg";

interface PricingCardProps {
  planType: "free" | "professional" | "enterprise";
  title: string;
  price: string;
  period: string;
  description: string;
  credits: string;
  creditsNote?: string;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "secondary";
  isSelected?: boolean;
  isSelectable?: boolean;
  onSelect?: () => void;
}

export default function PricingCard({
  planType,
  title,
  price,
  period,
  description,
  credits,
  creditsNote,
  features,
  buttonText,
  buttonVariant = "default",
  isSelected = false,
  isSelectable = true,
  onSelect,
}: PricingCardProps) {
  return (
    <Card
      className={`border rounded-2xl overflow-hidden ${
        isSelectable ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "border-t-2 border-t-[#8F00FF]"
          : "border-gray-200 hover:shadow-md"
      }`}
      style={{
        background: isSelected
          ? "linear-gradient(135deg, #FFFFFF 0%, #F3E8FF 100%)"
          : "#FFFFFF",
        boxShadow: isSelected
          ? "0.5px 0.5px 1px 0px rgba(0, 0, 0, 0.1)"
          : "none",
      }}
      onClick={isSelectable ? onSelect : undefined}
    >
      <CardContent className="">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-6">
            <h3
              className={`text font-semibold leading-none tracking-normal align-middle ${
                isSelected ? "text-[#8F00FF]" : "text-[#1A1A1AB2]"
              }`}
            >
              {title}
            </h3>
            {(planType === "professional" || planType === "enterprise") && (
              <div
                className="flex items-center justify-center text-right"
                style={{
                  width: '72px',
                  height: '22px',
                  borderRadius: '200px',
                  backgroundColor: '#DCFFE3',
                  color: '#299438',
                  fontSize: '12px',
                  fontFamily: 'Inter',
                  fontWeight: '542',
                  lineHeight: '100%',
                  padding: '4px 8px',
                  gap: '4px',
                  whiteSpace: 'nowrap'
                }}
              >
                Save {planType === "professional" ? "22" : "12"}%
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            {(planType === "professional" || planType === "enterprise") && (
              <span
                style={{
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  fontSize: '20px',
                  lineHeight: '28px',
                  letterSpacing: '0px',
                  textDecoration: 'line-through',
                  color: '#E53E3E',
                  verticalAlign: 'middle'
                }}
              >
                ${planType === "professional" ? "120" : "300"}
              </span>
            )}
            <span className="text-4xl font-bold leading-none tracking-normal text-[#1A1A1A]">
              {price}
            </span>
            <span className="text-lg font-normal leading-none tracking-normal text-[#1A1A1AB2] ml-2">
              {period}
            </span>
          </div>
          <p className="leading-none tracking-normal text-[#1A1A1AB2] mt-4">
            {description}
          </p>
        </div>

        <Button
          className={`w-full h-12 min-h-[44px] rounded-xl mb-6 gap-3 px-4 text-lg font-semibold leading-none tracking-normal text-center align-middle text-white ${
            buttonVariant === "secondary"
              ? "opacity-50 border border-gray-300 bg-[#1D1D20]"
              : ""
          }`}
          style={{
            background:
              buttonVariant === "secondary"
                ? "#1D1D20"
                : "linear-gradient(90deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)",
            boxShadow:
              buttonVariant === "secondary"
                ? "none"
                : "0px 1px 2px 0px #0A0D120D",
          }}
        >
          {buttonText}
        </Button>

        <div className="border-t border-dashed border-[#1A1A1A2E] mb-6"></div>

        <div className="mb-6">
          <h4 className="font-semibold text-[18px] leading-none tracking-normal align-middle text-[#1A1A1A] mb-3">
            Credits
          </h4>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6  rounded-full">
              <img src={coin} alt="coin" />
            </div>
            <span className="font-medium text-[15px] leading-none tracking-normal align-middle text-gray-700">
              {credits}
            </span>
            {creditsNote && (
              <span className="font-normal text-[13px] leading-none tracking-normal align-middle text-gray-500">
                {creditsNote}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-dashed border-[#1A1A1A2E] mb-6"></div>

        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border-white bg-gradient-to-b from-white to-gray-100 flex items-center justify-center">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
