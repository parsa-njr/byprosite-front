import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AddressFormModalProps,
  AddressFormValues,
  AddressType,
} from "@/types";
import Map from "../map/Map";
import globalApi from "@/api/globalApi";
import { toast } from "react-toastify";

const AddressFormModal: React.FC<AddressFormModalProps> = ({
  open,
  onClose,
  initialValues,
  onSubmit,
  mode = "create",
}) => {
  const [formData, setFormData] = useState<AddressFormValues>({
    isDefault: false,
    type: null,
    provinceId: null,
    countyId: null,
    cityId: null,
    provinceName: "",
    countyName: "",
    cityName: "",
    lat: null,
    lng: null,
    addressValue: "",
    addressDescription: "",
  });

  useEffect(() => {
    if (initialValues) {
      let typeValue: AddressType | null = null;

      // Map numeric type to AddressType string
      if (typeof initialValues?.type === "number") {
        const matched = addressTypeOptions?.find(
          // @ts-ignore
          (option, index) => index + 1 === initialValues?.type
        );
        if (matched) typeValue = matched?.value;
      } else if (typeof initialValues?.type === "string") {
        typeValue = initialValues?.type as AddressType;
      }

      setFormData((prev) => ({
        ...prev,
        ...initialValues,
        type: typeValue,
        provinceName: initialValues?.provinceName || "",
        countyName: initialValues?.countyName || "",
        cityName: initialValues?.cityName || "",
      }));
    }
  }, [initialValues, open]);

  const addressTypeOptions: { value: AddressType; label: string }[] = [
    { value: "Habitat", label: "مسکونی" },
    { value: "HeadOffice", label: "دفتر مرکزی" },
    { value: "Company", label: "شرکت" },
    { value: "SalesOffice", label: "دفتر فروش" },
    { value: "Cellar", label: "انبار" },
  ];

  const handleAddressChange = (newAddress: any) => {
    setFormData((prev) => {
      const newCity = newAddress.city ? newAddress.city : "";
      return {
        ...prev,
        addressValue: newAddress.address,
        provinceName: newAddress.state || prev.provinceName,
        countyName: newAddress.county || prev.countyName,
        cityName: newCity,
      };
    });
  };

  const handleLocationChange = ({ latitude, longitude }) => {
    setFormData((prev) => ({
      ...prev,
      lat: latitude,
      lng: longitude,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent style={{ direction: "rtl" }} className="max-w-lg ">
        <DialogHeader dir="rtl">
          <DialogTitle className="text-right">
            {mode === "edit" ? "ویرایش آدرس" : "افزودن آدرس"}
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-col gap-5 h-[70vh]">
          <Map
            initialCenter={{
              latitude: initialValues?.lat,
              longitude: initialValues?.lng,
            }}
            onAddressChange={handleAddressChange}
            onLocationChange={handleLocationChange}
            // initialCenter={
            //   initialValues?.lat && initialValues?.lng
            //     ? { latitude: initialValues.lat, longitude: initialValues.lng }
            //     : undefined
            // }
          />

          {/* isDefault */}
          <div className="flex items-center gap-2 my-4">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked: boolean) =>
                setFormData((prev) => ({ ...prev, isDefault: checked }))
              }
            />
            <label htmlFor="isDefault" className="text-sm">
              آدرس پیش‌فرض
            </label>
          </div>

          {/* Type */}
          <Select
            value={formData?.type ?? ""}
            onValueChange={(val: string) =>
              setFormData((prev) => ({ ...prev, type: val as AddressType }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب نوع آدرس" />
            </SelectTrigger>
            <SelectContent>
              {addressTypeOptions?.map((option) => (
                <SelectItem key={option?.value} value={option?.value}>
                  {option?.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Province / County / City */}
          <div className="flex justify-between gap-x-4 my-4">
            {/* Province */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm">استان</label>
              <div className="border rounded-md py-2 px-3 bg-gray-50 text-gray-800 text-sm">
                {formData.provinceName
                  ? formData.provinceName.replace(/^استان\s*/, "")
                  : "— انتخاب نشده —"}
              </div>
            </div>

            {/* County */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm">شهرستان</label>
              <div className="border rounded-md py-2 px-3 bg-gray-50 text-gray-800 text-sm">
                {formData.countyName
                  ? formData.countyName.replace(/^شهرستان\s*/, "")
                  : "— انتخاب نشده —"}
              </div>
            </div>

            {/* City */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-sm">شهر</label>
              <div className="border rounded-md py-2 px-3 bg-gray-50 text-gray-800 text-sm">
                {formData.cityName
                  ? formData.cityName
                  : formData.countyName
                  ? `${formData.countyName.replace(/^شهرستان\s*/, "")}`
                  : "— انتخاب نشده —"}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm">آدرس</label>
            <Textarea
              value={formData.addressValue || "در حال دریافت آدرس..."}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  addressValue: e.target.value,
                }))
              }
              placeholder="آدرس"
              readOnly
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm">جزئیات آدرس</label>
            <Textarea
              value={formData?.addressDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  addressDescription: e.target.value,
                }))
              }
              placeholder="توضیحات"
            />
          </div>
        </div>

        <Button
          type="button"
          className="mt-4"
          disabled={
            !formData?.addressValue ||
            !formData?.addressDescription ||
            !formData?.type ||
            !formData?.provinceName ||
            !formData?.countyName ||
            !formData?.cityName
          }
          onClick={async () => {
            try {
              let provinceId: number | null = null;
              let countyId: number | null = null;
              let cityId: number | null = null;

              if (formData.provinceName) {
                try {
                  const provinceRes = await globalApi.getProvinceIdByName(
                    formData.provinceName
                  );
                  provinceId = provinceRes.data?.data?.provinceId || null;
                } catch (err) {
                  // Ignore error, continue with other IDs
                }
              }

              if (formData.countyName) {
                try {
                  const countyRes = await globalApi.getCountyIdByName({
                    countyName: formData.countyName,
                    provinceId: provinceId || undefined,
                  });
                  countyId = countyRes.data?.data?.countyId || null;
                } catch (err) {
                  // Ignore error, continue with other IDs
                }
              }

              if (formData.cityName) {
                try {
                  const cityRes = await globalApi.getCityIdByName(
                    formData.cityName
                  );
                  cityId = cityRes.data?.data?.cityId || null;
                } catch (err) {
                  // Ignore error, continue with other IDs
                }
              }

              const updatedFormData = {
                ...formData,
                provinceId: provinceId,
                countyId: countyId,
                cityId: cityId,
              };

              onSubmit(updatedFormData);
              onClose(false);
            } catch (error: any) {
              toast.error(
                error.response?.data?.message ||
                  "خطا در دریافت اطلاعات استان، شهرستان و شهر. لطفاً دوباره تلاش کنید."
              );
            }
          }}
        >
          ثبت
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormModal;
