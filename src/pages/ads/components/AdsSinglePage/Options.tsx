import { CheckCircle2 } from "lucide-react";

type ActiveOptionProps = {
  chat?: boolean;
  testingWithoutSampling?: boolean;
  testingWithSampling?: boolean;
  loadingOrigin?: boolean;
  transportationOriginDestination?: boolean;
  unloadingDestination?: boolean;
  inspectionCertificates?: boolean;
  warehouseStorage?: boolean;
};

export default function Options(props: ActiveOptionProps) {
  const options: [keyof ActiveOptionProps, string][] = [
    ["chat", "امکان چت"],
    ["testingWithoutSampling", "تست بدون نمونه"],
    ["testingWithSampling", "تست با نمونه"],
    ["loadingOrigin", "بارگیری از مبدا"],
    ["transportationOriginDestination", "حمل و نقل"],
    ["unloadingDestination", "تخلیه در مقصد"],
    ["inspectionCertificates", "گواهی بازرسی"],
    ["warehouseStorage", "انبارداری"],
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {options.map(([key, label]) => {
        const isActive = props[key];
        return (
          <div
            key={key}
            className={`flex items-center text-sm ${
              isActive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 ml-2" />
            {label}
          </div>
        );
      })}
    </div>
  );
}
