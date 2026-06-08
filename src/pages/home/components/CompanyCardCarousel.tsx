"use client";

// "use client";

// import React, { useState } from "react";
// import {
//   Carousel,
//   CarouselApi,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import CompanyCard from "./CompanyCart";

// export default function CompanyCardCarousel({ companies }) {
//   const [api, setApi] = useState<CarouselApi>();

//   return (
//     <div className="w-full  mx-auto py-10" dir="rtl">
//       <Carousel
//         opts={{
//           direction: "rtl",
//           loop: true,
//         }}
//         setApi={setApi}
//         className="w-full"
//       >
//         <CarouselContent>
//           {companies.map((company) => (
//             <CarouselItem
//               key={company.id}
//               className="
//                 basis-full 
//                 sm:basis-1/2 
//                 md:basis-1/3 
               
//                 p-2
//               "
//             >
//               <CompanyCard item={company} />
//             </CarouselItem>
//           ))}
//         </CarouselContent>

//         {/* Controls */}
//         <CarouselPrevious
//           onClick={() => api?.scrollPrev()}
//           className="left-[-1rem] sm:left-[-2rem] cursor-pointer"
//         />
//         <CarouselNext
//           onClick={() => api?.scrollNext()}
//           className="right-[-1rem] sm:right-[-2rem] cursor-pointer"
//         />
//       </Carousel>
//     </div>
//   );
// }

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import LargeAdCard from "@/pages/ads/components/LargeAdCard";
import CompanyCard from "./CompanyCart";

// Same blogPosts array as above...

const blogPosts = [
  {
    id: 1,
    title: "چه کاغذ هایی توی چاپخونه بیشتر استفاده میشه؟",
    category: "دسته بندی",
    date: "23 بهمن ماه 1402",
    excerpt:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.",
    image: "/images/product.webp",
    slug: "single-blog",
  },
  {
    id: 2,
    title: "چه کاغذ هایی توی چاپخونه بیشتر استفاده میشه؟",
    category: "دسته بندی",
    date: "23 بهمن ماه 1402",
    excerpt:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.",
    image: "/images/product.webp",
    slug: "single-blog",
  },
  {
    id: 3,
    title: "چه کاغذ هایی توی چاپخونه بیشتر استفاده میشه؟",
    category: "دسته بندی",
    date: "23 بهمن ماه 1402",
    excerpt:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.",
    image: "/images/product.webp",
    slug: "single-blog",
  },
  {
    id: 4,
    title: "چه کاغذ هایی توی چاپخونه بیشتر استفاده میشه؟",
    category: "دسته بندی",
    date: "23 بهمن ماه 1402",
    excerpt:
      "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.",
    image: "/images/product.webp",
    slug: "single-blog",
  },
];
const CompanyCardCarousel = ({companies}) => {
  return (
<section className="pt-10">
      <div className=" mb-0 mb-lg-5 pb-10">
      

        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true, }}
          //   navigation
          autoplay={{
            delay: 2000, // 3 seconds delay between transitions
            disableOnInteraction: false, // Continue autoplay even when user interacts with swiper
            pauseOnMouseEnter: true, // Pause autoplay when mouse enters the slider
          }}
          loop={true} // Enable infinite loop
          speed={800} // Transition speed in ms
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          
//            style={{
//     "--swiper-pagination-bottom": "-25px", // 👈 moves pagination lower
//   }}
          className="!pb-16"
        >

            {companies.map((company) => (
            <SwiperSlide
              key={company.id}
            //   className="
            //     w-full 
            //     sm:w-[30%]
            //     lg:w-[30%]
            //     flex-shrink-0
                
              
            >
              <div className="p-2 w-full">
 <CompanyCard item={company} />              </div>
            </SwiperSlide>
          ))}
        
        </Swiper>
      </div>
    </section>  )
}

export default CompanyCardCarousel
