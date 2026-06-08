import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, Heart } from "lucide-react";
import React from "react";

export default function ArticleCard({ articles }) {
  return (
   <div className="grid grid-cols-1 sm:grid-cols-2  gap-8 px-4  py-6">
  {articles.map((article, index) => (
    <Card
      key={index}
      className="
        w-full mx-auto bg-[#d9d9d9] rounded-[10px] border-0 
        shadow-md hover:shadow-lg transition-shadow duration-300
      "
    >
      <CardContent className="p-4">
        <div
          className="
            flex flex-col lg:flex-row gap-5 [direction:rtl]
            items-start md:items-stretch
          "
        >
          {/* Image section */}
          <div className="w-full lg:w-[45%]  flex-shrink-0">
            <div className="aspect-[16/9] w-full overflow-hidden rounded-tr-4xl">
              <img
                className="w-full h-full object-cover"
                alt={article.title}
                src={article.image}
              />
            </div>

            {/* Meta info (views, likes, date) */}
            <div className="flex items-center justify-center mt-3">
              <div className="flex items-center gap-6 text-[#000000e6] text-xs sm:text-sm font-normal">
                <div className="flex items-center gap-1">
                  <span>{article.views}</span>
                  <Eye className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-1">
                  <span>{article.likes}</span>
                  <Heart className="w-4 h-4" />
                </div>
                <span>{article.date}</span>
              </div>
            </div>
          </div>

          {/* Text section */}
          <div className="flex-1 flex flex-col justify-between w-full">
            <div>
              <h2
                className="
                  text-black text-lg sm:text-xl font-semibold mb-3 leading-tight
                "
              >
                {article.title}
              </h2>
              <p
                className="
                  text-[#000000b2] text-sm sm:text-base text-justify mb-4 leading-5
                "
              >
                {article.description}
              </p>
            </div>

            <Separator className="bg-black/30 h-[2px] mb-3" />

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="
                  h-[30px] sm:h-[34px] px-4 rounded-md 
                  border-[#5ba95d] text-[#5ba95d] 
                  text-xs sm:text-[13px] font-normal 
                  bg-transparent hover:bg-[#5ba95d]/10
                "
              >
                مشاهده مقاله
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

  );
}
