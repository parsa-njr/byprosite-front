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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import globalApi from "@/api/globalApi";
import AddressFormModal from "./AddressFormModal";

const AddressList = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<any | null>(null);

  const { data } = useQuery({
    queryKey: ["addressList"],
    queryFn: async () => {
      const res = await globalApi.getAddressList();
      return res.data?.data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => globalApi.deleteAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addressList"] }),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => globalApi.editAddress({ id, data }),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    },
  });

  const addMutation = useMutation({
    mutationFn: (payload: any) => globalApi.addAddress(payload),
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["addressList"] });
    },
  });

  const addresses = Array.isArray(data) ? data : [];

  const handleDelete = (id: string) => {
    if (window.confirm("آیا از حذف آدرس مطمئن هستید؟")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (addr: any) => {
    setSelected(addr);
    setMode("edit");
    setOpen(true);
  };

  const handleAdd = () => {
    setSelected(null);
    setMode("create");
    setOpen(true);
  };

  const handleSubmit = (formValues: any) => {
    // Filter out name fields - API only accepts IDs
    const { provinceName, countyName, cityName, ...cleanData } = formValues;
    
    const payload = {
      addressValue: cleanData.addressValue,
      addressDescription: cleanData.addressDescription,
      type: cleanData.type,
      lat: cleanData.lat || null,
      lng: cleanData.lng || null,
      isDefault: cleanData.isDefault,
      provinceId: cleanData.provinceId && Number(cleanData.provinceId) > 0 ? Number(cleanData.provinceId) : null,
      countyId: cleanData.countyId && Number(cleanData.countyId) > 0 ? Number(cleanData.countyId) : null,
      cityId: cleanData.cityId && Number(cleanData.cityId) > 0 ? Number(cleanData.cityId) : null,
    };

    if (mode === "edit" && selected?.id) {
      editMutation.mutate({ id: String(selected.id), data: payload });
    } else {
      addMutation.mutate(payload);
    }
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
          onClick={handleAdd}
        >
          <Plus className="ml-1 h-5 w-5" /> افزودن آدرس جدید
        </Button>
      </div>

      <div className="space-y-3">
        {addresses.map((addr: any) => (
          <Card
            key={addr.id}
            className={`relative flex justify-between items-start p-4 ${
              addr.isDefault ? "border-blue-400" : "border-gray-200"
            }`}
          >
            <CardContent className="p-0 flex-1">
              <p className="text-gray-700">{addr.addressValue}</p>
              {addr.postalCode && (
                <p className="text-sm text-gray-500 mt-1">کد پستی: {addr.postalCode}</p>
              )}
              {(addr.recipient || addr.phone) && (
                <p className="text-sm text-gray-500">
                  {addr.recipient ? `گیرنده: ${addr.recipient}` : ""}
                  {addr.recipient && addr.phone ? " | " : ""}
                  {addr.phone || ""}
                </p>
              )}
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
                    onClick={() => handleEdit(addr)}
                    className="cursor-pointer"
                  >
                    <Pencil className="h-4 w-4 ml-2" /> ویرایش
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(String(addr.id))}
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

      <AddressFormModal
        open={open}
        onClose={setOpen}
        mode={mode}
        initialValues={selected as any}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default AddressList;
