import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Megaphone, 
  Settings, 
  ChevronDown, 
  ChevronLeft,
  FileText,
  Plus,
  User,
  FileCheck,
  Award,
  Bell,
  MapPin
} from "lucide-react";

export type SectionKey = 
  | "dashboard" 
  | "ads-list" 
  | "ads-create" 
  | "addresses-list"
  | "profile-info" 
  | "profile-verification" 
  | "profile-certificates" 
  | "profile-notifications";

interface MenuItem {
  key: SectionKey;
  label: string;
  icon: React.ElementType;
  subItems?: { key: SectionKey; label: string; icon: React.ElementType }[];
}

interface ProfileSidebarProps {
  active: SectionKey;
  onChange: (key: SectionKey) => void;
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    label: "داشبورد اصلی",
    icon: LayoutDashboard,
  },
  {
    key: "ads-list",
    label: "مدیریت آگهی‌ها",
    icon: Megaphone,
    subItems: [
      { key: "ads-list", label: "آگهی‌های من", icon: FileText },
      { key: "ads-create", label: "ثبت آگهی جدید", icon: Plus },
    ],
  },
  {
    key: "addresses-list",
    label: "مدیریت آدرس‌ها",
    icon: MapPin,
  },
  {
    key: "profile-info",
    label: "پروفایل و تنظیمات",
    icon: Settings,
    subItems: [
      { key: "profile-info", label: "مشخصات شرکت / فرد", icon: User },
      { key: "profile-verification", label: "مدارک و احراز هویت", icon: FileCheck },
      { key: "profile-certificates", label: "مجوزها و گواهی‌ها", icon: Award },
      { key: "profile-notifications", label: "تنظیمات اعلان‌ها", icon: Bell },
    ],
  },
];

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ active, onChange }) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["dashboard", "ads-list", "profile-info"])
  );

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const isCategoryActive = (item: MenuItem): boolean => {
    if (item.key === active) return true;
    if (item.subItems) {
      return item.subItems.some(subItem => subItem.key === active);
    }
    return false;
  };

  const isSubItemActive = (subKey: SectionKey): boolean => {
    return subKey === active;
  };

  return (
    <aside className="w-full md:w-72 shrink-0 sticky top-[100px] self-start">
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-white to-gray-50 shadow-sm">
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{
          backgroundImage:
            "radial-gradient(800px 200px at top, rgba(0,0,0,1), transparent)",
        }} />
        <div className="relative p-3 md:p-4">
          <div className="text-xs text-gray-500 mb-2 px-2">بخش‌ها</div>
          <nav className="flex md:flex-col gap-1">
            {menuItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isActive = isCategoryActive(item);
              const isExpanded = expandedCategories.has(item.key);

              return (
                <div key={item.key} className="flex flex-col">
                  {/* دسته اصلی */}
                <button
                  className={cn(
                    "group w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-right transition",
                    "hover:bg-gray-100",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                  )}
                    onClick={() => {
                      if (hasSubItems) {
                        toggleCategory(item.key);
                      } else {
                        onChange(item.key);
                      }
                    }}
                >
                  <span className="flex items-center">
                    <span className={cn(
                      "inline-flex items-center justify-center rounded-md w-7 h-7 ml-2",
                      isActive ? "bg-primary text-primary-foreground" : "bg-gray-100 text-gray-600"
                    )}>
                        <item.icon className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </span>
                    {hasSubItems ? (
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 transition-transform duration-200",
                          isExpanded && "transform rotate-180"
                        )} 
                      />
                    ) : (
                      <ChevronLeft className={cn("w-4 h-4 transition", isActive ? "opacity-100" : "opacity-40")} />
                    )}
                  </button>

                  {/* زیردسته‌ها */}
                  {hasSubItems && isExpanded && (
                    <div className="mr-6 mt-1 space-y-1 border-r-2 border-gray-200 pr-2">
                      {item.subItems?.map((subItem) => {
                        const isSubActive = isSubItemActive(subItem.key);
                        return (
                          <button
                            key={subItem.key}
                            className={cn(
                              "group w-full flex items-center justify-between rounded-lg px-3 py-2 text-right transition text-sm",
                              "hover:bg-gray-50",
                              isSubActive && "bg-primary/5 text-primary font-medium"
                            )}
                            onClick={() => onChange(subItem.key)}
                          >
                            <span className="flex items-center">
                              <subItem.icon className="w-3.5 h-3.5 ml-2 text-gray-500" />
                              <span>{subItem.label}</span>
                  </span>
                            {isSubActive && (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            )}
                </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;


