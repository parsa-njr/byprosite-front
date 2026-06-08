import CustomInput from "@/components/shared/CustomInput";
import { Button } from "@/components/ui/button";
import { ErrorMessage, Form, Formik } from "formik";
import StepHeader from "../StepHeader";
import { FileText, Loader2, NotepadText, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import * as Yup from "yup";
import CategoryComponent from "../CategoryComponent";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const Step2 = ({
  formData,
  setFormData,
  goNext,
  goPrev,
  submitLoading,
  updateFn,
  adId,
  mode,
}) => {
  const validationSchema = Yup.object({
    categoryId: Yup.string().required("دسته بندی الزامی است"),
    groupId: Yup.string().required("گروه بندی الزامی است"),
    itemId: Yup.string().required("آیتم الزامی است"),
    // productDesc: Yup.string().required("توضیحات محصول الزامی است"),
    buySell: Yup.string().required("نوع آگهی الزامی است"),
  });
  const initialValues = {
    title: formData?.title || "",
    // description: formData?.description || "",
    categoryId: formData?.categoryId || "",
    groupId: formData?.groupId || "",
    itemId: formData?.itemId || "",
    // productDesc: formData?.productDesc || "",
    buySell: formData?.buySell || "",
    // status: 0,
  };
  // const initialValues = {
  //   title: formData?.title || "",
  //   // description: formData?.description || "",
  //   categoryId: mode != "edit" ? "" : formData?.categoryId || "",
  //   groupId: mode != "edit" ? "" : formData?.groupId || "",
  //   itemId: mode != "edit" ? "" : formData?.itemId || "",
  //   // productDesc: formData?.productDesc || "",
  //   buySell: mode != "edit" ? "" : formData?.buySell || "",
  //   // status: 0,
  // };

  const buySellOptions = [
    { label: "آگهی خرید", value: "buy" },
    { label: "آگهی فروش", value: "sell" },
  ];

  const [categoryLabels, setCategoryLabels] = useState({
    category: "",
    group: "",
    item: "",
  });

  useEffect(() => {
    console.log("categoryLabels :: ", categoryLabels);
  }, [categoryLabels]);

  const handleSubmit = (values) => {
    const adsType = buySellOptions.find(
      (item) => item.value === values?.buySell
    )?.label;

    const updatedValues = {
      ...values,
      title: `${adsType} : ${categoryLabels?.category}-${categoryLabels?.group}-${categoryLabels?.item}`, // e.g. set default if empty
      // description:`${adsType} : ${categoryLabels?.category}-${categoryLabels?.group}-${categoryLabels?.item}`
      // You can also format it like:
      // title: `[Updated] ${values.title}`
    };

    setFormData((prev) => ({ ...prev, ...updatedValues }));

    updateFn(
      {
        id: adId,
        data: updatedValues,
      },
      {
        onSuccess: () => {
          toast.success("عملیات با موفقیت انجام شد", {
            position: "top-right",
            autoClose: 5000,
          });
          goNext();
        },
        onError: (error) => {
          toast.error("خطا در انجام عملیات !", {
            position: "top-right",
            autoClose: 5000,
          });
        },
      }
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, touched, errors }) => (
        <Form className="space-y-6">
          <StepHeader
            title="اطلاعات پایه"
            icon={<NotepadText className="h-8 w-8 text-primary" />}
          />

          {/* Section 1: Ad Info */}
          <Card className="rounded-2xl border p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <FileText className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-semibold text-primary">
                جزئیات آگهی
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                type="select"
                onChange={(val) => setFieldValue("buySell", val)}
                options={buySellOptions}
                value={values?.buySell}
                label="نوع آگهی"
                placeholder="نوع آگهی را انتخاب کنید"
                error={touched.buySell && errors.buySell}
              />
            </div>
          </Card>

          {/* Section 2: Categories */}
          <Card className="rounded-2xl border p-6 shadow-sm space-y-5">
            <CategoryComponent
              setFieldValue={setFieldValue}
              values={values}
              setCategoryLabels={setCategoryLabels}
              touched={touched}
              errors={errors}
            />
          </Card>

          {/* Section 3: Product Details */}
          {/* <Card className="rounded-2xl border p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <Package className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-semibold text-primary">
                جزئیات محصول
              </h3>
            </div>

            <CustomInput
              type="textarea"
              onChange={(val) => setFieldValue("productDesc", val)}
              value={values?.productDesc}
              label="توضیحات محصول"
              placeholder="توضیحات مورد نظر خود را وارد کنید"
            />
            <ErrorMessage
              name="productDesc"
              component="div"
              className="text-red-500 text-sm"
            />
          </Card> */}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              className="w-16"
              onClick={goPrev}
            >
              قبلی
            </Button>
            <Button type="submit" className="w-16" disabled={submitLoading}>
              {submitLoading ? <Loader2 className="animate-spin" /> : "بعدی"}{" "}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step2;
