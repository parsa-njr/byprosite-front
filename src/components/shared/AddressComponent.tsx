import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, MapPin, Pencil, Trash2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

const AddressList = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      addressValue: "اصفهان، سپاهان شهر، بلوار غدیر، مجتمع بهاران، بلوک ۹، طبقه ۲، پلاک ۶",
      postalCode: "817994653",
      recipient: "محمد پارسا نجات پور",
      phone: "09354135643",
      isDefault: false,
    },
    {
      id: 2,
      addressValue: "اصفهان، سپاهان شهر، بلوار غدیر، مجتمع بهاران، بلوک ۹، طبقه دوم، پلاک ۶",
      postalCode: "817994653",
      recipient: "محمد پارسا نجات پور",
      phone: "09191934337",
      isDefault: true,
    },
  ]);

  const handleDelete = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEdit = (id) => {
    console.log("Edit address", id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold border-b-2 border-red-500 pb-1">
          آدرس‌ها
        </h3>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-600"
          onClick={() => console.log("افزودن آدرس جدید")}
        >
          <Plus className="ml-1 h-5 w-5" /> افزودن آدرس جدید
        </Button>
      </div>

      <div className="space-y-3">
        {addresses.map((addr) => (
          <Card
            key={addr.id}
            className={`relative flex justify-between items-start p-4 ${
              addr.isDefault ? "border-blue-400" : "border-gray-200"
            }`}
          >
            <CardContent className="p-0 flex-1">
              <p className="text-gray-700">{addr.addressValue}</p>
              <p className="text-sm text-gray-500 mt-1">
                کد پستی: {addr.postalCode}
              </p>
              <p className="text-sm text-gray-500">
                گیرنده: {addr.recipient} | {addr.phone}
              </p>
            </CardContent>

            <div className="flex flex-col items-center ml-2">
              <MapPin
                className={`h-5 w-5 ${
                  addr.isDefault ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="mt-2 p-1 hover:bg-gray-100 rounded-full">
                    <MoreVertical className="h-5 w-5 text-gray-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-28">
                  <DropdownMenuItem
                    onClick={() => handleEdit(addr.id)}
                    className="cursor-pointer"
                  >
                    <Pencil className="h-4 w-4 ml-2" /> ویرایش
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(addr.id)}
                    className="text-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 ml-2" /> حذف
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AddressList;
