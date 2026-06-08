import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  KeyRound,
  LogOut,
  ChevronLeft,
  Package,
  CreditCard,
  BookOpen,
  ChevronDown,
  UserRound,
  CircleUserRound,
} from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileMenu({ userData }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const logOutHandler = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    navigate("/")
    window.location.reload();
  };

  const DropDownMenuItem = ({
    to,
    label,
    icon,
    leftIcon,
    disabled,
    onClick,
  }) => {
    const content = (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {icon}
          <span style={{ fontFamily: "IranSans" }} className="text-sm">
            {label}
          </span>
        </div>
        {leftIcon}
      </div>
    );

    if (onClick) {
      return (
        <DropdownMenuItem
          onClick={onClick}
          disabled={disabled}
          className={`h-12 px-2 rounded-none ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {content}
        </DropdownMenuItem>
      );
    }

    return (
      <DropdownMenuItem
        onClick={() => setOpen(false)}
        disabled={disabled}
        className={`h-12 px-2 rounded-none ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {to ? (
          <Link
            to={disabled ? "#" : `/profile${to}`}
            className="flex items-center justify-between w-full"
            onClick={(e) => disabled && e.preventDefault()}
          >
            {content}
          </Link>
        ) : (
          content
        )}
      </DropdownMenuItem>
    );
  };

  return (
    <div style={{ fontFamily: "IranSans" }} dir="rtl">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button className="text-white p gap-3 bg-secondary rounded-full flex items-center space-x-2 p-3 h-auto">
            <span className="flex">
              <ChevronDown />
              <UserRound />
            </span>
            {userData?.fullName}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          style={{ direction: "rtl" }}
          align="start"
          className="w-64"
        >
          {/* @ts-ignore  */}
          <DropDownMenuItem
            to="/"
            icon={<CircleUserRound size={18} />}
            leftIcon={<ChevronLeft size={18} />}
            label="پروفایل من"
            disabled={location.pathname.includes("profile")}
          />
          <DropdownMenuSeparator />

          <DropDownMenuItem
            onClick={logOutHandler}
            icon={<LogOut size={18} className="text-red-500" />}
            label="خروج از حساب کاربری"
            // @ts-ignore
            className="text-red-500 focus:text-red-500"
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
