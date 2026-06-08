import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, ShoppingBasket } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
// import AddressItem from "../address/AddressItem";
import AddressFormModal from "../address/AddressFormModal";
import AddressItem from "./AddressItem";
import { addressList } from "@/constants/fakeData";
import { AddressFormValues } from "@/types";
import {
  useAddAddress,
  useDeleteAddress,
  useEditAddress,
  useGetAddressList,
} from "@/query/globals/useGlobal";
const defaultAddress = {
  id: "", // add id for easier selection
  addressValue: "",
  addressDescription: "",
  type: "Habitat",
  lat: 0,
  lng: 0,
  isDefault: false,
  provinceId: 0,
  countyId: 0,
  cityId: 0,
};

export default function AddressComponent({
  onSelect,
  defaultSelectedId = null,
  title,
  multiSelect = false,
  showActions = true,
  showSelection = true,
}) {
  // @ts-ignore
  const { data, isLoading, isSuccess, error } = useGetAddressList();
  const { mutate: deleteAddress } = useDeleteAddress();
  const { mutate: addAddress } = useAddAddress();
  const { mutate: editAddress } = useEditAddress();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [editIndex, setEditIndex] = useState(null);
  // @ts-ignore
  const [initialAddress, setInitialAddress] =
    // @ts-ignore
    useState<AddressFormValues>(defaultAddress);
  // if multiSelect, keep array of selected ids, otherwise single selected id
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // Track if we've already initialized from defaultSelectedId to prevent infinite loop
  const hasInitializedRef = useRef(false);
  const lastDefaultSelectedIdRef = useRef<any>(null);

  // Handle default selected address
  useEffect(() => {
    if (!addresses.length) return;

    // Check if defaultSelectedId has actually changed
    const defaultSelectedIdStr = JSON.stringify(defaultSelectedId);
    const hasChanged = lastDefaultSelectedIdRef.current !== defaultSelectedIdStr;

    if (multiSelect) {
      // defaultSelectedId can be an array of ids (strings or numbers)
      const defaults = Array.isArray(defaultSelectedId)
        ? defaultSelectedId
        : defaultSelectedId
        ? [defaultSelectedId]
        : [];
      if (defaults.length && (hasChanged || !hasInitializedRef.current)) {
        // Normalize to numbers for state management
        const normalizedIds = defaults.map((d) => Number(d));
        const currentSelectedIdsStr = JSON.stringify([...selectedIds].sort());
        const normalizedIdsStr = JSON.stringify([...normalizedIds].sort());
        
        // Only update if the IDs are actually different
        if (currentSelectedIdsStr !== normalizedIdsStr) {
          setSelectedIds(normalizedIds);
          // pass array of ids to onSelect (keep as strings for consistency)
          const selectedAddresses = addresses.filter((a) => 
            defaults.some((d) => String(d) === String(a.id))
          );
          const idsToSend = selectedAddresses.map((a) => String(a.id));
          onSelect?.(idsToSend);
        }
        hasInitializedRef.current = true;
        lastDefaultSelectedIdRef.current = defaultSelectedIdStr;
      } else if (!defaults.length && hasInitializedRef.current) {
        // Reset if defaults is empty but we previously had values
        hasInitializedRef.current = false;
        lastDefaultSelectedIdRef.current = null;
      }
    } else {
      if (defaultSelectedId && (hasChanged || !hasInitializedRef.current)) {
        const found = addresses.find((a) => a.id === defaultSelectedId);
        if (found && selectedId !== found.id) {
          setSelectedId(found.id);
          onSelect?.(found);
          hasInitializedRef.current = true;
          lastDefaultSelectedIdRef.current = defaultSelectedIdStr;
        }
      } else if (!defaultSelectedId && hasInitializedRef.current) {
        hasInitializedRef.current = false;
        lastDefaultSelectedIdRef.current = null;
      }
    }
  }, [defaultSelectedId, addresses, multiSelect]);

  useEffect(() => {
    if (data?.data?.data) {
      setAddresses(data?.data?.data);
    }
  }, [data]);

  const handleAddClick = () => {
    // @ts-ignore
    setInitialAddress({ ...defaultAddress, id: Date.now() });
    setMode("create");
    setEditIndex(null);
    setModalOpen(true);
  };

  const handleSubmit = (data: AddressFormValues) => {
    const newData = { ...data };
    const addData = {
      addressValue: newData?.addressValue,
      addressDescription: newData?.addressDescription,
      type: newData?.type,
      lat: newData?.lat || null,
      lng: newData?.lng || null,
      isDefault: newData?.isDefault,
      provinceId: newData?.provinceId && Number(newData.provinceId) > 0 ? Number(newData.provinceId) : null,
      countyId: newData?.countyId && Number(newData.countyId) > 0 ? Number(newData.countyId) : null,
      cityId: newData?.cityId && Number(newData.cityId) > 0 ? Number(newData.cityId) : null,
    };
    if (mode === "create") {
      // Call addAddress API
      addAddress(addData, {
        onSuccess: (res) => {
          toast.success(res.data?.message || "آدرس با موفقیت اضافه شد");
          setAddresses((prev) => [res.data?.data || newData, ...prev]);
          setModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "اضافه کردن آدرس با خطا مواجه شد"
          );
        },
      });
    }
    if (mode === "edit" && editIndex !== null) {
      const id = addresses[editIndex]?.id; // URL param
      const body = {
        addressValue: newData?.addressValue,
        addressDescription: newData?.addressDescription,
        type: newData?.type,
        lat: newData?.lat || null,
        lng: newData?.lng || null,
        isDefault: newData?.isDefault,
        provinceId: newData?.provinceId && Number(newData.provinceId) > 0 ? Number(newData.provinceId) : null,
        countyId: newData?.countyId && Number(newData.countyId) > 0 ? Number(newData.countyId) : null,
        cityId: newData?.cityId && Number(newData.cityId) > 0 ? Number(newData.cityId) : null,
      };

      editAddress(
        { id, data: body },
        {
          onSuccess: (res) => {
            toast.success(res.data?.message || "آدرس با موفقیت ویرایش شد");
            setAddresses((prev) => {
              const updated = [...prev];
              updated[editIndex] = body;
              return updated;
            });
            setModalOpen(false);
          },
          onError: (err: any) => {
            toast.error(
              err.response?.data?.message || "ویرایش آدرس با خطا مواجه شد"
            );
          },
        }
      );
    }
  };

  const handleDelete = (id: any, index: number) => {
    const deleted = addresses[index];

    // Show SweetAlert2 confirmation
    Swal.fire({
      text: "می خواهید آدرس رو حذف کنید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف کن",
      cancelButtonText: "انصراف",
      width: "400px",
      allowOutsideClick: true,
      position: "center",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      buttonsStyling: false, // Disable default styles to apply custom styles
      customClass: {
        popup: "font-sansWeb ", // Apply the Tailwind font class
        title: "font-sansWeb !text-sm",
        confirmButton:
          "bg-primary cursor-pointer hover:opcity-[85] text-white text-[16px] mx-[20px] mt-[30px] py-2 px-4 rounded font-sansWeb ",
        cancelButton:
          "bg-secondary cursor-pointer hover:opcity-[85] text-white py-2 px-4 rounded ml-2  text-[16px] mt-[30px] font-sansWeb ",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // Optimistic UI update

        if (deleted.id === selectedId) {
          setSelectedId(null);
          onSelect?.(null);
        }

        // Call delete mutation
        deleteAddress(id, {
          onSuccess: (res) => {
            toast.success(res.data?.message || "آدرس با موفقیت حذف شد");
            setAddresses(addresses.filter((_, i) => i !== index));
          },
          onError: (err: any) => {
            // Rollback UI update if needed
            setAddresses((prev) => [
              ...prev.slice(0, index),
              deleted,
              ...prev.slice(index),
            ]);
            toast.error(
              err.response?.data?.message || "حذف آدرس با خطا مواجه شد"
            );
          },
        });
      }
    });
  };

  const handleEdit = (address, index) => {
    setInitialAddress(address);
    setEditIndex(index);
    setMode("edit");
    setModalOpen(true);
  };

  const handleSelect = (address) => {
    if (multiSelect) {
      // toggle id in selectedIds
      setSelectedIds((prev) => {
        const exists = prev.includes(address.id);
        const updated = exists ? prev.filter((id) => id !== address.id) : [address.id, ...prev];
        // call onSelect with array of string ids for consistency
        onSelect?.(updated.map((id) => String(id)));
        return updated;
      });
    } else {
      setSelectedId(address.id);
      onSelect?.(address);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-200">
        <h3 className="flex items-center text-lg font-semibold text-primary gap-2 pb-2 ">
          <span className="bg-secondary/20 p-2 rounded-full">
            <MapPin className="h-5 w-5 text-secondary" />
          </span>
          {title || "آدرس ها"}
        </h3>

        <Button
          type="button"
          variant="ghost"
          className="text-secondary"
          onClick={handleAddClick}
        >
          <Plus className="ml-1 h-5 w-5" /> افزودن آدرس جدید
        </Button>
      </div>

      {/* Address list */}

      {addresses.length ? (
        <div className="space-y-3">
              {addresses.map((address, index) => (
                <div
                  key={address.id}
                  onClick={() => handleSelect(address)}
                  className="cursor-pointer"
                >
                  <AddressItem
                    key={address.id}
                    address={address}
                    isSelected={selectedId?.toString() === address?.id?.toString()}
                    isMulti={multiSelect}
                    isChecked={selectedIds.includes(address.id)}
                    showActions={showActions}
                    showSelection={showSelection}
                    handleDelete={() => handleDelete(address?.id, index)}
                    handleEdit={() => handleEdit(address, index)}
                    // handleSelect={() => handleSelect(address)}
                    addressList={addresses}
                  />
                </div>
              ))}
        </div>
      ) : (
        <div className="mb-64 w-full">
          {/* <ShoppingBasket size={155} className="mx-auto text-gray-500" /> */}
          <div className="text-gray-500 mx-auto text-center w-full">
            هنوز آدرسی اضافه نکردید
          </div>
        </div>
      )}

      {/* Address modal */}
      <AddressFormModal
        open={modalOpen}
        onClose={setModalOpen}
        initialValues={initialAddress}
        mode={mode}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
