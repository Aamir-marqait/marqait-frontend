import { Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CommunityContact() {
  return (
    <section className="py-16 -mt-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Join Our Community Card */}
          <div className="bg-[#FFFFFF] rounded-lg border border-[#DCDFE1] p-8 shadow-sm">
            <div className="mb-6">
              <Users className="w-12 h-12 text-gray-800 mb-4" />
              <h2 className="font-bold text-[24px] leading-[100%] tracking-[0%] text-[#21242A] font-[Inter] mb-4">
                Join Our Community
              </h2>
              <p className="font-normal text-[16px] leading-[150%] tracking-[0%] text-[#333D44] font-[Inter]">
                Discuss feature requests, ask questions, get help and connect
                with others in the Marqait community.
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-[#FFFFFF] border border-[#8F00FF] shadow-[0px_1px_2px_0px_#0A0D120D] font-medium text-[16px] leading-[24px] tracking-[0%] text-[#8F00FF] font-[Inter] hover:bg-purple-50 cursor-pointer"
            >
              Go To Community
            </Button>
          </div>

          {/* Talk to Us Card */}
          <div className="bg-[#FFFFFF] rounded-lg border border-[#DCDFE1] p-8 shadow-sm">
            <div className="mb-6">
              <MessageCircle className="w-12 h-12 text-gray-800 mb-4" />
              <h2 className="font-bold text-[24px] leading-[100%] tracking-[0%] text-[#21242A] font-[Inter] mb-4">
                Talk to Us
              </h2>
              <p className="font-normal text-[16px] leading-[150%] tracking-[0%] text-[#333D44] font-[Inter]">
                Discuss feature requests, ask questions, get help and connect
                with others in the Marqait community.
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-[#FFFFFF] border border-[#8F00FF] shadow-[0px_1px_2px_0px_#0A0D120D] font-medium text-[16px] leading-[24px] tracking-[0%] text-[#8F00FF] font-[Inter] hover:bg-purple-50 cursor-pointer"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
