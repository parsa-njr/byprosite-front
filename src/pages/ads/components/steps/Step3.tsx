import CustomInput from "@/components/shared/CustomInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import StepHeader from "../StepHeader";
import {
  FlaskConical,
  Magnet,
  MapPin,
  Microscope,
  NotepadText,
  PlusCircle,
  ScanBarcode,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  useGetProperties,
  useUpdateProperty,
} from "@/query/property/useProperties";
import { useGetProperyUnits } from "@/query/globals/useGlobal";
import { toast } from "react-toastify";
import * as yup from "yup";
import FileUpload from "@/components/shared/FileUpload";

type InputItem = {
  id: string;
  title: string;
  value: string;
  isRequired: boolean;
  unit: string;
};

type InputData = {
  physical: InputItem[];
  chemical: InputItem[];
};

type OutputItem = {
  id: string;
  title: string;
  value: string;
  unit: string;
};

type OutputData = {
  physical: {
    required: OutputItem[];
    nonRequired: OutputItem[];
  };
  chemical: {
    required: OutputItem[];
    nonRequired: OutputItem[];
  };
};

function transformData(data: InputData): OutputData {
  const convert = (items: InputItem[]) => {
    const required: OutputItem[] = [];
    const nonRequired: OutputItem[] = [];

    items.forEach((item) => {
      const converted: OutputItem = {
        id: item?.id,
        title: item?.title,
        value: item?.value,
        unit: item?.unit,
      };

      if (item.isRequired) {
        required.push(converted);
      } else {
        if (item.value || item.value !== "") {
          nonRequired.push(converted);
        }
      }
    });

    return { required, nonRequired };
  };

  return {
    physical: convert(data.physical),
    chemical: convert(data.chemical),
  };
}

function convertToPayload(data: InputData, advertisementId: number) {
  const convert = (
    items: InputItem[],
    type: "physical" | "chemical"
  ): any[] => {
    return items.map((item) => {
      const base = {
        advertisementId,
        unitOfMeasurementId: Number(item.unit),
        value: item.value,
      };

      if (type === "physical") {
        return { physicalPropertyId: item.id, ...base };
      } else {
        return { chemicalPropertyId: item.id, ...base };
      }
    });
  };

  return {
    physical: [
      // @ts-ignore
      ...convert(data.physical.required, "physical"),
      // @ts-ignore
      ...convert(data.physical.nonRequired, "physical"),
    ],
    chemical: [
      // @ts-ignore
      ...convert(data.chemical.required, "chemical"),
      // @ts-ignore
      ...convert(data.chemical.nonRequired, "chemical"),
    ],
  };
}

