import { useState, useEffect } from "react";
import { carouselSlides } from "./carouselData";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex w-full h-64 sm:h-80 lg:h-auto lg:w-2/5 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.8) 100%)",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselSlides.map((slide, index) => (
            <div key={index} className="min-w-full h-full relative">
              <img
                src={slide.image}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = slide.imageFallback;
                }}
                alt={`Carousel slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-20 flex flex-col justify-end p-6 sm:p-8 lg:p-12 text-white">
        <div className="mb-8">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselSlides.map((slide, index) => (
                <div key={index} className="min-w-full">
                  <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-medium leading-[120%] tracking-[-0.05em] mb-4 font-inter whitespace-pre-line">
                    {slide.title}
                  </h1>
                  <p className="text-base font-normal leading-[154%] tracking-[-0.04em] font-inter text-[#FAFAFA]">
                    {slide.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 justify-start">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide ? "w-8 bg-white" : "w-6 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;