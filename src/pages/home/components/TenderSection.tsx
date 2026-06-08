import React from "react";
import SectionHeader from "./SectionHeader";
import AdCardCarousel from "./AdCardCarousel";
import { tenders } from "@/constants/fakeData";
import IconBox from "./IconBox";
import HomaPageCarousel from "./HomaPageCarousel";

export default function TenderSection() {
  return (
    <div className="relative">
      {/* @ts-ignore */}
      <SectionHeader
        title={"شرکت در مزایده و مناقصه"}
        seeAllLink={"/tenders"}
      />

      {/* Avatar overlapping the section */}
      <div className="relative flex justify-center">
        <div className="absolute z-20 -bottom-[95px]">
          <IconBox />
        </div>
      </div>

      <section className="w-full min-h-[730px] bg-[#14426b] relative z-10  pt-[120px]">
        <div className="p-7 w-screen">
          {/* <AdCardCarousel ads={tenders} /> */}
      <HomaPageCarousel ads={tenders} />
        </div>
        <div className="p-7">

      {/* <AdCardCarousel ads={ads} /> */}
      </div>
      </section>
    </div>
  );
}
