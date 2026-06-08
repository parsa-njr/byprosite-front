import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserInfoForm from "./UserInfoForm";
import { User } from "@/hooks/useUser";

interface UserInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ open, onOpenChange, user }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ direction: "rtl" }} className="sm:max-w-lg">
        <DialogHeader dir="rtl" className="text-right">
          <DialogTitle className="text-right">ویرایش اطلاعات کاربر</DialogTitle>
        </DialogHeader>
        <UserInfoForm user={user} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default UserInfoModal;
















