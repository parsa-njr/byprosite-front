export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate: Date;
  isVerified?: boolean;
}

// آپدیت status برای آگهی‌ها
export type AdStatus = 
  | 'draft'      // پیش‌نویس
  | 'pending'    // در انتظار تایید
  | 'rejected'   // رد شده
  | 'published'  // منتشر شده
  | 'expired'    // منقضی شده
  | 'cancelled'; // لغو شده

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  mainImageUrl?: string;
  createdAt: Date;
  status: AdStatus;
  views: number;
  likes: number;
  updatedAt?: Date;
  userId?: string;
  condition?: string; 
  brand?: string; 
  amount?: string; 
}

export interface ProfileStats {
  totalAds: number;
  activeAds: number;
  soldItems: number;
  totalViews: number;
}