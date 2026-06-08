import React from "react";
import { Card, CardContent } from "@/components/ui/card"; // ✅ relative import
import { Button } from "@/components/ui/button"; // ✅ relative import
import { ChevronLeft, ChevronRight } from "lucide-react";

// ✅ Import your images via relative paths
import sliderImg1 from "@/assets/images/slider/warehouse-5635000.jpg";
import sliderImg2 from "@/assets/images/slider/steel-pipes-6967964.jpg";
import sliderImg3 from "@/assets/images/slider/factory-1140760.jpg";

import imageSrc1 from "@/assets/images/slider/silos-8253284.jpg";
import imageSr2 from "@/assets/images/slider/steel-shelf-5112714.jpg";

const soildImages = [imageSrc1, imageSr2];
const sliderImages = [sliderImg1, sliderImg2, sliderImg3];

export default function SliderSection() {
  const [current, setCurrent] = React.useState(0);

  const [fade, setFade] = React.useState(false);

  const prev = () => {
    setFade(true);
    setTimeout(() => {
      setCurrent((i) => (i === 0 ? sliderImages.length - 1 : i - 1));
      setFade(false);
    }, 200); // fade duration
  };

  const next = () => {
    setFade(true);
    setTimeout(() => {
      setCurrent((i) => (i === sliderImages.length - 1 ? 0 : i + 1));
      setFade(false);
    }, 200);
  };

  return (
    <div className="w-screen p-7 grid grid-cols-1 md:grid-cols-[52%_38%] gap-9 items-stretch justify-center">
      {/* Right column: bigger slider */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg h-[600px]">
        <img
          src={sliderImages[current]}
          alt="slider"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            fade ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Controls */}
        <div className="absolute bottom-6 right-6 flex gap-2">
          <Button
            className="rounded-full bg-blue-900 text-white hover:bg-blue-800 h-11 w-11"
            onClick={prev}
            aria-label="Previous"
          >
            
            <ChevronRight />
          </Button>
          <Button
            className="rounded-full bg-blue-900 text-white hover:bg-blue-800 h-11 w-11"
            onClick={next}
            aria-label="Next"
          >
            <ChevronLeft />
          </Button>
        </div>
      </div>

      {/* Left column: narrower stacked cards */}
      <div className="flex flex-col gap-6">
        <Card className="relative overflow-hidden rounded-2xl shadow-lg h-[290px]">
          <img
            src={soildImages[0]}
            alt="industry"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <CardContent className="absolute inset-0 bg-black/45 flex items-center justify-center text-center p-6">
            <p className="text-white text-base md:text-lg font-semibold leading-loose">
              بیش از 500 آگهی فعال با کاربردهای متعدد منتظر کسب و کار شماست در
              این صنعت
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden rounded-2xl shadow-lg h-[290px]">
          <img
            src={soildImages[1]}
            alt="customers"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <CardContent className="absolute inset-0 bg-black/45 flex items-center justify-center text-center p-6">
            <p className="text-white text-base md:text-lg font-semibold leading-loose">
              بیش از 120 مشتری حقیقی و حقوقی قابل اطمینان در زمینه خرید و فروش
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
