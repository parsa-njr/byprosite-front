import CustomInput from "@/components/shared/CustomInput";
import { Button } from "@/components/ui/button";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import StepHeader from "../StepHeader";
import { Info, Loader2, Package, SquarePen, Truck } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AddressComponent from "@/components/dynamicAddress/AddressComponent";
import { toast } from "react-toastify";
import { useGetEnvironmentalProperies } from "@/query/globals/useGlobal";
import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Card } from "@/components/ui/card";
import FileUpload from "@/components/shared/FileUpload";

const Step8 = ({
  formData,
  setFormData,
  goNext,
  goPrev,
  submitLoading,
  updateFn,
  adId,
}) => {
  const storedUser = localStorage.getItem("user");
  //   const user = storedUser ? JSON.parse(storedUser) : null;
  //   const accessToken = localStorage.getItem("accessToken");

  const validationSchema = Yup.object().shape({
    // dleiveryLocations: Yup.number()
    //   .nullable()
    //   .required("شناسه محل تحویل الزامی است")
    //   .typeError("شناسه محل تحویل باید عدد باشد"),

    environmentalProperties: Yup.array()
      .of(Yup.string().trim().required("هر مجوز  محیطی باید مقدار داشته باشد"))
      .min(1, "حداقل یک مجوز  محیطی باید انتخاب شود")
      .required("مجوز ‌های محیطی الزامی است"),

    description: Yup.string()
      .trim()
      // .required("توضیحات الزامی است")
      .max(1000, "توضیحات نمی‌تواند بیش از ۵۰۰ کاراکتر باشد"),
  });
  const initialValues = {
    deliveryLocations:
      formData?.deliveryLocations &&
      typeof formData?.deliveryLocations === "string"
        ? JSON.parse(formData?.deliveryLocations)
        : [],
    environmentalProperties:
      formData?.environmentalProperties &&
      typeof formData?.environmentalProperties === "string"
        ? JSON.parse(formData?.environmentalProperties)
        : [],
    description: formData?.description || "",
  };

  const { data: propertyList, isLoading: propertyLoading } =
    useGetEnvironmentalProperies();

  const [propertyOptions, setPropertyOptions] = useState([]);

  useEffect(() => {
    console.log("propertyList :: ", propertyList);
    if (propertyList) {
      setPropertyOptions(() =>
        propertyList.data.data?.map((item) => ({
          label: item?.title,
          value: item?.id,
        }))
      );
    }
  }, [propertyList]);

  const handleSubmit = (values) => {
    // Convert delivery location IDs to strings before stringifying
    const deliveryLocationsAsStrings = Array.isArray(values.deliveryLocations)
      ? values.deliveryLocations.map((id) => String(id))
      : values.deliveryLocations;

    const updatedVal = {
      ...values,
      environmentalProperties: JSON.stringify(values.environmentalProperties),
      deliveryLocations: JSON.stringify(deliveryLocationsAsStrings),
    };
    setFormData((prev) => ({ ...prev, ...updatedVal }));
    updateFn(
      {
        id: adId,
        data: updatedVal,
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
          console.log(error);
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
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, submitForm }) => (
        <Form className="space-y-3">
          <StepHeader
            title="اطلاعات تکمیلی"
            icon={<SquarePen className="h-8 w-8 text-primary" />}
          />
          {/* {console.log('values :: ',values)} */}

          <Card className="rounded-2xl border p-6 shadow-sm space-y-1">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <Package className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-semibold text-primary">
                مجوز های محیط زیستی
              </h3>
            </div>

            <CustomInput
              type="multiSelect"
              value={values?.environmentalProperties}
              onChange={(val) => {
                setFieldValue("environmentalProperties", val);
              }}
              // label="مجوز های خود را انت"
              placeholder="انتخاب کنید"
              options={propertyOptions}
            />
            <ErrorMessage
              name="environmentalProperties"
              component="div"
              className="text-red-500 text-sm"
            />

            <div>
              <FileUpload
                label="فایل  مجوز های محیط زیستی "
                advertisementId={adId}
                segment="4"

              />
            </div>
          </Card>
          <Card className="rounded-2xl border p-6 shadow-sm ">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <Package className="h-5 w-5 text-secondary" />
              <h3 className="text-lg font-semibold text-primary">
                توضیحات آگهی
              </h3>
            </div>
            <div className=" text-xs text-gray-400 flex gap-2 items-center">
              <Info />
              درصورت وارد کردن توضیحات , آگهی شما برای انتشار نیازمند تایید
              ادمین می باشد{" "}
            </div>
            <CustomInput
              type="textarea"
              onChange={(val) => setFieldValue("description", val)}
              value={values?.description}
              // label="توضیحات محصول"
              placeholder="توضیحات مورد نظر خود را وارد کنید"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-500 text-sm"
            />
          </Card>
          <div className="flex flex-col gap-8">
            {/* Written Response Section */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col gap-4">
              <div className="mt-2">
                <AddressComponent
                  multiSelect={true}
                  onSelect={(val) => {
                    // val will be an array of string ids when multiSelect is true
                    console.log("selected delivery address ids :: ", val);
                    setFieldValue("deliveryLocations", val || []);
                  }}
                  defaultSelectedId={initialValues.deliveryLocations}
                  // hide edit/delete buttons in this step
                  showActions={false}
                  title="انتخاب آدرس محل تحویل"
                />
                <ErrorMessage
                  name="placeOfDeliveryId"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
           
            <ErrorMessage
              name="answeringPhone"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div> */}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={goPrev}>
              قبلی
            </Button>
            <Button
              onClick={submitForm}
              className="w-16"
              disabled={submitLoading}
            >
              {submitLoading ? <Loader2 className="animate-spin" /> : "بعدی"}{" "}
            </Button>{" "}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step8;
