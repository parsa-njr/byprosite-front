import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#14426b] mt-2 p-10 md:py-4 rounded-t-full ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 mt-4">
        {/* Left text */}
        <div className="text-white text-base md:text-lg text-center md:text-left">
          تمامی حقوق مادی و معنوی سایت متعلق به بای پرو می باشد.
        </div>

        {/* Right text with link */}
        <div className="mt-2 md:mt-0 text-white text-base md:text-lg text-center md:text-right">
          <span>1404 – </span>
          <a
            // href="https://noghtehco.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300 transition-colors"
          >
            طراحی و پشتیبانی وب سایت
          </a>
          <span> توسط شرکت تبلیغاتی ...</span>
        </div>
      </div>
    </footer>
  );
}
