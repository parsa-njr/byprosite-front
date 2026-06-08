import React, { useEffect, useState } from "react";
import { useGetAdvertisements } from "@/query/ads/useAds";
import { useGetCategories } from "@/query/globals/useGlobal";
import { Button } from "@/components/ui/button";
import AdCard from "../components/AdCard";
import FilterComponent from "../components/FilterComponent";
import Swal from "sweetalert2";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ListFilter, Search } from "lucide-react";
import BlurLoader from "@/components/shared/BlurLoader";
import { useParams } from "react-router-dom";
export default function AdsList() {
  const [page, setPage] = useState(1);
  const [adsList, setAdsList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    groups: [],
    items: [],
    search: "",
    type: "",
  });

  const navigate = useNavigate();
  // const params = useParams();
  const [searchParams] = useSearchParams();

  const { data: categoriesData } = useGetCategories();
  const {
    data: adsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAdvertisements({ page, per_page: 20, filters });

  const catId = searchParams.get("catId");
  const type = searchParams.get("type");
  // set Filter Params
useEffect(() => {
  if (!categories.length) return;


  setFilters((prev) => {
    const updated = {
      ...prev,
      categories: catId ? [Number(catId)] : [],
      type: type || "",
      search: debouncedSearch,
    };

    return updated;
  });
}, [searchParams, debouncedSearch, categories]);

  // 🔎 Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 🧩 Update filters when debounced search changes
  useEffect(() => {
    applyFilters({ ...filters, search: debouncedSearch });
  }, [debouncedSearch]);

  // 🧭 Update categories
  useEffect(() => {
    if (categoriesData) setCategories(categoriesData.data?.data || []);
  }, [categoriesData]);

  // 📦 Update ads list whenever adsData changes
  useEffect(() => {
    if (adsData?.data?.finalData) {
      setAdsList((prev) =>
        page === 1
          ? adsData.data.finalData
          : [...prev, ...adsData.data.finalData]
      );
    }
  }, [adsData, page]);

  // Apply filters and reset pagination
  const applyFilters = (newFilters: any) => {
    console.log("new filters sadfd ::::", newFilters);
    setFilters(newFilters);
    
    setPage(1);
    setAdsList([]);
  };

  // Handle ad card click
  const onCardClick = (id: number) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const accessToken = localStorage.getItem("accessToken");

    if (
      accessToken &&
      ["LevelOneRegistration", "LevelTwoRegistration"].includes(
        user?.userVerificationLevel
      )
    ) {
      navigate(`/singleAd/${id}`);
      return;
    }

    Swal.fire({
      title: "برای مشاهده آگهی باید وارد حساب کاربری خود شوید",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ثبت نام / ورود",
      cancelButtonText: "بستن",
      width: "380px",
      buttonsStyling: false,
      customClass: {
        popup: "font-sansWeb",
        title: "font-sansWeb !text-sm",
        confirmButton:
          "bg-primary cursor-pointer hover:opacity-85 text-white text-[15px] mx-[10px] mt-[25px] py-2 px-4 rounded font-sansWeb",
        cancelButton:
          "bg-secondary cursor-pointer hover:opacity-85 text-white py-2 px-4 rounded ml-2 text-[15px] mt-[25px] font-sansWeb",
      },
    }).then((result) => {
      if (result.isConfirmed) navigate(`/sign-up?backUrl=singleAd/${id}`);
    });
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col lg:flex-row-reverse pt-32 lg:pt-40 gap-6 p-4 bg-white text-gray-900 transition-all duration-300"
    >
      {/* Mobile Filter Toggle */}
      <Button
        onClick={() => setIsFilterOpen((prev) => !prev)}
        className="fixed lg:hidden right-4 bottom-4 rounded-full shadow-xl bg-primary text-white z-50 hover:scale-110 transition-transform"
        size="icon"
      >
        <ListFilter className="w-5 h-5" />
      </Button>

      {/* Ads Section */}
      <div className="flex-1 transition-all duration-300">
        {/* Search Input */}
        <div className="mb-6 relative w-full max-w-md mx-auto lg:mx-0">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="جستجو بین آگهی‌ها..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg py-2 pr-10 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition"
          />
        </div>

        <h2 className="mb-4 text-sm text-gray-500 text-center lg:text-right">
          انواع آگهی‌ها و نیازمندی‌ها
        </h2>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <BlurLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {adsList.map((ad) => (
              <AdCard
                key={ad.id}
                item={ad}
                onChildCardClick={() => onCardClick(ad.id)}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {adsList.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isFetching}
              className="text-sm px-6 rounded-lg shadow-sm hover:bg-primary/90 transition-all"
            >
              {isFetching ? "در حال بارگذاری..." : "نمایش آگهی‌های بیشتر"}
            </Button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && adsList.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-sm">
            هیچ آگهی‌ای یافت نشد.
          </div>
        )}
      </div>

      {/* Sidebar Filter */}
      <div
        className={`${
          isFilterOpen ? "translate-x-0" : "translate-x-full"
        } fixed lg:translate-x-0 top-0 right-0 h-full w-80 lg:w-80 xl:w-96 bg-white shadow-lg lg:shadow-none z-40 lg:relative transition-transform duration-300 overflow-y-auto`}
      >
        {categories.length > 0 && (
          <FilterComponent
            initialCategories={categories}
            firstFilterType={type}
            firstSelectedCat={catId}
            onChange={(selected) => {
              applyFilters({
                categories: selected.categories.map(Number),
                groups: selected.groups.map(Number),
                items: selected.items.map(Number),
                search: debouncedSearch,
                type: selected?.filterType,
              });
            }}
          />
        )}
      </div>
    </div>
  );
}
