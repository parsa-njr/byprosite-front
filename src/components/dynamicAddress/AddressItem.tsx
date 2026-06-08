import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Pencil, Trash2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const AddressItem = ({
  address,
  isSelected,
  //   handleSelect,
  handleEdit,
  handleDelete,
  addressList,
  // new props
  isMulti = false,
  isChecked = false,
  showActions = true,
  showSelection = true,
}) => {
  return (
    <Card
      key={address.id}
      className={`relative flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 transition-all hover:shadow-md ${
        isSelected
          ? "border-2 border-primary bg-primary/5"
          : "border border-gray-200 hover:border-gray-300"
      } ${address?.isDefault ? "bg-blue-50/50" : "bg-white"}`}
    >
      <CardContent
        className="p-0 flex gap-4 flex-1 flex-col sm:flex-row sm:items-center"
        // onClick={() => handleSelect(address)}
      >
        {/* Selection control: radio for single-select, checkbox for multi-select */}
        {showSelection && (isMulti || isSelected !== undefined) && (
          <div onClick={(e) => e.stopPropagation()}>
            {isMulti ? (
              <Checkbox
                id={`address-${address?.id}`}
                checked={isChecked}
                onCheckedChange={() => {}}
                className="mt-1 shrink-0"
              />
            ) : (
              <RadioGroup value={isSelected ? address?.id?.toString() : ""} onValueChange={() => {}}>
                <RadioGroupItem
                  value={address?.id?.toString()}
                  id={`address-${address?.id}`}
                  className="mt-1 shrink-0"
                />
              </RadioGroup>
            )}
          </div>
        )}

        <MapPin
          className={`h-7 w-7 shrink-0 ${
            address?.isDefault ? "text-blue-500" : "text-gray-400"
          }`}
        />
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-800 font-medium text-base">
              {address?.addressValue}
            </p>
            {address?.isDefault && (
              <Badge variant="default" className="shrink-0 text-xs">
                پیشفرض
              </Badge>
            )}
            {address?.type && (() => {
              // تبدیل type به string و map کردن عدد به string
              const typeOptions = ['Habitat', 'HeadOffice', 'Company', 'SalesOffice', 'Cellar'];
              let typeStr: string;
              
              if (typeof address.type === 'number') {
                // اگر type عدد است (1-5)، به string تبدیل کن
                typeStr = typeOptions[address.type - 1] || '';
              } else {
                typeStr = address.type as string;
              }
              
              const typeMap: Record<string, string> = {
                "Habitat": "مسکونی",
                "HeadOffice": "دفتر مرکزی",
                "Company": "شرکت",
                "SalesOffice": "دفتر فروش",
                "Cellar": "انبار"
              };
              
              // فقط اگر type معتبر است Badge را نمایش بده
              if (typeStr && typeMap[typeStr]) {
                return (
                  <Badge variant="outline" className="shrink-0 text-xs">
                    {typeMap[typeStr]}
                  </Badge>
                );
              }
              return null;
            })()}
          </div>
          {address?.addressDescription && (
            <p className="text-sm text-gray-600 mt-1">
              {address.addressDescription}
            </p>
          )}
          {(address?.provinceName || address?.countyName || address?.cityName) && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 flex-wrap">
              {address?.provinceName && (
                <span>{address.provinceName.replace(/^استان\s*/, "")}</span>
              )}
              {address?.countyName && (
                <>
                  {address?.provinceName && <span>،</span>}
                  <span>{address.countyName.replace(/^شهرستان\s*/, "")}</span>
                </>
              )}
              {address?.cityName && (
                <>
                  {(address?.provinceName || address?.countyName) && <span>،</span>}
                  <span>{address.cityName}</span>
                </>
              )}
            </p>
          )}
        </div>
      </CardContent>

      {showActions && (
        <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-2">
          <Button
            type="button"
            variant="outline"
            className="border"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(address?.id);
            }}
          >
            <Pencil className="h-6 w-6" />
          </Button>

          {addressList?.length > 0 && (
            <Button
              type="button"
              variant="outline"
              className="text-red-500 border"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(address?.id);
              }}
            >
              <Trash2 className="h-6 w-6" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default AddressItem;
