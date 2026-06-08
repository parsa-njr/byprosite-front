import CustomInput from "@/components/shared/CustomInput";
import { Button } from "@/components/ui/button";
import { ErrorMessage, Form, Formik } from "formik";
import StepHeader from "../StepHeader";
import { Loader2, Timer } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "react-toastify";
import * as Yup from "yup";

const Step6 = ({
  formData,
  setFormData,
  goNext,
  goPrev,
  submitLoading,
  updateFn,
  adId,
}) => {
  enum TypeOfTime {
    SingleStep = 0,
    MultiStep = 1,
  }
interface FormattedValues {
      typeOfTime: number;
      startDate: string;
      numberOfDays?: number;
      numberOfTimes?: number;
      validityDays?: number;
      intervalBetweenTimes?: number;
    }
  const validationSchema = Yup.object().shape({
    typeOfTime: Yup.number()
      .oneOf([TypeOfTime.SingleStep, TypeOfTime.MultiStep])
      .required("نوع زمان‌بندی الزامی است"),
    startDate: Yup.date().required("تاریخ انتشار الزامی است"),
    numberOfDays: Yup.number().when("typeOfTime", {
      is: TypeOfTime.SingleStep,
      then: (schema) => schema.required("تعداد روزهای پخش الزامی است").min(1),
      otherwise: (schema) => schema.notRequired(),
    }),
    numberOfTimes: Yup.number().when("typeOfTime", {
      is: TypeOfTime.MultiStep,
      then: (schema) => schema.required("تعداد دفعات چاپ الزامی است").min(1),
    }),
    validityDays: Yup.number().when("typeOfTime", {
      is: TypeOfTime.MultiStep,
      then: (schema) =>
        schema.required("مدت زمان اعتبار هر آگهی الزامی است").min(1),
    }),
    intervalBetweenTimes: Yup.number().when("typeOfTime", {
      is: TypeOfTime.MultiStep,
      then: (schema) =>
        schema.required("فاصله زمانی بین آگهی‌ها الزامی است").min(1),
    }),
  });

  const initialValues = {
    typeOfTime: formData?.timing?.typeOfTime ?? 0,
    startDate: formData?.timing?.startDate ?? "",
    numberOfDays: formData?.timing?.numberOfDays ?? "",
    numberOfTimes: formData?.timing?.numberOfTimes ?? "",
    validityDays: formData?.timing?.validityDays ?? "",
    intervalBetweenTimes: formData?.timing?.intervalBetweenTimes ?? "",
  };

  const handleSubmit = (values) => {
    

    const formattedValues: FormattedValues = {
      typeOfTime: Number(values.typeOfTime),
      startDate: values.startDate,
    };

    if (values.typeOfTime === TypeOfTime.SingleStep) {
      formattedValues.numberOfDays = Number(values.numberOfDays);
    } else {
      formattedValues.numberOfTimes = Number(values.numberOfTimes);
      formattedValues.validityDays = Number(values.validityDays);
      formattedValues.intervalBetweenTimes = Number(
        values.intervalBetweenTimes
      );
    }

    setFormData((prev) => ({ ...prev, timing: formattedValues }));

    updateFn(
      {
        id: adId,
        data: formattedValues,
      },
      {
        onSuccess: () => {
          toast.success("عملیات با موفقیت انجام شد", {
            position: "top-right",
            autoClose: 5000,
          });
          goNext();
        },
        onError: () => {
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
          <StepHeader
            title="زمان‌بندی"
            icon={<Timer className="h-8 w-8 text-primary" />}
          />

          <Card className="mt-5 p-4 sm:p-6 space-y-4">
            <CustomInput
              name="typeOfTime"
              type="select"
              label="نوع زمان‌بندی"
              value={values.typeOfTime}
              onChange={(val) => setFieldValue("typeOfTime", Number(val))}
              options={[
                { label: "تک‌مرحله‌ای", value: TypeOfTime.SingleStep },
                { label: "چندمرحله‌ای", value: TypeOfTime.MultiStep },
              ]}
            />
            <ErrorMessage
              name="typeOfTime"
              component="div"
              className="text-red-500 text-sm"
            />

            {values.typeOfTime === TypeOfTime.SingleStep && (
              <div className="flex gap-3 mt-2">
                <div className="flex-1">
                  <CustomInput
                    name="numberOfDays"
                    type="number"
                    label="تعداد روزهای پخش"
                    value={values.numberOfDays}
                    onChange={(val) => setFieldValue("numberOfDays", val)}
                  />
                  <ErrorMessage
                    name="numberOfDays"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                  
                </div>
                <div className="flex-1 mt-2">
                  <CustomInput
                    name="startDate"
                    type="date"
                    label="تاریخ انتشار"
                    value={values.startDate}
                    onChange={(val) => setFieldValue("startDate", val)}
                  />
                  <ErrorMessage
                    name="startDate"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              </div>
            )}

            {values.typeOfTime === TypeOfTime.MultiStep && (
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CustomInput
                      name="numberOfTimes"
                      type="number"
                      label="تعداد دفعات"
                      value={values.numberOfTimes}
                      onChange={(val) => setFieldValue("numberOfTimes", val)}
                    />
                    <ErrorMessage
                      name="numberOfTimes"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex-1 mt-2">
                    <CustomInput
                      name="startDate"
                      type="date"
                      label="تاریخ شروع"
                      value={values.startDate}
                      onChange={(val) => setFieldValue("startDate", val)}
                    />
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <CustomInput
                      name="validityDays"
                      type="number"
                      label="مدت زمان اعتبار هر آگهی"
                      value={values.validityDays}
                      onChange={(val) => setFieldValue("validityDays", val)}
                    />
                    <ErrorMessage
                      name="validityDays"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <CustomInput
                      name="intervalBetweenTimes"
                      type="number"
                      label="فاصله زمانی بین آگهی‌ها"
                      value={values.intervalBetweenTimes}
                      onChange={(val) =>
                        setFieldValue("intervalBetweenTimes", val)
                      }
                    />
                    <ErrorMessage
                      name="intervalBetweenTimes"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={goPrev}>
              قبلی
            </Button>
            <Button
              onClick={submitForm}
              className="w-16"
              disabled={submitLoading}
            >
              {submitLoading ? <Loader2 className="animate-spin" /> : "بعدی"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step6;
