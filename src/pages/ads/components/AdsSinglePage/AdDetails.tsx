import React from "react";
import moment from "moment-jalaali";
import { useEffect } from "react";
const currencyUnit: Record<number, string> = {
  0: "ریال",
  1: "دلار",
  2: "درهم",
  3: "یورو",
};

type AdType = {
  priceOfUnit: string;
  currencyUnit: number;
  allowedQuantityForOrder: number;
  advertismentAmount: number;
  answeringPhone: string;
  itemId: string;
  status?: string;
  CreatedAt: string;
  UpdatedAt: string;
};

type AdDetailsProps = {
  ad: AdType;
};

const Detail = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex justify-between bg-gray-50 dark:bg-gray-900 rounded-xl px-3 py-2">
    <span className="font-semibold text-gray-900 dark:text-gray-100">
      {label}:
    </span>
    <span className="text-gray-600 dark:text-gray-300">{children}</span>
  </div>
);

export default function AdDetails({ ad }: AdDetailsProps) {
  const details = [
    {
      label: "قیمت واحد",
      value: `${ad.priceOfUnit} ${
        currencyUnit[ad.currencyUnit as keyof typeof currencyUnit]
      }`,
    },
    { label: "تعداد مجاز سفارش", value: ad.allowedQuantityForOrder },
    { label: "مقدار آگهی", value: ad.advertismentAmount },
    { label: "شماره تماس", value: ad.answeringPhone },
    { label: "شناسه محصول", value: ad.itemId },
    { label: "وضعیت", value: ad.status || "نامشخص" },
    {
      label: "تاریخ ایجاد",
      value: moment(ad.CreatedAt).format("jYYYY/jMM/jDD"),
    },
    {
      label: "آخرین بروزرسانی",
      value: moment(ad.UpdatedAt).format("jYYYY/jMM/jDD"),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200 text-sm border-t border-gray-200 dark:border-gray-700 pt-4">
      {details.map((detail) => (
        <Detail key={detail.label} label={detail.label}>
          {detail.value}
        </Detail>
      ))}
    </div>
  );
}
