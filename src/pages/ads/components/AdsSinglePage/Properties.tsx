import { Ruler, FlaskConical } from "lucide-react";
import { useGetProperyUnits } from "@/query/globals/useGlobal";
import Loader from "@/components/shared/Loader";
import { useEffect } from "react";
type PropertyItem = {
  id: string;
  title: string;
  value?: string;
  unit?: string;
};

type PropertyType = {
  physical?: PropertyItem[];
  chemical?: PropertyItem[];
};

type PropertiesProps = {
  properties?: PropertyType;
};

export default function Properties({ properties }: PropertiesProps) {
  const { data, isLoading, isSuccess, error } = useGetProperyUnits();
  const units = [data?.data?.data];
  

  if (!isSuccess || !units) return <Loader />;
  return (
    <div>
      {/* Phisical */}
      {properties?.physical?.length > 0 && (
        <div className="mb-4 mt-8">
          <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
            <Ruler className="w-5 h-5" />
            <span className="font-semibold text-base">ویژگی‌های فیزیکی</span>
          </div>
          <ul className="grid grid-cols-2 gap-4 text-sm">
            {properties.physical.map((prop: any) => {
              const matchedUnit = units[0].find(
                (unit) => unit.physicalPropertyId === prop.id
              );
              return (
                <li
                  key={prop.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="font-medium text-gray-800 dark:text-gray-100">
                    {prop.title}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 sm:mt-0">
                    {prop.value || "—"}{" "}
                    {matchedUnit && (
                      <span className="text-gray-500 dark:text-gray-400">
                        ({matchedUnit.title})
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Chemical */}
      {properties?.chemical?.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2  mt-8 text-sky-600 dark:text-sky-400">
            <FlaskConical className="w-5 h-5" />
            <span className="font-semibold text-base">ویژگی‌های شیمیایی</span>
          </div>
          <ul className="grid grid-cols-2 gap-4 text-sm">
            {properties.chemical.map((prop: any) => {
              const matchedUnit = units[0].find(
                (unit) => unit.chemicalPropertyId === prop.id
              );
              return (
                <li
                  key={prop.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="font-medium text-gray-800 dark:text-gray-100">
                    {prop.title}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm mt-1 sm:mt-0">
                    {prop.value || "—"}{" "}
                    {matchedUnit && (
                      <span className="text-gray-500 dark:text-gray-400">
                        ({matchedUnit.title})
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
