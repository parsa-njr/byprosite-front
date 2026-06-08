import { Card } from "@/components/ui/card";
const url = import.meta.env.VITE_API_BASE_URL;
type imageCardProps = {
  mainImage?: String;
};
export default function ImageCard({ mainImage }: imageCardProps) {
  return (
    <div className="w-full h-[420px] rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {mainImage ? (
        <img
          src={`${url}/${mainImage}`}
          alt="Ad image"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 dark:bg-gray-900 border-dashed border-2 border-gray-300 rounded-2xl">
          تصویری وجود ندارد
        </div>
      )}
    </div>
  );
}
