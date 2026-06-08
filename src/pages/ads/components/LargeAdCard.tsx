import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LargeAdCard = ({ item }) => {
  return (
    <Card
      key={item.id}
      className="
        overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition rounded-xl
        bg-[#D9D9D9] h-[38rem] w-full lg:w-[85%]
        sm:h-[36rem] lg:h-[38rem] 
      "
    >
      <img
        src={item.image}
        alt={item.title}
        className="
          w-[95%] h-64 sm:h-72 object-cover mx-auto rounded-[0.6rem] rounded-tr-[3rem]
          shadow-sm
        "
      />

      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h3 className="text-2xl sm:text-3xl">{item.title}</h3>
          <div className="flex flex-col text-xs sm:text-sm text-gray-600">
            <span>{item.date}</span>
            <span>
              وضعیت:
              <span className={`mx-1 ${item.statusColor}`}>{item.status}</span>
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 line-clamp-3">{item.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge className="bg-primary cursor-pointer text-white hover:opacity-85">
            مقدار: {item.amount}
          </Badge>
          <Badge className="bg-primary cursor-pointer text-white hover:opacity-85">
            وضعیت: {item.condition}
          </Badge>
          <Badge className="bg-primary cursor-pointer text-white hover:opacity-85">
            {item.brand}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end border-t-2 border-gray-900 p-3 mx-5">
        <Button
          variant="outline"
          className="w-32 border-secondary bg-transparent text-secondary hover:opacity-85"
        >
          مشاهده آگهی
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LargeAdCard;
