import React, { useState, useEffect } from 'react';
import ProfileSidebar, { SectionKey } from './components/ProfileSidebar';
import DashboardSummary from './components/DashboardSummary';
import AdManagement from './components/AdManagement';
import ProfileSettings from './components/ProfileSettings';
import AddressManagement from './components/AddressManagement';
import { User as ProfileUser } from '@/types/profile.types';
import { useUser } from '@/hooks/useUser';
import Loader from '@/components/shared/Loader';

const ProfilePage: React.FC = () => {
  const { data: authUser, isLoading } = useUser();
  
  // نگاشت کاربر واقعی به ساختار نمایشی پروفایل
  const user: ProfileUser = authUser
    ? {
        id: String(authUser.id ?? "0"),
        name: [authUser.firstName, authUser.lastName].filter(Boolean).join(" ") || "کاربر",
        username: authUser.phoneNumber || "user",
        email: authUser.email,
        phone: authUser.phoneNumber,
        avatar: "https://github.com/shadcn.png",
        bio: "",
        location: "",
        joinDate: new Date(),
        isVerified: true,
      }
    : {
        id: '0',
        name: '',
        username: '',
        email: '',
        phone: '',
        avatar: '',
        bio: '',
        location: '',
        joinDate: new Date(),
        isVerified: false,
      };

  const [isOwnProfile] = useState(true);
  const [section, setSection] = useState<SectionKey>('dashboard');

  useEffect(() => {
    // اینجا می‌تونید داده‌های کاربر رو از API بگیرید
    // fetchUserData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    switch (section) {
      case 'dashboard':
        return <DashboardSummary />;

      case 'ads-list':
        return <AdManagement user={user} isOwnProfile={isOwnProfile} mode="list" />;

      case 'ads-create':
        return <AdManagement user={user} isOwnProfile={isOwnProfile} mode="create" />;

      case 'addresses-list':
        return <AddressManagement mode="list" />;

      case 'profile-info':
      case 'profile-verification':
      case 'profile-certificates':
      case 'profile-notifications':
        return <ProfileSettings activeSection={section} />;

      default:
        return <DashboardSummary />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-[100px]">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <ProfileSidebar active={section} onChange={setSection} />

          <main className="flex-1 w-full min-w-0">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;