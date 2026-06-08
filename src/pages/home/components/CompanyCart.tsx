import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function CompanyCart({ item }) {
  return (
    <div className="flex items-center justify-center w-full h-full p-4">
      <Card className="w-full max-w-[388px] bg-[#215a8d66] rounded-[10px_100px_10px_10px] border-2 border-dashed border-[#627bc6] shadow-[0px_4px_100px_#00000040]">
        <CardContent className="p-5 flex flex-col gap-2">
          <img
            className="w-full h-[376px] object-cover rounded-tr-4xl"
            alt="Company facility"
            src={item.image}
          />

          <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xl  font-normal text-white tracking-[0] leading-normal ">
                {item.name}
              </h2>
              <Badge className=" text-white text-sm h-auto px-2 py-1 font-normal">
                {item.sellerBadge}
              </Badge>
            </div>

            <div className="flex justify-start">
              <div className="text-base   text-white tracking-[0] leading-normal [direction:rtl] text-right">
                عضویت از {item.membershipYear}
                <br />+{item.salesCount} فروش ثبت شده
                <br />+{item.recycledTons} تن ضایعات بازیافتی
              </div>
            </div>
          </div>

          <Separator className="bg-white/50 my-4" />

          <div className="flex justify-end">
            <div className="bg-white rounded-[5px] px-2 py-1 inline-block">
              <Button className="text-[11px] text-black  font-normal tracking-[0] leading-normal bg-white  ">
                مشاهده پروفایل
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
