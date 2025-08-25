import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supportCards } from "@/data/supportCards";

export function SupportGrid() {
  const navigate = useNavigate();

  const handleCardClick = (cardId: string) => {
    navigate(`/help-support/${cardId}`);
  };

  return (
    <section className="py-10 ">
      <div className="max-w-[95rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {supportCards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className="bg-[#FFFFFF] flex flex-col gap-3 rounded-lg border border-[#DCDFE1] p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer group"
            >
              <h3 className="font-bold text-[20px] leading-[100%] tracking-[0%] text-[#21242A] font-[Inter] mb-3">
                {card.title}
              </h3>
              <p className="font-normal text-[16px] leading-[100%] tracking-[0%] text-[#333D44] font-[Inter] mb-6">
                {card.description}
              </p>
              <div className="flex justify-start">
                <ArrowUpRight className="w-5 h-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
