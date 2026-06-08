import CustomInput from "@/components/shared/CustomInput";
import { Button } from "@/components/ui/button";
import { ErrorMessage, Form, Formik } from "formik";
import StepHeader from "../StepHeader";
import { CopyCheck, Loader2, Newspaper } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

const Step7 = ({
  formData,
  setFormData,
  goNext,
  goPrev,
  submitLoading,
  updateFn,
  adId,
}) => {
  const validationSchema = Yup.object().shape({
    sampleAmount: Yup.number().typeError("حداقل باید عدد باشد"),

    samplePrice: Yup.number().typeError("حداکثر باید عدد باشد"),

    visitingStartTime: Yup.string().when("writtenResponse", {
      is: true,
      then: (schema) =>
        schema.required("انتخاب آدرس جهت ارسال پاسخ الزامی است."),
      otherwise: (schema) => schema.notRequired(),
    }),
    visitingEndTime: Yup.string().when("writtenResponse", {
      is: true,
      then: (schema) =>
        schema.required("انتخاب آدرس جهت ارسال پاسخ الزامی است."),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
  const initialValues = {
    visiting: formData?.visiting || false,
    visitingStartTime: formData?.visitingStartTime || "",
    visitingEndTime: formData?.visitingEndTime || "",
    chat: formData?.chat || false,

    sample: formData?.sample || false,
    sampleAmount: formData?.sampleAmount || 0,
    samplePrice: formData?.samplePrice || 0,

    testingWithoutSampling: formData?.testingWithoutSampling || false,
    testingWithSampling: formData?.testingWithSampling || false,
    loadingOrigin: formData?.loadingOrigin || false,
    unloadingDestination: formData?.unloadingDestination || false,
    transportationOriginDestination:
      formData?.transportationOriginDestination || false,
    inspectionCertificates: formData?.inspectionCertificates || false,
    warehouseStorage: formData?.warehouseStorage || false,
  };

  const [isFree, setIsFree] = useState(false);

  const handleSubmit = (values) => {
    setFormData((prev) => ({ ...prev, ...values }));
    updateFn(
      {
        id: adId,
        data: values,
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
      // validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, submitForm }) => (
        <Form className="space-y-3">
          <StepHeader icon={<CopyCheck className="h-8 w-8 text-primary" />} />
          <div className="flex flex-col gap-4 mx-10">
            {/* Visiting Option */}
            <Card className="shadow-sm !py-4 px-2">
              <CardContent className=" flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="visiting"
                    checked={values?.visiting}
                    onCheckedChange={(checked) =>
                      setFieldValue("visiting", checked === true)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="visiting"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    وجود امکان بازدید
                  </Label>
                </div>

                {values?.visiting && (
                  <div className="flex flex-col gap-1 pl-4">
                    <Label className="text-sm font-medium text-gray-600">
                      بازه‌ی بازدید
                    </Label>
                    <CustomInput
                      type="date"
                      range
                      rangeHover
                      // @ts-ignore
                      value={
                        values.visitingStartTime && values.visitingEndTime
                          ? [
                              new Date(values.visitingStartTime),
                              new Date(values.visitingEndTime),
                            ]
                          : null
                      }
                      onChange={(val) => {
                        if (Array.isArray(val)) {
                          const [start, end] = val;
                          setFieldValue("visitingStartTime", start);
                          setFieldValue("visitingEndTime", end);
                        } else {
                          setFieldValue("visitingStartTime", val);
                          setFieldValue("visitingEndTime", null);
                        }
                      }}
                    />
                    <ErrorMessage
                      name="visiting"
                      component="div"
                      className="text-red-500 text-xs"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Chat Option */}
            <Card className="shadow-sm  !py-4 px-2">
              <CardContent className=" flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="chat"
                    checked={values?.chat}
                    onCheckedChange={(checked) =>
                      setFieldValue("chat", checked === true)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="chat"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    نیاز به چت
                  </Label>
                </div>
                <ErrorMessage
                  name="responseAddressId"
                  component="div"
                  className="text-red-500 text-xs pl-4"
                />
              </CardContent>
            </Card>

            {/* Sample Option */}
            <Card className="shadow-sm rounded-2xl border border-gray-200 px-4 py-3">
              <CardContent className="flex flex-col gap-3">
                {/* امکان اخذ نمونه */}
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="sample"
                    checked={values?.sample}
                    onCheckedChange={(checked) =>
                      setFieldValue("sample", checked === true)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="sample"
                    className="text-sm font-medium text-gray-800 cursor-pointer"
                  >
                    امکان اخذ نمونه
                  </Label>
                </div>

                {values?.sample && (
                  <div className="flex justify-between flex-wrap items-center gap-4 ">
                    {/* مقدار نمونه */}
                    <div className="w-40">
                      <CustomInput
                        type="text"
                        onChange={(val) => setFieldValue("sampleAmount", val)}
                        value={values?.sampleAmount}
                        label="مقدار نمونه"
                        placeholder="مقدار"
                      />
                    </div>

                    {/* هزینه رایگان */}
                    <div className="flex items-center gap-2 mt-5">
                      <Checkbox
                        id="isFree"
                        checked={isFree}
                        onCheckedChange={(checked) =>
                          setIsFree(checked === true)
                        }
                        className="h-4 w-4"
                      />
                      <Label
                        htmlFor="isFree"
                        className="text-sm font-medium text-gray-800 cursor-pointer"
                      >
                        هزینه رایگان
                      </Label>
                    </div>

                    {/* قیمت نمونه */}
                    {!isFree && (
                      <div className="w-40">
                        <CustomInput
                          type="text"
                          onChange={(val) => setFieldValue("samplePrice", val)}
                          value={values?.samplePrice}
                          label="قیمت نمونه"
                          placeholder="قیمت"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-sm  !py-4 px-2">
              <CardContent className=" flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="testingWithoutSampling"
                    checked={values?.testingWithoutSampling}
                    onCheckedChange={(checked) =>
                      setFieldValue("testingWithoutSampling", checked === true)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="testingWithoutSampling"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    آزمایش کالا (بدون نمونه گیری ) توسط آزمایشگاه های عضو پلتفرم
                  </Label>
                </div>
                <ErrorMessage
                  name="testingWithoutSampling"
                  component="div"
                  className="text-red-500 text-xs pl-4"
                />
              </CardContent>
            </Card>
            <Card className="shadow-sm  !py-4 px-2">
              <CardContent className=" flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="testingWithSampling"
                    checked={values?.testingWithSampling}
                    onCheckedChange={(checked) =>
                      setFieldValue("testingWithSampling", checked === true)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="testingWithSampling"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    نمونه گیری و آزمایش کالا توسط آزمایشگاه های عضو پلتفرم
                  </Label>
                </div>
                <ErrorMessage
                  name="testingWithSampling"
                  component="div"
                  className="text-red-500 text-xs pl-4"
                />
              </CardContent>
            </Card>
            <Card className="shadow-sm  !py-4 px-2">
              <CardContent className=" flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="loadingOrigin"
                    checked={values?.loadingOrigin}
                    onCheckedChange={(checked) =>
                      setFieldValue("loadingOrigin", checked === true)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="loadingOrigin"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    نیاز به خدمات بارگیری در مبدا توسط شرکت های حمل پلتفرم{" "}
                  </Label>
                </div>
                <ErrorMessage
                  name="loadingOrigin"
                  component="div"
                  className="text-red-500 text-xs pl-4"
                />
              </CardContent>
            </Card>
            <Card className="shadow-sm  !py-4 px-2">
              <CardContent className=" flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="transportationOriginDestination"
                    checked={values?.transportationOriginDestination}
                    onCheckedChange={(checked) =>
                      setFieldValue(
                        "transportationOriginDestination",
                        checked === true
                      )
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="transportationOriginDestination"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    نیاز به خدمات حمل از مبدا تا مقصد توسط شرکت های حمل عضو
                    پلتفرم{" "}
                  </Label>
                </div>
                <ErrorMessage
                  name="transportationOriginDestination"
                  component="div"
                  className="text-red-500 text-xs pl-4"
                />
              </CardContent>
            </Card>
            <Card className="shadow-sm  !py-4 px-2">
              <CardContent className=" flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="unloadingDestination"
                    checked={values?.unloadingDestination}
                    onCheckedChange={(checked) =>
                      setFieldValue("unloadingDestination", checked === true)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="unloadingDestination"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    نیاز به خدمات تخلیه در مقصد توسط شرکت های حمل عضو پلتفرم{" "}
                  </Label>
                </div>
                <ErrorMessage
                  name="unloadingDestination"
                  component="div"
                  className="text-red-500 text-xs pl-4"
                />
              </CardContent>
            </Card>
            <Card className="shadow-sm  !py-4 px-2">
              <CardContent className=" flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="inspectionCertificates"
                    checked={values?.inspectionCertificates}
                    onCheckedChange={(checked) =>
                      setFieldValue("inspectionCertificates", checked === true)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="inspectionCertificates"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    نیازمند گواهی بازرسی (کمی و کیفی ) شخص ثالث عضو پلتفرم{" "}
                  </Label>
                </div>
                <ErrorMessage
                  name="inspectionCertificates"
                  component="div"
                  className="text-red-500 text-xs pl-4"
                />
              </CardContent>
            </Card>
            <Card className="shadow-sm  !py-4 px-2">
              <CardContent className=" flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="warehouseStorage"
                    checked={values?.warehouseStorage}
                    onCheckedChange={(checked) =>
                      setFieldValue("warehouseStorage", checked === true)
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="warehouseStorage"
                    className="text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    نیازمند انبار جهت نگهداری از کالای خریداری شده / قابل فروش
                    توشط انبار های عضو پلتفرم{" "}
                  </Label>
                </div>
                <ErrorMessage
                  name="warehouseStorage"
                  component="div"
                  className="text-red-500 text-xs pl-4"
                />
              </CardContent>
            </Card>
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

export default Step7;
