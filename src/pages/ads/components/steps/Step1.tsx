import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CircleQuestionMark, ShieldCheck } from "lucide-react";
import StepHeader from "../StepHeader";

const Step1 = ({ goNext }) => {
  const [isChecked, setIsChecked] = useState(false);

  // Long text content (not an array)
  const contentText = `
   با ثبت این آگهی، من تایید می‌کنم که:
a)	محتوای آگهی صادق، کامل و دقیق است و هیچ‌گونه اطلاعات گمراه‌کننده یا جعلی ارائه نکرده‌ام.
b)	کالای آگهی‌شده قانونی است و کلیه مجوزها و اسناد لازم (در صورت مورد نیاز برای نوع کالا) را دارم.
c)	مسئولیت هرگونه جریمه، خسارت، دعوی حقوقی، یا هزینه‌های قانونی ناشی از این آگهی یا کالای ارائه‌شده بر عهدهٔ من است و من پلتفرم را از هرگونه خسارت و دعاوی (از جمله هزینه‌های وکالت و جبران زیان) کاملاً معاف و بی‌نیاز می‌کنم.
d)	پلتفرم مجاز است در هر زمان این آگهی را بدون اعلام قبلی رد، ویرایش یا حذف کند.

  `;

  return (
    <div className="rtl flex flex-col space-y-6 text-right px-4 sm:px-6 lg:px-12 py-6">
      {/* Header */}
      <StepHeader
        title="تایید اطلاعات"
        description="لطفا موارد زیر را به دقت مطالعه نمایید"
        icon={<CircleQuestionMark className="h-8 w-8 text-primary" />}
      />

      {/* Content Card */}
      <div className="bg-slate-50 p-4 sm:p-6 rounded-lg border">
        <div className="prose prose-sm max-w-none text-justify text-gray-700 leading-relaxed text-sm sm:text-base">
          {/* {contentText} */}
          {/* If you want paragraph separation instead of raw text: */}
          {contentText.split("\n").map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ) : null
          )}
        </div>

        {/* Checkbox Row */}
        <div className="flex  sm:flex-row sm:items-center gap-3 border-t pt-4 sm:pt-6 mt-6">
          <Checkbox
            id="terms"
            checked={isChecked}
            onCheckedChange={(checked) => setIsChecked(checked === true)}
            className="h-5 w-5 border-2 border-gray-600 data-[state=checked]:bg-gray-700 data-[state=checked]:border-gray-700"
          />
          <Label
            htmlFor="terms"
            className="text-sm font-normal leading-none cursor-pointer text-gray-700"
          >
            من اصول بالا را خواندم و قبول دارم.
          </Label>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
        <div />
        <Button
          onClick={goNext}
          disabled={!isChecked}
          className="w-full sm:w-auto px-8 py-2 text-base"
        >
          ادامه
        </Button>
      </div>
    </div>
  );
};

export default Step1;
