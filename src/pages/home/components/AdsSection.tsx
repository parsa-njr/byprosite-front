import { ads } from "@/constants/fakeData";
import LargeAdCard from "@/pages/ads/components/LargeAdCard";
import React from "react";
import SectionHeader from "./SectionHeader";
import { Button } from "@/components/ui/button";
import AdCardCarousel from "./AdCardCarousel";
import HomaPageCarousel from "./HomaPageCarousel";

const AdsSection = () => {
  return (
    <div className="w-screen">
      <SectionHeader
        title={"جدیدترین آگهی های صنعت"}
        seeAllLink={"/ads"}
        textColor={"black"}
        showLink={true}
      />

      {/* Buttons row - responsive */}
      <div className="flex p-7 flex-col sm:flex-row gap-4 my-5">
        <Button
          className="bg-primary h-14 sm:h-16 text-md sm:text-2xl lg:text-3xl rounded-sm flex-1 
          hover:opacity-85 hover:cursor-pointer px-6 py-3"
        >
          سفارش خرید
        </Button>
        <Button
          className=" h-14 sm:h-16 text-md sm:text-2xl lg:text-3xl  flex-1
            text-primary rounded-sm border border-primary bg-white
            hover:opacity-75 hover:text-white hover:cursor-pointer px-6 py-3"
        >
          سفارش فروش
        </Button>
      </div>


      {/* Responsive Carousel */}
      <div className="p-7">
      <HomaPageCarousel ads={ads} />

      </div>
    </div>
  );
};

export default AdsSection;
