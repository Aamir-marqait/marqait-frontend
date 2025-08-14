import UpgradeHeader from "../../components/UpgradeHeader";
import PricingCard from "../../components/credits/PricingCard";
import FAQSection from "../../components/credits/FAQSection";
import { useAuthStore } from "../../stores/authStore";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SubscriptionPage() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const { updateUserPlan, user } = useAuthStore();
  

  const handlePlanSelection = (plan: 'free' | 'professional' | 'enterprise') => {
    updateUserPlan(plan);
    // Don't redirect, just update the plan
  };

  const faqItems = [
    { question: "Can i purchase additional credits?" },
    { question: "Id aliquip laborum nulla ?" },
    { question: "Pariatur incididunt sint voluptate dolor in veniam ?" },
    { question: "Proident ullamco non do sit nisl est dolore ?" },
    { question: "Sit magna excepteur velit fugiat magna deserunt ?" },
    { question: "Anim do deserunt incididunt ad qui aliqui ?" },
    { question: "Veniam fugiat pariatur incididunt excepteur ?" },
    { question: "Nulla incididunt nisl et elit magna ?" },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #F3E8FF 0%, #FFFFFF 100%)",
      }}
    >
      <UpgradeHeader />
      <div className="max-w-6xl mx-auto py-10">
        <div className="text-center mb-7">
          <h1
            className="font-Inter font-bold text-[32px] leading-[100%] text-[#1D2127] mb-2"
            style={{ letterSpacing: "2%" }}
          >
            Purchase a subscription
          </h1>
          <p
            className="font-Inter font-normal text-[20px] leading-[100%] text-[#52575D]"
            style={{ letterSpacing: "2%" }}
          >
            Choose the plan that works for you.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <Tabs
            value={billingPeriod}
            onValueChange={setBillingPeriod}
            className="w-auto"
          >
            <TabsList
              className="grid grid-cols-2 bg-[#FFFFFF] p-1 rounded-[100px] gap-2"
              style={{ width: "316px", height: "47px" }}
            >
              <TabsTrigger
                value="monthly"
                className={`rounded-[100px] border font-Inter text-[16px] leading-[100%] text-center cursor-pointer ${
                  billingPeriod === "monthly"
                    ? "font-bold text-[#FFFFFF]"
                    : "font-normal text-[#1D2127]"
                }`}
                style={{
                  width: "150px",
                  height: "39px",
                  padding: "10px 32px",
                  letterSpacing: "2%",
                  background:
                    billingPeriod === "monthly"
                      ? "linear-gradient(90deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)"
                      : "transparent",
                  boxShadow:
                    billingPeriod === "monthly"
                      ? "0px 1px 2px 0px rgba(10, 13, 18, 0.05)"
                      : "none",
                  color: billingPeriod === "monthly" ? "#FFFFFF" : "#1D2127"
                }}
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className={`rounded-[100px] border font-Inter text-[16px] leading-[100%] text-center cursor-pointer ${
                  billingPeriod === "yearly"
                    ? "font-bold text-[#FFFFFF]"
                    : "font-normal text-[#1D2127]"
                }`}
                style={{
                  width: "150px",
                  height: "39px",
                  padding: "10px 32px",
                  letterSpacing: "2%",
                  background:
                    billingPeriod === "yearly"
                      ? "linear-gradient(90deg, #7000CC 0%, #8000E5 50%, #8E07F8 100%)"
                      : "transparent",
                  boxShadow:
                    billingPeriod === "yearly"
                      ? "0px 1px 2px 0px rgba(10, 13, 18, 0.05)"
                      : "none",
                  color: billingPeriod === "yearly" ? "#FFFFFF" : "#1D2127"
                }}
              >
                Yearly <span className="text-[12px]">-20% off</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <PricingCard
            planType="free"
            title="Free"
            price="$0"
            period="/per month"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
            credits="1000 credits"
            creditsNote="(one time)"
            features={[
              "Lorem ipsum dolor",
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor conset",
              "Lorem ipsum dolor prop",
              "Lorem ipsum dolor"
            ]}
            buttonText={!user?.plan || user?.plan === 'free' ? "Current Plan" : "Get Started"}
            buttonVariant={!user?.plan || user?.plan === 'free' ? "secondary" : "default"}
            onGetStarted={() => handlePlanSelection('free')}
          />

          <PricingCard
            planType="professional"
            title="Professional"
            price="$97"
            period="/per month"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing."
            credits="10,000 credits"
            features={[
              "Lorem ipsum dolor",
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor conset",
              "Lorem ipsum dolor prop",
              "Lorem ipsum dolor"
            ]}
            buttonText={user?.plan === 'professional' ? 'Current Plan' : 'Get Started'}
            buttonVariant={user?.plan === 'professional' ? 'secondary' : 'default'}
            onGetStarted={() => handlePlanSelection('professional')}
          />

          <PricingCard
            planType="enterprise"
            title="Enterprise"
            price="$257"
            period="/per month"
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed."
            credits="100,000 credits"
            features={[
              "Lorem ipsum dolor",
              "Lorem ipsum dolor sit amet",
              "Lorem ipsum dolor conset",
              "Lorem ipsum dolor prop",
              "Lorem ipsum dolor"
            ]}
            buttonText={user?.plan === 'enterprise' ? 'Current Plan' : 'Get Started'}
            buttonVariant={user?.plan === 'enterprise' ? 'secondary' : 'default'}
            onGetStarted={() => handlePlanSelection('enterprise')}
          />
        </div>

        {/* FAQ Section */}
        <FAQSection items={faqItems} />
      </div>
    </div>
  );
}
