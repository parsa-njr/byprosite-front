import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  FileCheck, 
  Award, 
  Bell, 
  Upload, 
  Edit,
  Check
} from 'lucide-react';
import ProfileInfo from './ProfileInfo';
import { User as ProfileUser } from '@/types/profile.types';
import UserInfoModal from './UserInfoModal';
import { useUser } from '@/hooks/useUser';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from "react-toastify";

interface ProfileSettingsProps {
  activeSection: 'profile-info' | 'profile-verification' | 'profile-certificates' | 'profile-notifications';
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ activeSection }) => {
  const { data: authUser } = useUser();
  const [editOpen, setEditOpen] = useState(false);
  
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

  // تنظیمات اعلان‌ها
  const [notifications, setNotifications] = useState({
    email: {
      newMessage: true,
      newOrder: true,
      adApproved: true,
      adRejected: false,
      specialOffers: true,
    },
    sms: {
      newMessage: false,
      newOrder: true,
      adApproved: true,
      adRejected: true,
      specialOffers: false,
    },
    website: {
      newMessage: true,
      newOrder: true,
      adApproved: true,
      adRejected: true,
      specialOffers: true,
    }
  });

  const handleNotificationChange = (type: 'email' | 'sms' | 'website', key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }));
  };

  // مدارک و احراز هویت
  const [documents, setDocuments] = useState([
    { id: 1, name: 'کارت ملی', status: 'verified', uploadDate: '1403/01/15' },
    { id: 2, name: 'شناسنامه', status: 'pending', uploadDate: '1403/02/20' },
  ]);

  const [certificates, setCertificates] = useState([
    { id: 1, name: 'گواهی اصالت کالا', status: 'verified', expiryDate: '1404/12/29' },
    { id: 2, name: 'مجوز فعالیت', status: 'verified', expiryDate: '1405/06/15' },
  ]);

  const getStatusBadge = (status: string) => {
    const configs = {
      verified: { label: 'تایید شده', variant: 'default' as const, className: 'bg-green-100 text-green-800 hover:bg-green-100' },
      pending: { label: 'در انتظار بررسی', variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
      rejected: { label: 'رد شده', variant: 'destructive' as const, className: 'bg-red-100 text-red-800 hover:bg-red-100' },
    };
    const config = configs[status as keyof typeof configs] || configs.pending;
    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // رندر محتوا بر اساس بخش فعال
  if (activeSection === 'profile-info') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">مشخصات شرکت / فرد</h2>
          <p className="text-sm sm:text-base text-gray-600">مدیریت اطلاعات شخصی و حساب کاربری</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <ProfileInfo user={user} isOwnProfile={true} onEdit={() => setEditOpen(true)} />
          </CardContent>
        </Card>
        {authUser && (
          <UserInfoModal open={editOpen} onOpenChange={setEditOpen} user={authUser} />
        )}
      </div>
    );
  }

  if (activeSection === 'profile-verification') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">مدارک و احراز هویت</h2>
          <p className="text-sm sm:text-base text-gray-600">بارگذاری و مدیریت مدارک احراز هویت</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>مدارک بارگذاری شده</CardTitle>
            <CardDescription>مدارک شما برای بررسی و تایید ارسال شده است</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <FileCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-gray-500">تاریخ بارگذاری: {doc.uploadDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 ml-2" />
                    ویرایش
                  </Button>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <label htmlFor="document-upload" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => document.getElementById('document-upload')?.click()}
                >
                  <Upload className="w-4 h-4 ml-2" />
                  بارگذاری مدرک جدید
                </Button>
                <Input
                  id="document-upload"
                  type="file"
                  accept="image/jpeg,image/png,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // بررسی حجم فایل (5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("حجم فایل نباید بیشتر از 5 مگابایت باشد");
                        return;
                      }
                      // TODO: اضافه کردن API call برای آپلود مدرک
                      toast.success("فایل انتخاب شد. لطفا منتظر بمانید...");
                    }
                  }}
                />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>راهنمای احراز هویت</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <p>مدارک باید به صورت واضح و خوانا باشند</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <p>فرمت‌های مجاز: JPG, PNG, PDF</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-600 mt-0.5" />
              <p>حداکثر حجم هر فایل: 5 مگابایت</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeSection === 'profile-certificates') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">مجوزها و گواهی‌ها</h2>
          <p className="text-sm sm:text-base text-gray-600">مدیریت مجوزها و گواهی‌های فعالیت</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>گواهی‌های ثبت شده</CardTitle>
            <CardDescription>مجوزها و گواهی‌های معتبر شما</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-gray-500">تاریخ انقضا: {cert.expiryDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(cert.status)}
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 ml-2" />
                    ویرایش
                  </Button>
                </div>
              </div>
            ))}

            <Button className="w-full mt-4" variant="outline">
              <Upload className="w-4 h-4 ml-2" />
              افزودن مجوز جدید
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (activeSection === 'profile-notifications') {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">تنظیمات اعلان‌ها</h2>
          <p className="text-sm sm:text-base text-gray-600">مدیریت نحوه دریافت اطلاع‌رسانی‌ها</p>
        </div>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="email">ایمیل</TabsTrigger>
            <TabsTrigger value="sms">پیامک</TabsTrigger>
            <TabsTrigger value="website">اعلان وب‌سایت</TabsTrigger>
          </TabsList>

          {/* تنظیمات ایمیل */}
          <TabsContent value="email" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>اعلان‌های ایمیل</CardTitle>
                <CardDescription>انتخاب کنید که چه نوع اعلان‌هایی از طریق ایمیل دریافت کنید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications.email).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`email-${key}`} className="cursor-pointer">
                      {key === 'newMessage' && 'پیام جدید'}
                      {key === 'newOrder' && 'سفارش جدید'}
                      {key === 'adApproved' && 'تایید آگهی'}
                      {key === 'adRejected' && 'رد آگهی'}
                      {key === 'specialOffers' && 'پیشنهادات ویژه'}
                    </Label>
                    <Switch
                      id={`email-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => handleNotificationChange('email', key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* تنظیمات پیامک */}
          <TabsContent value="sms" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>اعلان‌های پیامک</CardTitle>
                <CardDescription>انتخاب کنید که چه نوع اعلان‌هایی از طریق پیامک دریافت کنید</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications.sms).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`sms-${key}`} className="cursor-pointer">
                      {key === 'newMessage' && 'پیام جدید'}
                      {key === 'newOrder' && 'سفارش جدید'}
                      {key === 'adApproved' && 'تایید آگهی'}
                      {key === 'adRejected' && 'رد آگهی'}
                      {key === 'specialOffers' && 'پیشنهادات ویژه'}
                    </Label>
                    <Switch
                      id={`sms-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => handleNotificationChange('sms', key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* تنظیمات اعلان وب‌سایت */}
          <TabsContent value="website" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>اعلان‌های وب‌سایت</CardTitle>
                <CardDescription>انتخاب کنید که چه نوع اعلان‌هایی در وب‌سایت نمایش داده شود</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(notifications.website).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={`website-${key}`} className="cursor-pointer">
                      {key === 'newMessage' && 'پیام جدید'}
                      {key === 'newOrder' && 'سفارش جدید'}
                      {key === 'adApproved' && 'تایید آگهی'}
                      {key === 'adRejected' && 'رد آگهی'}
                      {key === 'specialOffers' && 'پیشنهادات ویژه'}
                    </Label>
                    <Switch
                      id={`website-${key}`}
                      checked={value}
                      onCheckedChange={(checked) => handleNotificationChange('website', key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button>ذخیره تغییرات</Button>
        </div>
      </div>
    );
  }

  return null;
};

export default ProfileSettings;

