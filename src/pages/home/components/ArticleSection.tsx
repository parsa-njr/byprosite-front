import SectionHeader from "./SectionHeader";
import ArticleCard from "./ArticleCard";
import { articles } from "@/constants/fakeData";
export default function ArticleSection() {
  return (
    <div>
      <SectionHeader
        title={"آخرین اخبار و مقالات"}
        seeAllLink={"/articles"}
        showLink={true}
        textColor={"black"}
      />
      <div className="p-7">
        <ArticleCard articles={articles} />
      </div>
    </div>
  );
}
