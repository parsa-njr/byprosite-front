import SectionHeader from "./SectionHeader";
import AdCardCarousel from "./AdCardCarousel";
import { ads } from "@/constants/fakeData";
import HomaPageCarousel from "./HomaPageCarousel";
export default function SuggestionSection() {
  return (
    <div className="px-4 sm:px-6 md:px-10 w-screen">
      <SectionHeader
        seeAllLink={"/suggestions"}
        showLink={true}
        title={"پیشنهاد مابرای شما"}
        textColor={"black"}
      />
      <HomaPageCarousel ads={ads} />

    </div>
  );
}
