import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ProfileTabs from './ProfileTabs';
import { User } from '@/types/profile.types';

interface AdManagementProps {
  user: User;
  isOwnProfile?: boolean;
  mode?: 'list' | 'create';
}

const AdManagement: React.FC<AdManagementProps> = ({ 
  user, 
  isOwnProfile = true,
  mode = 'list'
}) => {
  const navigate = useNavigate();

  const handleCreateAd = () => {
    navigate('/advertisementForm/0');
  };

  if (mode === 'create') {
    // در حالت ایجاد، کاربر به صفحه فرم هدایت می‌شود
    // این کامپوننت فقط برای نمایش دکمه استفاده می‌شود
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">ثبت آگهی جدید</h2>
            <p className="text-gray-600">برای ثبت آگهی جدید، روی دکمه زیر کلیک کنید</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-8 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">آماده ثبت آگهی جدید هستید؟</h3>
            <p className="text-gray-600">
              برای شروع فرآیند ثبت آگهی، روی دکمه زیر کلیک کنید و فرم را تکمیل کنید.
            </p>
            <Button 
              onClick={handleCreateAd}
              className="mt-4"
              size="lg"
            >
              <Plus className="w-5 h-5 ml-2" />
              شروع ثبت آگهی جدید
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // حالت لیست آگهی‌ها
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">آگهی‌های من</h2>
          <p className="text-sm sm:text-base text-gray-600">مدیریت و ویرایش آگهی‌های ثبت شده</p>
        </div>
        <Button 
          onClick={handleCreateAd}
          className="flex items-center gap-2 w-full sm:w-auto"
          size="sm"
        >
          <Plus className="w-4 h-4" />
          ثبت آگهی جدید
        </Button>
      </div>

      <div className="bg-white border rounded-lg p-3 sm:p-4 md:p-6 overflow-x-auto">
        <ProfileTabs user={user} isOwnProfile={isOwnProfile} showInfoTab={false} />
      </div>
    </div>
  );
};

export default AdManagement;

