import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Share2, 
  Edit,
  CheckCircle 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from '@/types/profile.types';

interface ProfileHeaderProps {
  user: User; // kept for API shape compatibility, but not shown
  isOwnProfile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, isOwnProfile = true }) => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="relative h-28 sm:h-32 bg-gradient-to-l from-primary/20 via-primary/10 to-transparent">
        <div className="absolute inset-0 opacity-[0.08]" style={{
          backgroundImage:
            "radial-gradient(600px 160px at right, rgba(0,0,0,1), transparent)",
        }} />
      </div>
      <div className="px-6 pb-6 -mt-10 flex items-start justify-between">
        <div className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold">پروفایل</h1>
            <CheckCircle className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-gray-500 text-sm">مدیریت اطلاعات حساب، آدرس‌ها و آگهی‌ها</p>
        </div>
        {isOwnProfile && (
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-xl">
              <Share2 className="w-4 h-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <Settings className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  ویرایش پروفایل
                </DropdownMenuItem>
                <DropdownMenuItem>تنظیمات حساب</DropdownMenuItem>
                <DropdownMenuItem>تنظیمات امنیتی</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;