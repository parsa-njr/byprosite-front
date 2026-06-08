import { ErrorMessage, FieldArray } from "formik";
import { MapPin, Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetCategories,
  useGetGroups,
  useGetItems,
} from "@/query/globals/useGlobal";
import { Button } from "@/components/ui/button";

const FieldArrayCategory = ({
  setFieldValue,
  values,
  push,
  remove,
  index,
  item,
}) => {
  const { data: categoriesData, isLoading: loadingCategories } =
    useGetCategories();

  // console.log("items :::: ", item);
  // console.log("values :::: ", values);
  // 🔹 Groups + Items will be fetched manually (not auto)
  const {
    data: groupsData,
    isLoading: loadingGroups,
    refetch: refetchGroups,
  } = useGetGroups(values?.categories[index]?.categoryId); // start disabled

  const categoryOptions =
    categoriesData?.data?.data?.map((cat) => ({
      label: cat.title,
      value: cat.id,
    })) || [];

  const groupOptions =
    groupsData?.data?.data?.map((grp) => ({
      label: grp.title,
      value: grp.id,
    })) || [];
  return (
    <>
      <div
        key={index}
      >
        <div         className="flex justify-between items-start w-full gap-4"
>

        {/* دسته بندی */}
        <div className="flex w-[40%] flex-col gap-2">
          <label className="text-sm">دسته بندی</label>
          {/* @ts-ignore*/}
          <Select
            onValueChange={async (val) => {
              console.log("vaalllll :: ", val);
              setFieldValue(`categories.${index}.categoryId`, val);
              setFieldValue(`categories.${index}.groupIds`, []);

              if (val) await refetchGroups();
            }}
            value={item.categorieId}
          >
            <SelectTrigger>
              <SelectValue placeholder="دسته بندی" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions?.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* گروه‌ها */}
        <div className="flex w-[50%] flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">گروه‌ها</label>
          <Select
            onValueChange={(val) => {
              const newValue = parseInt(val);
              if (!values.groupIds.includes(newValue)) {
                setFieldValue("groupIds", [...values.groupIds, newValue]);
              }
            }}
          >
            <SelectTrigger className="w-full h-10">
              <SelectValue
                placeholder={
                  loadingGroups ? "در حال بارگذاری..." : "انتخاب گروه"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {groupOptions.map((group) => (
                <SelectItem key={group.value} value={group.value.toString()}>
                  {group.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex flex-wrap gap-2 mt-2">
            {values.groupIds.map((groupId, i) => {
              const group = groupOptions.find((g) => g.value == groupId);
              return group ? (
                <div
                  key={i}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-xs"
                >
                  <span>{group.label}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newGroups = values.groupIds.filter(
                        (id) => id != groupId
                      );
                      setFieldValue("groupIds", newGroups);
                    }}
                    className="mr-2 text-gray-500 hover:text-destructive"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ) : null;
            })}
          </div>

          <ErrorMessage
            name="groupIds"
            component="p"
            className="text-sm font-medium text-destructive mt-1"
          />
        </div>

        {/* Buttons */}
        <div className="flex  items-center gap-2 mt-8">
          {/* Add only on last row */}
         
          {/* Remove if more than 1 */}
          {values.categories.length > 1 && (
            <button type="button" onClick={() => remove(index)}>
              <Trash2
                size={20}
                className="bg-red-500 w-7 h-7 p-1 cursor-pointer text-white rounded-md"
              />
            </button>
          )}
        </div>
        </div>
         {index === values.categories.length - 1 && (
            <Button
              type="button"
              className="bg-secondary cursor-pointer w-20 h-7 mb-3"
              onClick={() => push({ categorieId: "", groupIds: [] })}
            >
              <Plus
                size={20}
                className=" w-7 h-7  text-white rounded-md"
              />
              افزودن
            </Button>
          )} 
      </div>
    </>
  );
};

export default FieldArrayCategory;
