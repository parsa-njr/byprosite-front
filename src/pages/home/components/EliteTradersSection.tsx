import SectionHeader from "./SectionHeader";
import CompanyCardCarousel from "./CompanyCardCarousel";
import { companies } from "@/constants/fakeData";

export default function EliteTradersSection() {
  return (
    <div>
      <section className="w-full min-h-[730px] bg-[#14426b] relative   rounded-tr-4xl">
        <SectionHeader
          title={"معرفی برترین فروشندگان و خریداران"}
          seeAllLink={"/elite-traders"}
          showLink={false}
          textColor={"white"}
        />
        <div className="px-4 sm:px-6 md:px-10 w-screen ">
          <CompanyCardCarousel companies={companies} />
        </div>
      </section>
    </div>
  );
}
