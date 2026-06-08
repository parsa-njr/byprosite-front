import { MapPin, Newspaper } from "lucide-react";

const EnvOptions = ({ envList, options }) => {
  const convertedList =
    envList && typeof envList === "string" ? JSON.parse(envList) : [];
  return (
    <>
      <div className="mt-2">
        {convertedList?.map((envItem) => (
          <>
            <div className="flex items-center text-sm font-semibold text-primary gap-2 pb-2 ">
              <span className="bg-secondary/20 p-2 rounded-full">
                <Newspaper className="h-4 w-4 text-secondary" />
              </span>
              {options?.find((item) => item?.value === envItem)?.label}
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default EnvOptions;
