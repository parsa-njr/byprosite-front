"use client";

import React, { useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import LargeAdCard from "@/pages/ads/components/LargeAdCard";

export default function AdCardCarousel({ ads }) {
  const [api, setApi] = useState<CarouselApi>();

  return (
    <div className="w-full  mx-auto py-10" dir="rtl">
      <Carousel
        opts={{
          direction: "rtl",
          loop: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {ads.map((ad) => (
            <CarouselItem
              key={ad.id}
              className="
                basis-full 
                sm:basis-1/2 
                md:basis-1/3 
               
                p-2
              "
            >
              <LargeAdCard item={ad} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Controls */}
        <CarouselPrevious
          onClick={() => api?.scrollPrev()}
          className="left-[-1rem] sm:left-[-2rem] cursor-pointer"
        />
        <CarouselNext
          onClick={() => api?.scrollNext()}
          className="right-[-1rem] sm:right-[-2rem] cursor-pointer"
        />
      </Carousel>
    </div>
  );
}
