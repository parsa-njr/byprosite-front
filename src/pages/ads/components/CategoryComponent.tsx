import CustomInput from "@/components/shared/CustomInput";
import {
  useGetCategories,
  useGetGroups,
  useGetItems,
} from "@/query/globals/useGlobal";
import { ErrorMessage } from "formik";
import { Layers } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const CategoryComponent = ({ setFieldValue, values, setCategoryLabels,touched, errors }) => {
  const { data: categoriesData, isLoading: loadingCategories } =
    useGetCategories();
  const {
    data: groupsData,
    isLoading: loadingGroups,
    refetch: refetchGroups,
  } = useGetGroups(values?.categoryId);

  const {
    data: itemsData,
    isLoading: loadingItems,
    refetch: refetchItems,
  } = useGetItems(values?.categoryId, values?.groupId);

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

  const itemOptions =
    itemsData?.data?.data?.map((itm) => ({
      label: itm.title,
      value: itm.id,
    })) || [];

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;

    // More comprehensive check
    const isDataReady =
      values.categoryId &&
      values.groupId &&
      values.itemId &&
      categoryOptions.some((opt) => opt.value === values.categoryId) &&
      groupOptions.some((opt) => opt.value === values.groupId) &&
      itemOptions.some((opt) => opt.value === values.itemId);

    if (isDataReady) {
      const selectedCat = categoryOptions.find(
        (c) => c.value === values.categoryId
      );
      const selectedGroup = groupOptions.find(
        (g) => g.value === values.groupId
      );
      const selectedItem = itemOptions.find((i) => i.value === values.itemId);

      setCategoryLabels({
        category: selectedCat?.label || "",
        group: selectedGroup?.label || "",
        item: selectedItem?.label || "",
      });
      setHasInitialized(true);
    }
  }, [
    categoryOptions,
    groupOptions,
    itemOptions,
    values.categoryId,
    values.groupId,
    values.itemId,
    hasInitialized,
  ]);
  return (
    <>
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <Layers className="h-5 w-5 text-secondary" />
        <h3 className="text-lg font-semibold text-primary">
          دسته‌بندی و گروه‌ها
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* دسته‌بندی */}
        <CustomInput
          type="select"
          onChange={async (val) => {
            const selectedCat = categoryOptions.find((c) => c.value === val);
            setFieldValue("categoryId", val);
            setFieldValue("groupId", "");
            setFieldValue("itemId", "");
            setCategoryLabels((prev) => ({
              ...prev,
              category: selectedCat?.label || "",
              group: "",
              item: "",
            }));
            if (val) await refetchGroups();
          }}
          options={categoryOptions}
          value={values?.categoryId}
          label="دسته‌بندی"
          placeholder={
            loadingCategories ? "در حال بارگذاری..." : "انتخاب دسته‌بندی"
          }
                          error={touched.categoryId && errors.categoryId}

        />
      

        {/* گروه‌بندی */}
        <CustomInput
          type="select"
          onChange={async (val) => {
            const selectedGroup = groupOptions.find((g) => g.value === val);
            setFieldValue("groupId", val);
            setFieldValue("itemId", "");
            setCategoryLabels((prev) => ({
              ...prev,
              group: selectedGroup?.label || "",
              item: "",
            }));
            if (val) await refetchItems();
          }}
          options={groupOptions}
          value={values?.groupId}
          label="گروه‌بندی"
          placeholder={
            loadingGroups ? "در حال بارگذاری..." : "انتخاب گروه‌بندی"
          }
          disabled={!values.categoryId}
                                    error={touched.groupId && errors.groupId}

        />
       

        {/* آیتم */}
        <CustomInput
          type="select"
          onChange={(val) => {
            const selectedItem = itemOptions.find((i) => i.value === val);
            setFieldValue("itemId", val);
            setCategoryLabels((prev) => ({
              ...prev,
              item: selectedItem?.label || "",
            }));
          }}
          options={itemOptions}
          value={values?.itemId}
          label="آیتم"
          placeholder={loadingItems ? "در حال بارگذاری..." : "انتخاب آیتم"}
          disabled={!values.groupId}
                                    error={touched.itemId && errors.itemId}

        />
       
      </div>
    </>
  );
};

export default CategoryComponent;
