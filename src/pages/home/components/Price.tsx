import React from "react";

const prices = [
  { title: "آهن درجه یک", price1: "18.180", price2: "15.180" },
  { title: "آهن درجه یک", price1: "18.180", price2: "15.180" },
  { title: "آهن درجه یک", price1: "18.180", price2: "15.180" },
  { title: "آهن درجه یک", price1: "18.180", price2: "15.180" },
  { title: "آهن درجه یک", price1: "18.180", price2: "15.180" },
  { title: "آهن درجه یک", price1: "18.180", price2: "15.180" },
];

export default function DailyPrices() {
  return (
    <div className="p-7 w-screen">
      {/* Header */}
      <h2 className="text-lg font-semibold mb-4 p-2 bg-gray-100 rounded flex items-center">
        قیمت های به روز &lt;&lt;
      </h2>

      {/* Prices grid */}
      <div className="max-w-[109rem] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {prices.map((item, index) => (
          <div
            key={index}
            className="text-white rounded-lg shadow-lg hover:scale-105 transform transition duration-300"
          >
            <div
              style={{ backgroundColor: "#14426B" }}
              className="text-center py-2 border-b border-black font-medium rounded-t-lg"
            >
              {item.title}
            </div>
            <div className="text-center text-black py-2 border-b border-black">
              {item.price1}
            </div>
            <div className="text-center text-black py-2">{item.price2}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
