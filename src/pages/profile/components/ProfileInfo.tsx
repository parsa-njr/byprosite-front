import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from '@/types/profile.types';
import { Edit, Mail, Phone, Calendar, MapPin, User as UserIcon } from 'lucide-react';

interface ProfileInfoProps {
  user: User; // kept for compatibility, no direct field display
  isOwnProfile?: boolean;
  onEdit?: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, isOwnProfile, onEdit }) => {
  // استخراج نام و نام خانوادگی از فیلد name
  const nameParts = user.name ? user.name.split(' ') : [];
  const firstName = nameParts[0] || '—';
  const lastName = nameParts.slice(1).join(' ') || '—';

  const items = [
    { icon: UserIcon, label: 'نام', value: firstName },
    { icon: UserIcon, label: 'نام خانوادگی', value: lastName },
    { icon: Mail, label: 'ایمیل', value: user.email || '—' },
    { icon: Phone, label: 'شماره تماس', value: user.phone || '—' },
    { icon: Calendar, label: 'تاریخ عضویت', value: user.joinDate ? new Date(user.joinDate).toLocaleDateString('fa-IR') : '—' },
    { icon: MapPin, label: 'موقعیت', value: user.location || '—' },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>اطلاعات کاربر</CardTitle>
        {isOwnProfile && (
          <Button onClick={onEdit} size="sm">
            <Edit className="w-4 h-4 ml-2" />
            ویرایش
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg border p-3 bg-white gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <item.icon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="text-gray-600 text-xs sm:text-sm">{item.label}</span>
              </div>
              <span className="font-medium text-xs sm:text-sm text-gray-800 truncate text-left sm:text-right sm:max-w-[60%]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileInfo;