import CustomInput from "@/components/shared/CustomInput";
import { Button } from "@/components/ui/button";
import { ErrorMessage, Form, Formik } from "formik";
import StepHeader from "../StepHeader";
import * as Yup from "yup";
import { Loader2, ScanBarcode } from "lucide-react";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { useGetUnitOfMeasurements } from "@/query/globals/useGlobal";
import { useEffect, useState } from "react";

enum UnitPriceType {
  PriceFromTenderAuction = 0, // قیمت از طریق مناقصه و مزایده
  Agree = 1, // توافقی
  FixedPrice = 2, // قیمت ثابت
}

enum CurrencyUnit {
  Rial = 0, // ریال
  Dollars = 1, // دلار
  Dirham = 2, // درهم
  Euro = 3, // یورو
}

const Step4 = ({
  formData,
  setFormData,
  goNext,
  goPrev,
  submitLoading,
  updateFn,
  adId,
}) => {
  // Conditional validation schema
 const getValidationSchema = () => {
  return Yup.object().shape({
    unitPriceType: Yup.string().required("نوع واحد قیمت الزامی است"),

    // Conditionally require other fields only when unitPriceType is FixedPrice (2)
    advertismentAmount: Yup.number().when("unitPriceType", {
      is: UnitPriceType.FixedPrice.toString(),
      then: (schema) => schema.required("مقدار آگهی الزامی است"),
      otherwise: (schema) => schema.notRequired(),
    }),

    unitOfMeasurementId: Yup.string().when("unitPriceType", {
      is: UnitPriceType.FixedPrice.toString(),
      then: (schema) => schema.required("واحد مقدار الزامی است"),
      otherwise: (schema) => schema.notRequired(),
    }),

    allowedQuantityForOrder: Yup.number()
      .when("unitPriceType", {
        is: UnitPriceType.FixedPrice.toString(),
        then: (schema) => schema.required("حداقل مقدار سفارش الزامی است"),
        otherwise: (schema) => schema.notRequired(),
      })
      .when(["unitPriceType", "advertismentAmount"], {
        is: (unitPriceType, advertismentAmount) => 
          unitPriceType === UnitPriceType.FixedPrice.toString() && 
          advertismentAmount && 
          !isNaN(advertismentAmount),
        then: (schema) => schema.max(
          Yup.ref('advertismentAmount'), 
          "حداقل مقدار سفارش باید کوچکتر یا مساوی مقدار آگهی باشد"
        ),
      }),

    priceOfUnit: Yup.number()
      .typeError("قیمت باید عدد باشد")
      .min(0, "قیمت نمی‌تواند منفی باشد")
      .when("unitPriceType", {
        is: UnitPriceType.FixedPrice.toString(),
        then: (schema) => schema.required("قیمت واحد الزامی است"),
        otherwise: (schema) => schema.notRequired(),
      }),

    currencyUnit: Yup.string().when("unitPriceType", {
      is: UnitPriceType.FixedPrice.toString(),
      then: (schema) => schema.required("نوع ارز قیمت گذاری الزامی است"),
      otherwise: (schema) => schema.notRequired(),
    }),

    netWeight: Yup.number().when("unitPriceType", {
      is: UnitPriceType.FixedPrice.toString(),
      then: (schema) => schema.required("وزن خالص الزامی است"),
      otherwise: (schema) => schema.notRequired(),
    }),

    grossWeight: Yup.number().when("unitPriceType", {
      is: UnitPriceType.FixedPrice.toString(),
      then: (schema) => schema.required("وزن ناخالص الزامی است"),
      otherwise: (schema) => schema.notRequired(),
    }),

    // These can remain as they are since they have default values
    finalPrice: Yup.number(),
    pricingRateAtTimeOfRegistration: Yup.number(),
  });
};
  const [unitOpt, setUnitOpt] = useState(null);
  // Conditional validation schema
  const { data: unitList, isLoading: loadingPropertyUnits } =
    useGetUnitOfMeasurements();

  useEffect(() => {
    if (unitList?.data?.success)
      console.log("unitList :: ", unitList?.data?.data);
    setUnitOpt(unitList?.data?.data);
  }, [unitList]);
  const initialValues = {
    advertismentAmount: formData?.advertismentAmount || "0",
    unitOfMeasurementId: formData?.unitOfMeasurementId || "0",
    allowedQuantityForOrder: formData?.allowedQuantityForOrder || "0",
    priceOfUnit: formData?.priceOfUnit || "0",
    unitPriceType:
      formData?.unitPriceType || UnitPriceType.FixedPrice?.toString(),
    finalPrice: formData?.finalPrice || "1",
    netWeight: formData?.netWeight || "1",
    grossWeight: formData?.grossWeight || "1",
    pricingRateAtTimeOfRegistration:
      formData?.pricingRateAtTimeOfRegistration || 1000000,
    currencyUnit: formData?.currencyUnit || CurrencyUnit.Rial.toString(),
  };

  const priceUnitOpt = [
    { label: "ریال", value: CurrencyUnit.Rial },
    { label: "دلار", value: CurrencyUnit.Dollars },
    { label: "درهم", value: CurrencyUnit.Dirham },
    { label: "یورو", value: CurrencyUnit.Euro },
  ];

  const pricTypeOpt = [
    {
      label: "قیمت از طریق مناقصه و مزایده",
      value: UnitPriceType.PriceFromTenderAuction,
    },
    { label: "توافقی", value: UnitPriceType.Agree },
    { label: "قیمت ثابت", value: UnitPriceType.FixedPrice },
  ];

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
      validationSchema={getValidationSchema()}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, submitForm, touched }) => (
        <Form className="space-y-3">
          <StepHeader
            title={
              formData?.buySell === "sell"
                ? "مقدار کالای عرضه شده"
                : "مقدار کالای مورد نیاز "
            }
            icon={<ScanBarcode className="h-8 w-8 text-primary" />}
          />

          {/* نرخ امروز */}
          {values?.currencyUnit &&
            values?.currencyUnit != CurrencyUnit?.Rial && (
              <div className="mt-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 shadow-sm gap-2">
                  <div className="flex flex-col text-center md:text-right">
                    <span className="text-xs text-gray-500">نرخ امروز</span>
                    <span className="font-medium text-gray-800">
                      {priceUnitOpt?.find(
                        (item) =>
                          item.value.toString() ===
                          values?.currencyUnit?.toString()
                      )?.label ?? "—"}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-primary text-center md:text-right">
                    {values?.pricingRateAtTimeOfRegistration?.toLocaleString()}{" "}
                    <span className="text-sm font-normal">ریال</span>
                  </div>
                </div>
              </div>
            )}

          {/* Inputs */}
          <Card className="mt-5 p-6 space-y-6">
            {/* روش قیمت‌گذاری */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                type="select"
                onChange={(val) => setFieldValue("unitPriceType", val)}
                options={pricTypeOpt}
                value={values?.unitPriceType}
                label="روش قیمت گذاری"
                placeholder="روش قیمت گذاری را انتخاب کنید"
                error={touched.unitPriceType && errors.unitPriceType}
              />
            </div>
            <Separator className="mb-4" />

            {/* سایر فیلدها به‌صورت شرطی */}
            <AnimatePresence initial={false}>
              {values?.unitPriceType == UnitPriceType.FixedPrice && (
                <motion.div
                  key="price-fields"
                  initial={{ opacity: 0, scaleY: 0.8, transformOrigin: "top" }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0.8 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="origin-top space-y-6"
                >
                  {/* مقدار و واحد */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CustomInput
                      type="number"
                      onChange={(val) => {
                        setFieldValue("advertismentAmount", val);

                        const calPrice =
                          values?.currencyUnit == CurrencyUnit?.Rial
                            ? val * values?.priceOfUnit
                            : val *
                              values?.priceOfUnit *
                              values?.pricingRateAtTimeOfRegistration;

                        setFieldValue("finalPrice", calPrice);
                      }}
                      value={values?.advertismentAmount}
                      label="مقدار آگهی"
                      placeholder="مقدار مورد نظر خود را وارد کنید"
                      error={
                        touched.advertismentAmount && errors.advertismentAmount
                      }
                    />
                    <CustomInput
                      type="select"
                      onChange={(val) =>
                        setFieldValue("unitOfMeasurementId", val)
                      }
                      options={unitOpt?.map((opt) => ({
                        label: opt?.title,
                        value: opt?.id,
                      }))}
                      value={values?.unitOfMeasurementId}
                      label="واحد مقدار"
                      placeholder="واحد مقدار را انتخاب کنید"
                      error={
                        touched.unitOfMeasurementId &&
                        errors.unitOfMeasurementId
                      }
                    />
                    <CustomInput
                      type="number"
                      onChange={(val) => {
                        setFieldValue("priceOfUnit", val);
                        const calPrice =
                          values?.currencyUnit == CurrencyUnit?.Rial
                            ? val * values?.advertismentAmount
                            : val *
                              values?.advertismentAmount *
                              values?.pricingRateAtTimeOfRegistration;

                        // const calPrice =
                        //   values?.val * values?.advertismentAmount;

                        setFieldValue("finalPrice", calPrice);
                      }}
                      value={values?.priceOfUnit}
                      label="قیمت واحد"
                      placeholder="قیمت مورد نظر خود را وارد کنید"
                      error={touched.priceOfUnit && errors.priceOfUnit}
                    />
                  </div>

                  {/* ارز و قیمت کل */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      type="number"
                      onChange={(val) =>
                        setFieldValue("allowedQuantityForOrder", val)
                      }
                      value={values?.allowedQuantityForOrder}
                      label="حداقل مقدار سفارش"
                      placeholder="حداقل مقدار سفارش را وارد کنید"
                      error={
                        touched.allowedQuantityForOrder &&
                        errors.allowedQuantityForOrder
                      }
                    />
                    <CustomInput
                      type="select"
                      onChange={(val) => {
                        setFieldValue("currencyUnit", val);
                        const calPrice =
                          val == CurrencyUnit?.Rial
                            ? values?.priceOfUnit * values?.advertismentAmount
                            : values?.priceOfUnit *
                              values?.advertismentAmount *
                              values?.pricingRateAtTimeOfRegistration;

                        // const calPrice =
                        //   values?.val * values?.advertismentAmount;

                        setFieldValue("finalPrice", calPrice);
                      }}
                      options={priceUnitOpt}
                      value={values?.currencyUnit}
                      label="نوع ارز قیمت گذاری"
                      placeholder="نوع ارز را انتخاب کنید"
                      error={touched.currencyUnit && errors.currencyUnit}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      type="number"
                      onChange={(val) => setFieldValue("netWeight", val)}
                      value={values?.netWeight}
                      label="کل وزن خالص (کیلوگرم)"
                      placeholder="مقدار مورد نظر خود را وارد کنید"
                      error={touched.netWeight && errors.netWeight}
                    />
                    <CustomInput
                      type="number"
                      onChange={(val) => setFieldValue("grossWeight", val)}
                      value={values?.grossWeight}
                      label="کل وزن ناخالص (کیلوگرم)"
                      placeholder="مقدار مورد نظر خود را وارد کنید"
                      error={touched.grossWeight && errors.grossWeight}
                    />
                  </div>

                  {/* وزن‌ها */}
                  {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <CustomInput
                      type="number"
                      value={values?.finalPrice}
                      label="ارزش کل آگهی"
                      disabled
                    />
                  </div> */}

                  {/* قیمت نهایی - Animated */}
                  {/* <div className="mt-6">
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl border border-gray-100 p-5 shadow-xs hover:border-gray-200 transition-colors duration-200"
  >
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">قیمت نهایی</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {values?.finalPrice?.toLocaleString()}
        </p>
      </div>
      <div className="text-left">
        <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-sm rounded-lg font-medium">
          ریال
        </span>
      </div>
    </div>
  </motion.div>
</div> */}

                  {/* قیمت نهایی - Card Style */}
                  {/* <div className="mt-6">
  <div className="bg-white rounded-lg p-5 shadow-card border border-gray-100">
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8l3 5m0 0l3-5m-3 5v4m-3-5h6m-6 3h6m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">قیمت نهایی</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">
          {values?.finalPrice?.toLocaleString()}
        </span>
        <span className="text-gray-500 text-sm">ریال</span>
      </div>
    </div>
  </div>
</div> */}

                  {/* قیمت نهایی - Text Only */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center shadow-md">
                    <p className="text-sm text-secondary mb-1">ارزش کل آگهی</p>
                    <p className="text-2xl font-bold text-primary">
                      {values?.finalPrice?.toLocaleString()}
                      <span className="text-base font-normal text-primary mr-1">
                        ریال
                      </span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goPrev}
              className="w-full sm:w-auto"
            >
              قبلی
            </Button>
            <Button
              onClick={submitForm}
              className="w-full sm:w-20"
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

export default Step4;
