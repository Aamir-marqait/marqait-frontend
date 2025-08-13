import carousel1 from "../../assets/carousel/1.webp";
import carousel2 from "../../assets/carousel/2.webp";
import carousel3 from "../../assets/carousel/3.webp";
import carousel1Fallback from "../../assets/carousel/1.png";
import carousel2Fallback from "../../assets/carousel/2.png";
import carousel3Fallback from "../../assets/carousel/3.png";

export interface CarouselSlide {
  title: string;
  subtitle: string;
  image: string;
  imageFallback: string;
}

export const carouselSlides: CarouselSlide[] = [
  {
    title: "AI That Works Like Your Best\nMarketer",
    subtitle: "Boost productivity and results with\nintelligent automation.",
    image: carousel1,
    imageFallback: carousel1Fallback,
  },
  {
    title: "One Platform. Endless\nPossibilities.",
    subtitle: "From branding to ads - AI powers every\nstep.",
    image: carousel2,
    imageFallback: carousel2Fallback,
  },
  {
    title: "Power Your Brand with\nIntelligence",
    subtitle: "AI-driven strategies to grow your reach\nand revenue.",
    image: carousel3,
    imageFallback: carousel3Fallback,
  },
];
