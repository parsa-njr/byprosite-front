import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Megaphone, 
  Eye, 
  MessageSquare, 
  FileSearch,
  Sparkles
} from 'lucide-react';
import { useGetUserAds } from '@/query/ads/useAds';
import Loader from '@/components/shared/Loader';

interface DashboardSummaryProps {}

const DashboardSummary: React.FC<DashboardSummaryProps> = () => {
  const { data: adsData, isLoading } = useGetUserAds({
    page: 1,
    per_page: 100,
  });

  // استخراج آرایه آگهی‌ها از response
  const ads = Array.isArray(adsData) ? adsData : (adsData?.data?.data || adsData?.data || adsData?.advertisements || []);

  // محاسبه آمارها
  const activeAds = Array.isArray(ads) 
    ? ads.filter((ad: any) => ad.status === 3 || ad.status_id === 3).length 
    : 0;
  
  const totalViews = Array.isArray(ads)
    ? ads.reduce((sum: number, ad: any) => sum + (ad.views || 0), 0)
    : 0;

  // این داده‌ها باید از API گرفته شوند
  const newMessages = 0; // TODO: از API بگیرید
  const pendingOrders = 0; // TODO: از API بگیرید
  const specialOffers = 0; // TODO: از API بگیرید

  const stats = [
    {
      label: 'تعداد آگهی‌های فعال',
      value: activeAds,
      icon: Megaphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'تعداد بازدیدها',
      value: totalViews.toLocaleString('fa-IR'),
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'پیام‌های جدید',
      value: newMessages,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      label: 'سفارش‌های در حال بررسی',
      value: pendingOrders,
      icon: FileSearch,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      label: 'پیشنهادات ویژه',
      value: specialOffers,
      icon: Sparkles,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    }
  ];

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">خلاصه وضعیت</h2>
        <p className="text-gray-600">نمای کلی از فعالیت‌ها و وضعیت حساب شما</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* خلاصه سریع */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">آخرین فعالیت‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">آخرین آگهی منتشر شده</span>
                <span className="font-medium">
                  {Array.isArray(ads) && ads.length > 0 
                    ? new Date(ads[0]?.createdAt || new Date()).toLocaleDateString('fa-IR')
                    : 'هنوز آگهی ثبت نشده'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">کل آگهی‌ها</span>
                <span className="font-medium">{Array.isArray(ads) ? ads.length : 0}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">وضعیت حساب</span>
                <span className="font-medium text-green-600">فعال</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">نکات مهم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p>آگهی‌های منتشر شده شما در حال نمایش هستند</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p>برای بهبود عملکرد، آگهی‌های منقضی شده را به‌روزرسانی کنید</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p>پیام‌های جدید را بررسی کنید</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSummary;

