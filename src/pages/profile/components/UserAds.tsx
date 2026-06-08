// components/profile/components/UserAds.tsx
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Heart,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { API_BASE_URL } from "@/api/axiosClient";
import { Ad, AdStatus } from '@/types/profile.types';
import { useNavigate } from 'react-router-dom';
import bgSamp from "../../../assets/images/bgSamp.png";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteAdvertisement } from "@/query/ads/useAds";

interface UserAdsProps {
  ads: Ad[];
  isOwnProfile?: boolean;
}

const UserAds: React.FC<UserAdsProps> = ({ ads, isOwnProfile }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteAdvertisement();

  const handleAdClick = (ad: Ad) => {
    navigate(`/singleAd/${ad.id}`);
  };

  const handleEdit = (e: React.MouseEvent, ad: Ad) => {
    e.stopPropagation();
    // TODO: فعال کردن ویرایش آگهی
    // navigate(`/ads/edit/${ad.id}`);
    toast.info("قابلیت ویرایش آگهی به زودی فعال خواهد شد");
  };

  const handleDelete = (e: React.MouseEvent, ad: Ad) => {
    e.stopPropagation();
    
    Swal.fire({
      title: "آیا از حذف این آگهی مطمئن هستید؟",
      text: "این عمل قابل بازگشت نیست",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "لغو",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      customClass: {
        popup: "font-sansWeb",
        title: "font-sansWeb !text-sm",
        confirmButton: "bg-primary cursor-pointer hover:opacity-85 text-white text-[16px] mx-[20px] mt-[30px] py-2 px-4 rounded font-sansWeb",
        cancelButton: "bg-secondary cursor-pointer hover:opacity-85 text-white py-2 px-4 rounded ml-2 text-[16px] mt-[30px] font-sansWeb",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(
          { id: String(ad.id) },
          {
            onSuccess: (response) => {
              toast.success(
                response.data?.message || "آگهی با موفقیت حذف شد"
              );
              // Invalidate و refetch کردن query های مربوط به userAds
              queryClient.invalidateQueries({ queryKey: ["userAds"] });
            },
            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || "خطا در حذف آگهی"
              );
            },
          }
        );
      }
    });
  };

  const getStatusConfig = (status: number | AdStatus) => {
    // تبدیل عدد به string برای AdStatus
    let statusKey: AdStatus;
    if (typeof status === 'number') {
      const statusMap: Record<number, AdStatus> = {
        0: 'draft',
        1: 'pending',
        2: 'rejected',
        3: 'published',
        4: 'expired',
        5: 'cancelled'
      };
      statusKey = statusMap[status] || 'draft';
    } else {
      statusKey = status;
    }

    const statusConfig = {
      draft: { label: 'پیش‌نویس', color: 'text-gray-600' },
      pending: { label: 'در انتظار تایید', color: 'text-yellow-600' },
      rejected: { label: 'بازگشت جهت ویرایش', color: 'text-red-600' },
      published: { label: 'منتشر شده', color: 'text-green-600' },
      expired: { label: 'منقضی شده', color: 'text-gray-500' },
      cancelled: { label: 'لغو شده', color: 'text-orange-600' }
    };
    
    return statusConfig[statusKey] || { label: `وضعیت ${status}`, color: 'text-gray-600' };
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  if (!ads || ads.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">آگهی‌ای یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" dir="rtl">
      {ads.map((ad) => {
        // دریافت status به صورت عدد از API
        // بررسی status با حروف بزرگ و کوچک (Sequelize ممکن است هر دو را برگرداند)
        let adStatus: number;
        
        if ((ad as any).status !== undefined && (ad as any).status !== null) {
          adStatus = Number((ad as any).status);
        } else if ((ad as any).Status !== undefined && (ad as any).Status !== null) {
          adStatus = Number((ad as any).Status);
        } else if ((ad as any).status_id !== undefined && (ad as any).status_id !== null) {
          adStatus = Number((ad as any).status_id);
        } else {
          // اگر هیچ statusی پیدا نشد، لاگ کن و از 0 استفاده کن
          console.warn('Status not found in ad:', ad);
          adStatus = 0;
        }
        
        const statusConfig = getStatusConfig(adStatus);
        
        return (
          <Card
            key={ad.id}
            className="overflow-hidden border border-gray-200
                     shadow-sm hover:shadow-md transition rounded-xl
                     bg-white h-auto relative flex flex-col"
            dir="rtl"
          >
            {/* منوی عملیات (فقط برای پروفایل خود) */}
            {isOwnProfile && (
              <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="h-9 w-9 rounded-full bg-white/90 hover:bg-white shadow-md"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e) => handleEdit(e as any, ad)}
                      disabled
                      className="opacity-50 cursor-not-allowed"
                    >
                      <Edit className="ml-2 h-4 w-4" />
                      ویرایش
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={(e) => handleDelete(e as any, ad)}
                      className="text-red-600"
                    >
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <CardContent className="p-4 sm:p-5 space-y-4 flex flex-col" dir="rtl">
              {/* تصویر */}
              <div className="relative w-full">
                <img
                  src={
                    ad?.mainImageUrl
                      ? `${API_BASE_URL}/${ad.mainImageUrl}`
                      : ad?.images?.[0]
                      ? `${API_BASE_URL}/${ad.images[0]}`
                      : bgSamp
                  }
                  alt={ad.title || 'تصویر آگهی'}
                  className="w-full h-48 sm:h-56 md:h-64 shadow-sm object-cover rounded-lg"
                />
                
                {/* آمار (بازدید و لایک) */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  {ad.views !== undefined && (
                    <div className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {new Intl.NumberFormat('fa-IR').format(ad.views)}
                    </div>
                  )}
                  {ad.likes !== undefined && (
                    <div className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {new Intl.NumberFormat('fa-IR').format(ad.likes)}
                    </div>
                  )}
                </div>
              </div>

              {/* عنوان */}
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-right" title={ad.title}>
                {ad.title || 'بدون عنوان'}
              </h3>

              {/* توضیحات */}
              <p className="text-sm sm:text-base text-gray-700 text-right line-clamp-3">
                {ad.description || 'بدون توضیحات'}
              </p>

              {/* وضعیت */}
              <div className="flex items-center justify-start gap-2 pt-2" dir="rtl">
                <span className="text-xs sm:text-sm text-gray-600 font-medium">وضعیت:</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs sm:text-sm font-semibold px-3 py-1 ${
                    statusConfig.color.includes('green') 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : statusConfig.color.includes('yellow') 
                      ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                      : statusConfig.color.includes('red') 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : statusConfig.color.includes('orange') 
                      ? 'border-orange-500 bg-orange-50 text-orange-700' 
                      : 'border-gray-500 bg-gray-50 text-gray-700'
                  }`}
                >
                  {statusConfig.label}
                </Badge>
              </div>

              {/* Badge ها */}
              <div className="flex text-right justify-end flex-wrap gap-2 pt-2">
                {ad.price && (
                  <Badge className="bg-primary cursor-pointer text-white hover:opacity-85">
                    قیمت: {formatPrice(ad.price)} تومان
                  </Badge>
                )}
                {ad.category && (
                  <Badge className="bg-primary cursor-pointer text-white hover:opacity-85">
                    {ad.category}
                  </Badge>
                )}
                {ad.condition && (
                  <Badge className="bg-primary cursor-pointer text-white hover:opacity-85">
                    وضعیت کالا: {ad.condition}
                  </Badge>
                )}
                {ad.brand && (
                  <Badge className="bg-primary cursor-pointer text-white hover:opacity-85">
                    {ad.brand}
                  </Badge>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-end border-t border-gray-200 p-3 sm:p-4 mt-auto" dir="rtl">
              <Button
                onClick={() => handleAdClick(ad)}
                variant="outline"
                className="w-full cursor-pointer border-secondary bg-transparent text-secondary hover:opacity-85 text-sm sm:text-base"
                size="sm"
              >
                مشاهده آگهی
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default UserAds;