const Step3 = ({
  formData,
  setFormData,
  goNext,
  goPrev,
  submitLoading,
  updateFn,
  adId,
  itemId = "1",
}) => {
  const propertyItemSchema = yup.object().shape({
    id: yup.string().required("شناسه الزامی است"),
    title: yup.string().required("عنوان الزامی است"),
    value: yup.mixed().nullable().required("مقدار الزامی است"),
    unit: yup.string().nullable().required("واحد الزامی است"),
  });

  const propertyGroupSchema = yup.object().shape({
    required: yup.array().of(propertyItemSchema).default([]), // می‌تونه خالی باشه
    nonRequired: yup.array().of(propertyItemSchema).default([]), // می‌تونه خالی باشه
  });

  const validationSchema = yup.object().shape({
    physical: propertyGroupSchema,
    chemical: propertyGroupSchema,
  });

  const [initialValues, setInitialValues] = useState(null);
  const [unitList, setUnitList] = useState([]);

  const { data: propertyUnits, isLoading: loadingPropertyUnits } =
    useGetProperyUnits();

  useEffect(() => {
    if (propertyUnits?.data?.success)
      console.log("propertyUnits :: ", propertyUnits?.data?.data);
    setUnitList(propertyUnits?.data?.data);
  }, [propertyUnits]);

  const {
    data: propertyData,
    isLoading: loadingItems,
    refetch: refetchItems,
  } = useGetProperties(formData?.itemId || "0", adId); // start disabled

  console.log("formData : ", formData);

  useEffect(() => {
    console.log("propertyData : ", propertyData);

    if (propertyData?.data?.success) {
      const updatedData = transformData(propertyData?.data?.data);
      setInitialValues(updatedData);
    }
  }, [propertyData]);

  // @ts-ignore
  const { mutate: updateProperty, isLoading } = useUpdateProperty();

  const handleSubmit = (values) => {
    // setFormData((prev) => ({ ...prev, ...values }));
    const payload = convertToPayload(values, adId);

    // goNext();
    updateProperty(
      {
        itemId: itemId,
        advertisementId: adId,
        data: payload,
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

  useEffect(() => {
    console.log("formData : ", formData);
  }, [formData]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className="space-y-6">
          <StepHeader
            title="ویژگی های محصول"
            icon={<FlaskConical className="h-8 w-8 text-primary" />}
          />
          {/* ---------- Group 1: Physical ---------- */}
          <div className="mb-8 rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white">
            <h3 className="flex items-center text-lg font-semibold text-primary gap-2 pb-2 border-b border-gray-200">
              <span className="bg-secondary/20 p-2 rounded-full">
                <Magnet className="h-5 w-5 text-secondary" />
              </span>
              ویژگی های فیزیکی
            </h3>
            {/* {values?.physical?.required?.length > 0 ? ( */}
            <>
              <FieldArray name="physical.required">
                {({ push, remove }) => (
                  <>
                    <>
                      {" "}
                      {values?.physical?.required?.map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b pb-4 w-full mt-4"
                        >
                          <Label className="w-full sm:w-1/6 text-sm font-semibold text-primary bg-primary/5 px-3 py-2 rounded-md text-center">
                            {item?.title}
                          </Label>

                          <div className="w-full sm:w-1/3">
                            <CustomInput
                              type="decimal"
                              name={`physical.required.${index}.value`}
                              value={item?.value}
                              onChange={(val) =>
                                setFieldValue(
                                  `physical.required.${index}.value`,
                                  val
                                )
                              }
                              placeholder="مقدار را وارد کنید"
                            />
                            <ErrorMessage
                              name={`physical.required.${index}.value`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          <div className="w-full sm:w-1/3">
                            <CustomInput
                              type="select"
                              name={`physical.required.${index}.unit`}
                              options={unitList
                                .filter(
                                  (unit) =>
                                    unit?.physicalPropertyId?.toString() ===
                                    item?.id?.toString()
                                )
                                .map((opt) => ({
                                  label: opt?.title,
                                  value: opt?.unitOfMeasurementId,
                                }))}
                              value={item?.unit?.toString()}
                              onChange={(val) =>
                                setFieldValue(
                                  `physical.required.${index}.unit`,
                                  val
                                )
                              }
                              placeholder="واحد را انتخاب کنید"
                            />
                            <ErrorMessage
                              name={`physical.required.${index}.unit`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </>
                  </>
                )}
              </FieldArray>

              {/* Physical nonRequired */}
              <FieldArray name="physical.nonRequired">
                {({ push, remove }) => (
                  <>
                    {values?.physical?.nonRequired?.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b pb-4 w-full mt-4"
                      >
                        {/* {!loadingItems && (<> */}

                        <CustomInput
                          type="select"
                          name={`physical.nonRequired.${index}.id`}
                          options={propertyData?.data?.data?.physical
                            .filter((item) => !item?.isRequired)
                            .map((opt) => ({
                              label: opt?.title,
                              value: opt?.id.toString(),
                            }))}
                          value={item.id}
                          onChange={(val) => {
                            console.log("vallll :: ", val);
                            setFieldValue(
                              `physical.nonRequired.${index}.id`,
                              val
                            );
                            setFieldValue(
                              `physical.nonRequired.${index}.title`,
                              propertyData?.data?.data?.physical.find(
                                (item) =>
                                  item?.id.toString() === val?.toString()
                              )?.title
                            );
                          }}
                          placeholder="ویژگی"
                          className="w-full sm:w-1/6"
                        />
                        {/* </>)} */}
                        <ErrorMessage
                          name={`physical.nonRequired.${index}.title`}
                          component="div"
                          className="text-red-500 text-sm"
                        />

                        <div className="w-full sm:w-1/3">
                          {item.title && (
                            <>
                              <CustomInput
                                type="decimal"
                                name={`physical.nonRequired.${index}.value`}
                                value={item?.value}
                                onChange={(val) =>
                                  setFieldValue(
                                    `physical.nonRequired.${index}.value`,
                                    val
                                  )
                                }
                                placeholder="مقدار را وارد کنید"
                              />
                              <ErrorMessage
                                name={`physical.nonRequired.${index}.value`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </>
                          )}
                        </div>

                        <div className="w-full sm:w-1/3">
                          {item?.value && (
                            <>
                              <CustomInput
                                type="select"
                                name={`physical.nonRequired.${index}.unit`}
                                options={unitList
                                  .filter(
                                    (unit) =>
                                      unit?.physicalPropertyId?.toString() ===
                                      item?.id?.toString()
                                  )
                                  .map((opt) => ({
                                    label: opt?.title,
                                    value: opt?.unitOfMeasurementId,
                                  }))}
                                value={item.unit}
                                onChange={(val) =>
                                  setFieldValue(
                                    `physical.nonRequired.${index}.unit`,
                                    val
                                  )
                                }
                                placeholder="واحد را انتخاب کنید"
                              />
                              <ErrorMessage
                                name={`physical.nonRequired.${index}.unit`}
                                component="div"
                                className="text-red-500 text-sm"
                              />
                            </>
                          )}
                        </div>

                        <button type="button" onClick={() => remove(index)}>
                          <Trash2
                            size={15}
                            className="bg-red-700 w-7 h-7 p-1 cursor-pointer text-white rounded-md"
                          />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => push({ title: "", value: "", unit: "" })}
                      className="mt-4 flex items-center cursor-pointer gap-2 text-primary hover:text-primary/80 font-medium transition"
                    >
                      <PlusCircle className="w-5 h-5" />
                      افزودن ویژگی فیزیکی
                    </button>
                  </>
                )}
              </FieldArray>
            </>
            {/* // ) : (
            //   <>
            //     <div className="mx-5 mt-3 text-xl text-gray-500">
            //       موردی یافت نشد
            //     </div>
            //   </>
            // )} */}
          </div>
          <div>
            <FileUpload
              label="آپلود فایل مربوط به ویژگی های فیزیکی"
              advertisementId={adId}
              segment="2"
            />
          </div>
          {/* ---------- Group 2: Chemical ---------- */}

          <div className="mb-8 rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white">
            <h3 className="flex items-center text-lg font-semibold text-primary gap-2 pb-2 border-b border-gray-200">
              <span className="bg-secondary/20 p-2 rounded-full">
                <Microscope className="h-5 w-5 text-secondary" />
              </span>
              ویژگی های شیمیایی
            </h3>
            {/* {values?.chemical?.required?.length > 0 ? ( */}
            <>
              {" "}
              <FieldArray name="chemical.required">
                {({ push, remove }) => (
                  <>
                    {values?.chemical?.required?.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b pb-4 w-full mt-4"
                      >
                        <Label className="w-full sm:w-1/6 text-sm font-semibold text-primary bg-primary/5 px-3 py-2 rounded-md text-center">
                          {item?.title}
                        </Label>

                        <div className="w-full sm:w-1/3">
                          <CustomInput
                            type="decimal"
                            name={`chemical.required.${index}.value`}
                            value={item?.value}
                            onChange={(val) =>
                              setFieldValue(
                                `chemical.required.${index}.value`,
                                val
                              )
                            }
                            placeholder="مقدار را وارد کنید"
                          />
                          <ErrorMessage
                            name={`chemical.required.${index}.value`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>

                        <div className="w-full sm:w-1/3">
                          <CustomInput
                            type="select"
                            name={`chemical.required.${index}.unit`}
                            options={unitList
                              .filter(
                                (unit) =>
                                  unit?.chemicalPropertyId?.toString() ===
                                  item?.id?.toString()
                              )
                              .map((opt) => ({
                                label: opt?.title,
                                value: opt?.unitOfMeasurementId,
                              }))}
                            value={item.unit}
                            onChange={(val) =>
                              setFieldValue(
                                `chemical.required.${index}.unit`,
                                val
                              )
                            }
                            placeholder="واحد را انتخاب کنید"
                          />
                          <ErrorMessage
                            name={`chemical.required.${index}.unit`}
                            component="div"
                            className="text-red-500 text-sm"
                          />
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </FieldArray>
              <FieldArray name="chemical.nonRequired">
                {({ push, remove }) => (
                  <>
                    {values?.chemical?.nonRequired?.map((item, index) => (
                      <>
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 border-b pb-4 w-full mt-4"
                        >
                          <CustomInput
                            type="select"
                            name={`chemical.nonRequired.${index}.id`}
                            options={propertyData?.data?.data?.chemical
                              .filter((item) => !item.isRequired)
                              .map((opt) => ({
                                label: opt?.title,
                                value: opt?.id,
                              }))}
                            value={item.id}
                            onChange={(val) => {
                              console.log("vallll :: ", val);
                              setFieldValue(
                                `chemical.nonRequired.${index}.id`,
                                val
                              );
                              setFieldValue(
                                `chemical.nonRequired.${index}.title`,
                                propertyData?.data?.data?.chemical.find(
                                  (item) =>
                                    item.id.toString() === val.toString()
                                ).title
                              );
                            }}
                            placeholder="ویژگی"
                            className="w-full sm:w-1/6"
                          />

                          <ErrorMessage
                            name={`chemical.nonRequired.${index}.title`}
                            component="div"
                            className="text-red-500 text-sm"
                          />

                          <div className="w-full sm:w-1/3">
                            <CustomInput
                              type="decimal"
                              name={`chemical.nonRequired.${index}.value`}
                              value={item?.value}
                              onChange={(val) =>
                                setFieldValue(
                                  `chemical.nonRequired.${index}.value`,
                                  val
                                )
                              }
                              placeholder="مقدار را وارد کنید"
                            />
                            <ErrorMessage
                              name={`chemical.nonRequired.${index}.value`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          <div className="w-full sm:w-1/3">
                            <CustomInput
                              type="select"
                              name={`chemical.nonRequired.${index}.unit`}
                              options={unitList
                                .filter(
                                  (unit) =>
                                    unit?.chemicalPropertyId?.toString() ===
                                    item?.id?.toString()
                                )
                                .map((opt) => ({
                                  label: opt?.title,
                                  value: opt?.unitOfMeasurementId,
                                }))}
                              value={item.unit}
                              onChange={(val) =>
                                setFieldValue(
                                  `chemical.nonRequired.${index}.unit`,
                                  val
                                )
                              }
                              placeholder="واحد را انتخاب کنید"
                            />
                            <ErrorMessage
                              name={`chemical.nonRequired.${index}.unit`}
                              component="div"
                              className="text-red-500 text-sm"
                            />
                          </div>

                          <button type="button" onClick={() => remove(index)}>
                            <Trash2
                              size={15}
                              className="bg-red-700 w-7 h-7 p-1 cursor-pointer text-white rounded-md"
                            />
                          </button>
                        </div>
                      </>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ title: "", value: "", unit: "" })}
                      className="mt-4 flex items-center cursor-pointer gap-2 text-primary hover:text-primary/80 font-medium transition"
                    >
                      <PlusCircle className="w-5 h-5" />
                      افزودن ویژگی شیمیایی
                    </button>
                  </>
                )}
              </FieldArray>
            </>
            {/* // ) : (
            //   <>
            //     <div className="mx-5 mt-3 text-xl text-gray-500">
            //       موردی یافت نشد
            //     </div>{" "}
            //   </>
            // )} */}
          </div>

          <div>
            <FileUpload
              label="آپلود فایل مربوط به ویژگی های شیمیایی"
              advertisementId={adId}
              segment="3"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={goPrev}
              className="w-full sm:w-auto"
            >
              قبلی
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              بعدی
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Step3;
