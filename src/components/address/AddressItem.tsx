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
import { Badge } from "../ui/badge";


const AddressItem = ({ address, handleEdit, handleDelete, addressList }) => {
  return (
    <>
    <Card
  key={address.id}
  className={`relative flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 ${
    address.isDefault ? "border-blue-400" : "border-gray-200"
  }`}
>
  <CardContent className="p-0 flex gap-4 flex-1 flex-col sm:flex-row sm:items-center">
    <MapPin
      className={`h-7 w-7 ${
        address.isDefault ? "text-blue-500" : "text-gray-400"
      }`}
    />
    <div className="flex flex-col">
      <p className="text-gray-700 flex gap-2 flex-wrap">
        {address.addressValue}{" "}
        {address.isDefault && (
          <Badge className="shrink-0">پیشفرض</Badge>
        )}
      </p>
      <p className="text-sm text-gray-500 mt-1">
        {address.addressDescription}
      </p>
    </div>
  </CardContent>

  <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-2">
    <Button
      type="button"
      variant="outline"
      className="border"
      onClick={() => handleEdit(address.id)}
    >
      <Pencil className="h-6 w-6" />
    </Button>

    {addressList?.length > 0 && (
      <Button
        type="button"
        variant="outline"
        className="text-red-500 border"
        onClick={() => handleDelete(address.id)}
      >
        <Trash2 className="h-6 w-6" />
      </Button>
    )}
  </div>
</Card>

    </>
  );
};

export default AddressItem;
