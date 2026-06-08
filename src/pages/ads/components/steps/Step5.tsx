import CustomInput from "@/components/shared/CustomInput";
import { Button } from "@/components/ui/button";
import { ErrorMessage, Form, Formik } from "formik";
import * as Yup from "yup";
import StepHeader from "../StepHeader";
import { Loader2, Newspaper } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AddressComponent from "@/components/dynamicAddress/AddressComponent";
import { toast } from "react-toastify";

const Step5 = ({
  formData,
  setFormData,
  goNext,
  goPrev,
  submitLoading,
  updateFn,
  adId,
}) => {
  const validationSchema = Yup.object({
    answeringPhone: Yup.string().required("شماره تماس الزامی است"),
    responseAddress: Yup.array().when("writtenResponse", {
      is: true,
      then: (schema) =>
        schema.min(1, "انتخاب حداقل یک آدرس جهت ارسال پاسخ الزامی است.").required(),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const accessToken = localStorage.getItem("accessToken");
  const initialValues = {
    answeringPhone: formData?.answeringPhone || user?.phoneNumber,
    writtenResponse: formData?.writtenResponse || false,
    responseAddress:
      formData?.responseAddress && typeof formData?.responseAddress === "string"
        ? JSON.parse(formData?.responseAddress)
        : [],
  };

  const handleSubmit = (values) => {
    console.log("values :: ", values);

    // Convert address IDs to strings before stringifying
    const addressIdsAsStrings = Array.isArray(values.responseAddress)
      ? values.responseAddress.map((id) => String(id))
      : values.responseAddress;

    const updatedVal = {
      ...values,
      responseAddress: JSON.stringify(addressIdsAsStrings),
    };

    console.log("updatedVal :: ", updatedVal);
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
      {({ setFieldValue, values, submitForm }) => (
        <Form className="space-y-3">
          <StepHeader icon={<Newspaper className="h-8 w-8 text-primary" />} />
          <div className="flex flex-col gap-8">
            {/* Phone Section */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6">
              <CustomInput
                type="number"
                onChange={(val) => setFieldValue("answeringPhone", val)}
                value={values?.answeringPhone}
                label="شماره تماس جهت پاسخگویی"
                placeholder="شماره مورد نظر خود را وارد کنید"
              />
              <ErrorMessage
                name="answeringPhone"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Written Response Section */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  id="writtenResponse"
                  checked={values?.writtenResponse}
                  onCheckedChange={(checked) =>
                    setFieldValue("writtenResponse", checked === true)
                  }
                  className="h-5 w-5"
                />
                <Label
                  htmlFor="writtenResponse"
                  className="text-sm font-normal leading-none cursor-pointer text-gray-700"
                >
                  نیاز به ارسال پاسخ مکتوب
                </Label>
              </div>

              <ErrorMessage
                name="responseAddress"
                component="div"
                className="text-red-500 text-sm"
              />

              {values?.writtenResponse && (
                <div className="mt-4">
                  <AddressComponent
                    multiSelect={true}
                    onSelect={(val) => {
                      // val will be an array of ids when multiSelect is true
                      console.log("selected address ids :: ", val);
                      setFieldValue("responseAddress", val || []);
                    }}
                    defaultSelectedId={initialValues.responseAddress}
                    showActions={false}
                    title="انتخاب آدرس"
                  />
                </div>
              )}
            </div>
          </div>

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

export default Step5;
