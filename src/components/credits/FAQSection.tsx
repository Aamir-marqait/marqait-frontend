import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer?: string;
}

interface FAQSectionProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}

export default function FAQSection({ 
  title = "Frequently asked questions",
  subtitle = "Can’t find the anwser you’re looking for ? Reach out to customer support team.",
  items 
}: FAQSectionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-bold text-[32px] leading-[120%] tracking-normal text-center text-[#1D2127] mb-4">
          {title}
        </h2>
        <p className="font-normal text-[20px] leading-[150%] tracking-normal text-center text-[#52575D]">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <Collapsible
            key={index}
            open={openFaq === index}
            onOpenChange={() => toggleFaq(index)}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
              <span className="font-medium text-[18px] leading-[150%] tracking-normal text-[#323232]">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  openFaq === index ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 text-gray-600">
              {item.answer || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}