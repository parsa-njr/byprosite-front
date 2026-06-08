import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserAds from './UserAds';
import ProfileInfo from './ProfileInfo';
import { User } from '@/types/profile.types';
import { useGetUserAds } from '@/query/ads/useAds';
import Loader from '@/components/shared/Loader';

interface ProfileTabsProps {
  user: User;
  isOwnProfile?: boolean;
  showInfoTab?: boolean;
}

interface TabConfig {
  value: string;
  label: string;
  status?: number; // برای مطابقت با API شما
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ user, isOwnProfile, showInfoTab = true }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [currentStatus, setCurrentStatus] = useState<number | undefined>(undefined);

  // Map status strings to numbers (based on your API)
  const statusMap: Record<string, number> = {
    'all': -1,       // همه
    'draft': 0,      // پیش‌نویس
    'pending': 1,    // در انتظار تایید
    'rejected': 2,   // بازگشت جهت ویرایش
    'published': 3,  // منتشر شده
    'expired': 4,    // منقضی شده
    'cancelled': 5   // لغو شده
  };

  // تعریف تب‌ها
  const tabConfigs: TabConfig[] = [
    { value: 'all', label: 'همه آگهی‌ها', status: undefined },
    { value: 'draft', label: 'پیش‌نویس', status: 0 },
    { value: 'pending', label: 'در انتظار تایید', status: 1 },
    { value: 'rejected', label: 'بازگشت جهت ویرایش', status: 2 },
    { value: 'published', label: 'منتشر شده', status: 3 },
    { value: 'expired', label: 'منقضی شده', status: 4 },
    { value: 'cancelled', label: 'لغو شده', status: 5 },
    ...(showInfoTab ? [{ value: 'info', label: 'اطلاعات تماس' } as TabConfig] : [])
  ];

  // استفاده از React Query hook برای دریافت آگهی‌های فیلتر شده
  const { 
    data: adsResponse, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetUserAds({
    page: 1,
    per_page: 100,
    status: currentStatus
  });

  // استخراج آرایه آگهی‌ها از پاسخ API
  const ads = Array.isArray(adsResponse) 
    ? adsResponse 
    : (adsResponse?.data && Array.isArray(adsResponse.data) 
        ? adsResponse.data 
        : []);

  // دریافت همه آگهی‌ها برای محاسبه تعداد (فقط برای نمایش badge)
  const { data: allAdsResponse } = useGetUserAds({
    page: 1,
    per_page: 1000,
    status: undefined
  });

  const allAds = Array.isArray(allAdsResponse) 
    ? allAdsResponse 
    : (allAdsResponse?.data && Array.isArray(allAdsResponse.data) 
        ? allAdsResponse.data 
        : []);

  // محاسبه تعداد آگهی‌ها برای هر وضعیت
  const getStatusCount = (status: number | undefined) => {
    if (!Array.isArray(allAds)) return 0;
    
    if (status === undefined) {
      return allAds.length; // همه آگهی‌ها
    }
    
    return allAds.filter((ad: any) => {
      // بررسی وجود فیلد status در ad
      const adStatus = ad.status !== undefined ? ad.status : (ad.status_id !== undefined ? ad.status_id : null);
      if (adStatus === null) return false;
      return Number(adStatus) === Number(status);
    }).length;
  };

  // تغییر تب
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (value === 'info') {
      return; // تب اطلاعات تماس نیاز به API call ندارد
    }
    
    // تنظیم status برای API - اگر 'all' باشد، undefined می‌فرستیم
    const status = value === 'all' ? undefined : statusMap[value];
    setCurrentStatus(status);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
        <p className="text-lg font-medium mb-2">خطا در بارگذاری آگهی‌ها</p>
        <p className="text-sm mb-4">{error?.message || 'لطفا دوباره تلاش کنید'}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="w-4 h-4 ml-2" />
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="w-full justify-start flex-wrap h-auto p-1 gap-1 overflow-x-auto">
        {tabConfigs
          .filter(tab => {
            // برای کاربران دیگر فقط published و info نمایش داده شود
            if (!isOwnProfile && !['published', 'info', 'all'].includes(tab.value)) {
              return false;
            }
            return true;
          })
          .map(tab => {
            const count = tab.value !== 'info' ? getStatusCount(tab.status) : 0;
            
            return (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm whitespace-nowrap"
              >
                <span>{tab.label}</span>
                {tab.value !== 'info' && count > 0 && (
                  <Badge 
                    variant="secondary" 
                    className="mr-2 h-5 px-1.5 text-xs"
                  >
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
      </TabsList>
      
      {/* محتوای تب‌ها */}
      {tabConfigs
        .filter(tab => tab.value !== 'info')
        .map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            <UserAds 
              ads={tab.value === activeTab ? ads : []} 
              isOwnProfile={isOwnProfile} 
            />
          </TabsContent>
        ))}
      
      {/* تب اطلاعات تماس */}
      {showInfoTab && (
        <TabsContent value="info" className="mt-6">
          <ProfileInfo user={user} isOwnProfile={isOwnProfile} />
        </TabsContent>
      )}
    </Tabs>
  );
};

export default ProfileTabs;