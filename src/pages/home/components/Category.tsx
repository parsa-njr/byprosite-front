import React from "react";
import cat1 from "../../../assets/images/categories/Cat1.png";
import cat2 from "../../../assets/images/categories/Cat2.png";
import cat3 from "../../../assets/images/categories/Cat3.png";
import cat4 from "../../../assets/images/categories/Cat4.png";
import cat5 from "../../../assets/images/categories/Cat5.png";
import cat6 from "../../../assets/images/categories/Cat6.png";
import cat7 from "../../../assets/images/categories/Cat7.png";

export default function Categories() {
  const categories = [
    { id: 4, title: "ضایعات الکتریکی/الکترونیکی", img: cat4 },
    { id: 3, title: "ضایعات غیرفلزی", img: cat3 },
    { id: 2, title: "ضایعات فلزی", img: cat2 },
    { id: 1, title: "ضایعات تجهیزات و ماشین آلات", img: cat1 },
    { id: 7, title: "محصولات معدنی غیر استاندارد", img: cat7 },
    { id: 6, title: "محصولات غیرفلزی غیر استاندارد", img: cat6 },
    { id: 5, title: "محصولات فلزی غیر استاندارد", img: cat5 },
  ];

  return (
    <div className="relative w-screen">
      {/* Header */}
      <div
        style={{ marginTop: "-35px" }}
        className="absolute w-[97%] bg-secondary text-white text-center py-4 mr-2 md:mr-5 rounded-b-full shadow-xl"
      >
        <h2 className="text-2xl">دسته بندی کالا ها</h2>
      </div>

      {/* Categories  */}
      <div className="p-6 pt-35">
        <div className="  flex justify-center flex-wrap">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col items-center text-center basis-1/4"
            >
              <div className="w-[170px] h-[170px] mb-3 cursor-pointer">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm font-medium">{cat.title}</span>
            </div>
          ))}
        </div>

        {/* Button at the bottom */}
        {/* <div className="flex justify-end mt-10">
          <button className="px-6 py-3 border-secondary border-3 rounded-full shadow-lg hover:bg-secondary/90 transition ml-12 cursor-pointer">
            مشاهده همه دسته‌بندی‌ها
          </button>
        </div> */}
      </div>
    </div>
  );
}
