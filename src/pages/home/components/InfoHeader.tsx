export default function InfoHeader() {
  const statistics = [
    { value: "500+", label: "آگهی", left: "5%" },
    { value: "120+", label: "مشتری فعال", left: "30%" },
    { value: "100+", label: "معامله در روز", left: "55%" },
    { value: "25+", label: "استان فعال", left: "80%" },
  ];

  return (
    <div className="relative w-full h-auto min-h-[300px] lg:h-[493px]">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-[180px] md:h-[220px] lg:h-[281px] bg-[#14426b] rounded-r-[50px] md:rounded-r-[100px] lg:rounded-r-[150px]" />

      {/* Circular elements - Hidden on mobile, visible on larger screens */}
      <div className="hidden md:block absolute bottom-90 left-[15%] w-[150px] h-[140px] lg:w-[245px] lg:h-[225px] flex items-center justify-center rounded-full border border-white/20">
        <div className="w-[100px] h-[90px] lg:w-[175px] lg:h-[152px] rounded-full border-2 border-white/20" />
      </div>

      <div className="hidden md:block absolute top-[200px] md:top-[250px] lg:top-[322px] left-[70%] lg:left-[73%] w-[120px] h-[100px] lg:w-[202px] lg:h-[171px] flex items-center justify-center rounded-full border border-white/20">
        <div className="w-[80px] h-[70px] lg:w-[144px] lg:h-[116px] rounded-full border-2 border-white/20" />
      </div>

      {/* Statistics */}
      <div className="relative z-10 pt-8 pb-16 md:py-20 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
        {statistics.map((stat, index) => (
          <div
            key={index}
            className="text-white text-center md:text-left"
          >
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[64px] font-normal">
              {stat.value}
            </div>
            <div className="text-sm sm:text-base md:text-xl lg:text-[32px] mt-1 md:mt-2 font-normal">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Circular elements - Hidden on mobile, visible on larger screens */}
      <div className="hidden md:block absolute bottom-15 right-[15%] h-[150px] w-[140px] lg:h-[245px] lg:w-[225px] flex items-center justify-center rounded-full border border-white/20">
        <div className="w-[100px] h-[90px] lg:w-[175px] lg:h-[152px] rounded-full border-2 border-white/20" />
      </div>
    </div>
  );
}