// HeroSection.jsx
import mainPageSvg from "../../../assets/images/HeroBg.jpg";
import HeroContent from "./HeroContent";

const HeroSection = () => {
  return (
    <div
      className="relative w-screen min-h-[500px] sm:min-h-[600px] md:min-h-[750px] lg:min-h-[900px] 
      pt-4 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${mainPageSvg})` }}
    >
      <HeroContent />
    </div>
  );
};

export default HeroSection;
