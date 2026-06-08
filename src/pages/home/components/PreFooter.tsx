import React from "react";
import zobAhan1 from "@/assets/images/partners/Esfahan-Steel-Compony-Logo-450x450.png";
import IconBox from "./IconBox";
const footerSections = [
  {
    title: "دسترسی سریع",
    links: [
      "صفحه اصلی",
      "مشاهده آگهی ها",
      "ثبت آگهی جدید",
      "قیمت روز ضایعات",
      "سوالات متداول",
    ],
  },
  {
    title: "خدمات مشتریان",
    links: [
      "راهنمای خرید و فروش",
      "پشتیبانی تلفنی",
      "پیگیری سفارشات",
      "گزارش مشکلات سایت",
      "نظرات و پیشنهادات",
    ],
  },
  {
    title: "حمایت از محیط زیست",
    links: [
      "گزارش سالانه بازیافت",
      "پروژه های سبز",
      "همکاری با سازمان ها",
      "آموزش بازیافت",
      "سهم شما در محیط زیست",
    ],
  },
  {
    title: "اطلاعات حقوقی",
    links: [
      "حریم خصوصی",
      "شرایط استفاده",
      "سیاست بازگردانی",
      "قوانین ثبت آگهی",
      "مسئولیت های حقوقی",
    ],
  },
];

export default function PreFooter() {
  return (
    <footer className="relative w-full bg-[#14426b] text-white pt-20 pb-40 mt-20">
      {/* Background Image */}

      {/* Center Circle */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[190px] h-[190px] rounded-full  shadow-lg flex items-center justify-center ">
        <IconBox />
      </div>

      {/* Columns */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-8 px-4 mt-40">
        {footerSections.map((section, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center md:items-start text-center md:text-left"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              {section.title}
            </h3>
            <div className="h-0.5 w-16 bg-white mb-4" />
            {section.links.map((link, linkIdx) => (
              <span
                key={linkIdx}
                className="text-base md:text-lg block mb-2 hover:text-gray-300 cursor-pointer"
              >
                {link}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Optional bottom line / decoration */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-white rounded-full" />
    </footer>
  );
}
