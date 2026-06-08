import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Package, 
  Eye, 
  ShoppingBag,
  TrendingUp 
} from 'lucide-react';
import { ProfileStats as StatsType } from '@/types//profile.types';

interface ProfileStatsProps {
  stats: StatsType;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'کل آگهی‌ها',
      value: stats.totalAds,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'آگهی‌های فعال',
      value: stats.activeAds,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'فروخته شده',
      value: stats.soldItems,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'بازدیدها',
      value: stats.totalViews.toLocaleString('fa-IR'),
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${item.bgColor}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProfileStats;