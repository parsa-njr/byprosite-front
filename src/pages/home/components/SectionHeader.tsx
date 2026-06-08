import { ArrowLeft, ChevronLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const SectionHeader = ({ title, seeAllLink, textColor, showLink }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between item-center p-10">
      <div
        style={{ color: `${textColor}` }}
        className="border-r-8 basis-full md:basis-1/2 my-10 p-5 leading-10 sm:leading-20 border-primary font-semibold sm:font-normal text-xl sm:text-5xl "
      >
        {title}
      </div>
      <div className="flex  justify-center md:justify-end  items-center basis-full md:basis-1/2 ">
        {showLink && (
          <>
            <div className="">
              <button className="px-6  flex items-center py-3 border-secondary border-3 rounded-full shadow-lg hover:bg-secondary/90 transition ml-12 cursor-pointer">
                <Link
                  className=" text-primary text-md sm:text-xl"
                  to={seeAllLink || "/"}
                >
                  مشاهده همه
                </Link>
                <ChevronLeft className="text-primary  " />{" "}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
