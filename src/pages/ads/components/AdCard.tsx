import { Card, CardContent } from "@/components/ui/card";

import { API_BASE_URL } from "@/api/axiosClient";

import bgSamp from "../../../assets/images/bgSamp.png";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
const AdCard = ({ item, onChildCardClick }) => {
  return (
    <Card
      key={item.id}
      onClick={() => onChildCardClick?.(item)}
      className="overflow-hidden h-48 border border-gray-200
               shadow-sm hover:shadow-lg transition rounded-xl 
               cursor-pointer"
    >
      <CardContent className="px-4 flex justify-between items-center">
        <div className="flex justify-between flex-col h-full w-1/2 p-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <h3
              className="text-lg text-gray-600 line-clamp-3 cursor-pointer"
              title={item.title}
            >
              {item.title}
            </h3>
          </TooltipTrigger>
          <TooltipContent className="max-w-sm   whitespace-pre-wrap break-words text-center leading-relaxed">
            <p>{item.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

        <img
          src={
            item?.mainImageUrl
              ? `${API_BASE_URL}/${item?.mainImageUrl}`
              : bgSamp
          }
          alt={item.title}
          className="w-1/2 h-36 shadow-sm object-cover  rounded-sm"
        />
      </CardContent>
    </Card>
  );
};

export default AdCard;
