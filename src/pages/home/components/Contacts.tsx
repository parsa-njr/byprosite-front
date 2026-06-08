import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";

export default function Contacts() {
  return (
    <div className="pb-8">
      {/* Outer wrapper */}
      <div className="w-full flex justify-center lg:justify-end py-12 mb-10 relative">
        {/* Desktop Layout */}
        <div className="hidden xl:block relative">
          {/* Left Gray Panel */}
          <div className="relative w-[928px] h-[621px] bg-[#d9d9d9bf] rounded-[0_100px_100px_0]">
            {/* Header */}
            <div className="absolute top-8 left-[487px] flex gap-[9.5px]">
              <div className="text-black text-[40px] font-normal [direction:rtl]">
                ارتباط با ما
              </div>
              <div className="w-[5px] h-[57px] bg-black" />
            </div>

            {/* Subtext */}
            <div className="absolute top-[248px] left-0 w-[670px] px-8 text-black text-[32px] font-normal [direction:rtl] leading-normal">
              ما همیشه آماده‌ی شنیدن صدای شما هستیم.<br />
              سوال، پیشنهاد یا درخواست خود را از طریق فرم<br />
              یا راه‌های ارتباطی برای ما ارسال کنید<br />
              تا در سریع‌ترین زمان پاسخ دهیم.
            </div>

            {/* Button */}
            <Button
              className="absolute top-[483px] left-[238px] w-[451px] h-[90px] bg-[#fefffe] rounded-[50px] hover:bg-[#fefffe]/90 text-black text-4xl font-normal flex items-center justify-center [direction:rtl]"
              variant="secondary"
            >
              <span className="mr-auto">مشاهده‌ی همه نظرات</span>
              <div className="w-[50px] h-[45px] flex items-center justify-center bg-[#183768] rounded-full ml-4">
                <ChevronLeft className="w-8 h-8 text-white" />
              </div>
            </Button>
          </div>

          {/* Right Form Card */}
          <div className="absolute top-[58px] left-[146px] w-[1229px] h-[515px] flex gap-[47px]">
            <Card className="w-[664px] h-[514px] bg-[#14426b] rounded-[100px] border-0">
              <CardContent className="p-0 relative w-full h-full">
                {/* Name */}
                <div className="absolute w-[512px] h-[57px] top-[60px] left-[72px] bg-[#b9b9b930] rounded-[52px]">
                  <Input
                    placeholder="نام خود را وارد کنید"
                    className="w-full h-full text-white text-xl rounded-xl border-0 px-4 placeholder-white"
                  />
                </div>

                {/* Email */}
                <div className="absolute w-[512px] h-[57px] top-[147px] left-[72px] bg-[#b9b9b966] rounded-[50px] opacity-50">
                  <Input
                    placeholder="ایمیل یا شماره تلفن"
                    className="w-full h-full bg-[#35597a] text-white text-xl rounded-xl border-0 px-4 placeholder-white"
                  />
                </div>

                {/* Message */}
                <div className="absolute w-[512px] h-[141px] top-[233px] left-[72px] bg-[#35597a] rounded-[50px] opacity-50">
                  <Textarea
                    placeholder="متن پیام"
                    className="w-full h-full bg-[#35597a] text-white text-xl rounded-xl border-0 px-4 py-4 placeholder-white resize-none"
                  />
                </div>

                {/* Submit Button */}
                <Button className="absolute top-[410px] left-[72px] w-[142px] h-11 bg-[#d9d9d9] rounded-[50px] text-[#132c42] text-2xl hover:bg-[#d9d9d9]/90">
                  ارسال پیام
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- Mobile & Tablet Layout --- */}
        <div className="flex flex-col xl:hidden w-full px-4 sm:px-8 gap-8">
          <div className="bg-[#d9d9d9bf] rounded-[40px] p-6 text-right">
            <h2 className="text-3xl font-normal text-black mb-4 flex flex-row-reverse items-center justify-end gap-3">
              ارتباط با ما <span className="block w-1 bg-black h-8" />
            </h2>
            <p className="text-base sm:text-lg text-black leading-relaxed mb-6">
              ما همیشه آماده‌ی شنیدن صدای شما هستیم.
              <br />
              سوال، پیشنهاد یا درخواست خود را از طریق فرم
              <br />
              یا راه‌های ارتباطی برای ما ارسال کنید
              <br />
              تا در سریع‌ترین زمان پاسخ دهیم.
            </p>
            <Button className="w-full bg-[#fefffe] rounded-[50px] hover:bg-[#fefffe]/90 text-black text-lg sm:text-xl py-3 flex items-center justify-center gap-3">
              مشاهده‌ی همه نظرات
              <div className="w-[40px] h-[40px] flex items-center justify-center bg-[#183768] rounded-full">
                <ChevronLeft className="w-6 h-6 text-white" />
              </div>
            </Button>
          </div>

          <Card className="bg-[#14426b] text-white rounded-[40px] border-0">
            <CardContent className="p-6 flex flex-col gap-4">
              <Input
                placeholder="نام خود را وارد کنید"
                className="bg-[#35597a]/50 text-white text-base sm:text-lg rounded-[40px] border-0 px-4 py-3 placeholder-white"
              />
              <Input
                placeholder="ایمیل یا شماره تلفن"
                className="bg-[#35597a]/70 text-white text-base sm:text-lg rounded-[40px] border-0 px-4 py-3 placeholder-white"
              />
              <Textarea
                placeholder="متن پیام"
                className="bg-[#35597a]/80 text-white text-base sm:text-lg rounded-[40px] border-0 px-4 py-3 placeholder-white min-h-[100px]"
              />
              <Button className="self-end bg-[#d9d9d9] rounded-[50px] text-[#132c42] text-base sm:text-lg px-6 py-2 hover:bg-[#d9d9d9]/90">
                ارسال پیام
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
