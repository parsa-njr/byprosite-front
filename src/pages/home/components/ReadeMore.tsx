import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import readeMore from "@/assets/images/recy.jpg";

export default function ReadeMore() {
  return (
    <div className="relative w-full">
      {/* Background Image */}
      <div
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[700px] bg-cover bg-center"
        style={{ backgroundImage: `url(${readeMore})` }}
      />
      
      {/* Content Section */}
      <div className="relative">
        {/* Overlay section */}
        <section className="w-full bg-[#14426b] rounded-[0px_50px_0px_0px] sm:rounded-[0px_75px_0px_0px] lg:rounded-[0px_100px_0px_0px] -mt-20 sm:-mt-32 lg:-mt-48">
          <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-20">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12">
              {/* Vertical line - Hidden on mobile */}
              <div className="hidden lg:block w-1 h-32 bg-white flex-shrink-0" />
              
              {/* Content */}
              <div className="flex-1 text-center lg:text-right">
                {/* Title */}
                <h2 className="font-inter text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[64px] leading-tight font-normal mb-4 lg:mb-6">
                  درباره ما
                  <br />
                  بیشتر بدانید
                </h2>
                
                {/* Description */}
                <p className="font-abeezee text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-justify lg:text-right leading-relaxed max-w-4xl mx-auto lg:mx-0">
                  مرکز خرید و فروش انواع ضایعات آهن، آلومینیوم، استیل، مس چدن، برنج،
                  سیم و کابل، تیرآهن، میلگرد، نبشی،لوله، ورق، مفرخ،کاغذ باطله و کلیه
                  ضایعات فلزی شرکت‌ها، ساختمانی و صنعتی با بالاترین قیمت
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Button */}
        <div className="container mx-auto px-4 -mt-8 lg:-mt-12">
          <Button className="w-full max-w-[300px] sm:max-w-[350px] lg:w-96 h-12 sm:h-14 lg:h-[50px] bg-[#d9d9d9] rounded-lg hover:bg-[#c9c9c9] font-inter text-black text-sm sm:text-base lg:text-xl font-normal mx-auto block lg:ml-6">
            عضویت در گردشگری زیست محیطی
          </Button>
        </div>
      </div>
    </div>
  );
}