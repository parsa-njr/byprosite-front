import { Link } from "react-router-dom";
import { useGetCategories } from "@/query/globals/useGlobal";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const NavLinks = () => {
  const { data, isLoading } = useGetCategories();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (data?.data?.data) setCategories(data.data.data);
  }, [data]);

  return (
    <nav>
      <ul className="flex flex-col md:flex-row gap-6 md:gap-8 text-white text-lg md:text-xl">
        <li className="py-1 md:py-0">
          <Link
            to="/"
            className="hover:text-gray-400 cursor-pointer transition"
          >
            خانه
          </Link>
        </li>

        <li className="py-1 md:py-0">
          <Link
            to="#"
            className="hover:text-gray-400 cursor-pointer transition"
          >
            محصولات
          </Link>
        </li>

        {/* Buy Ads */}
        <li className="py-1 md:py-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:text-gray-400 cursor-pointer transition flex gap-2 items-center">
                آگهی های خرید
                <ChevronDown size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white text-gray-900 shadow-lg rounded-lg">
              {isLoading ? (
                <DropdownMenuItem disabled>در حال بارگذاری...</DropdownMenuItem>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <DropdownMenuItem
                    key={`buy-${cat.id}`}
                    className="text-right px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Link
                      to={`/ads?type=buy&catId=${cat.id}`}
                      className="w-full block text-gray-800 hover:text-gray-600 font-medium"
                    >
                      {cat.title}
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  هیچ دسته‌بندی‌ای موجود نیست
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>

        {/* Sell Ads */}
        <li className="py-1 md:py-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:text-gray-400 cursor-pointer transition flex gap-2 items-center">
                آگهی های فروش
                <ChevronDown size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-white text-gray-900 shadow-lg rounded-lg">
              {isLoading ? (
                <DropdownMenuItem disabled>در حال بارگذاری...</DropdownMenuItem>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <DropdownMenuItem
                    key={`sell-${cat.id}`}
                    className="text-right px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2"
                  >
                    <Link
                      to={`/ads?type=sell&catId=${cat.id}`}
                      className="w-full block text-gray-800 hover:text-gray-600 font-medium"
                    >
                      {cat.title}
                    </Link>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  هیچ دسته‌بندی‌ای موجود نیست
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>

        <li className="py-1 md:py-0">
          <Link
            to="#"
            className="hover:text-gray-400 cursor-pointer transition"
          >
            درباره ما
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavLinks;
