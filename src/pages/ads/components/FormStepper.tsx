import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckIcon,
  UserIcon,
  MailIcon,
  CircleQuestionMark,
  NotepadText,
  ScanBarcode,
  Newspaper,
  FlaskConical,
  CopyCheck,
  Timer,
  Truck,
  CloudUpload,
  SquarePen,
} from "lucide-react";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";

import Step8 from "./steps/Step8";
import { useUpdateAdvertisement } from "@/query/ads/useAds";
import { useCreateTiming } from "@/query/ads/timing/useTiming";

import { toast } from "react-toastify";
import Step9 from "./steps/Step9";
import Step6 from "./steps/Step6";
import Step7 from "./steps/Step7";

const FormStepper = ({ data, mode }) => {
  const [step, setStep] = useState(1);

  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (mode === "edit") {
      setIsEdit(mode);
      setStep(2);
    }
  }, [mode]);

  const [formData, setFormData] = useState(data);
  const [adId, setAdId] = useState(data);

  // @ts-ignore
  const { mutate: updateAd, isLoading } = useUpdateAdvertisement();
  // @ts-ignore
  const { mutate: createTiming, isLoading: timingLoading } = useCreateTiming();

  useEffect(() => {
    if (data) {
      setFormData(data);
      setAdId(data?.id);
    }
  }, [data]);

  const handleSubmit = (data) => {
    updateAd(
      {
        id: adId,
        data: { title: "New Ad Title", description: "Updated content" },
      },
      {
        onSuccess: () => {
          console.log("Advertisement updated successfully!");

          toast.success("عملیات با موفقیت انجام شد", {
            position: "top-right",
            autoClose: 5000,
          });
        },
        onError: (error) => {
          console.error("Failed to update advertisement:", error);
          toast.error("خطا در انجام عملیات !", {
            position: "top-right",
            autoClose: 5000,
          });
        },
      }
    );

    createTiming(
      {
        id: adId,
        data: { title: "New Ad Title", description: "Updated content" },
      },
      {
        onSuccess: () => {
          console.log("Advertisement updated successfully!");

          toast.success("عملیات با موفقیت انجام شد", {
            position: "top-right",
            autoClose: 5000,
          });
        },
        onError: (error) => {
          console.error("Failed to update advertisement:", error);
          toast.error("خطا در انجام عملیات !", {
            position: "top-right",
            autoClose: 5000,
          });
        },
      }
    );
  };

  const goNext = () => {
    setStep((s) => s + 1);
  };
  const goPrev = () => {
    setStep((s) => s - 1);
  };

  const steps = [
    { label: "اطلاعات شخصی", icon: <CircleQuestionMark className="w-7 h-7" /> },
    { label: "ایمیل", icon: <NotepadText className="w-5 h-5" /> },
    { label: "رمز عبور", icon: <FlaskConical className="w-5 h-5" /> },
    { label: "رمز عبور", icon: <ScanBarcode className="w-5 h-5" /> },
    { label: "تایید", icon: <Newspaper className="w-5 h-5" /> },
    { label: "زمان بندی", icon: <Timer className="w-6 h-6" /> },
    { label: "تایید", icon: <CopyCheck className="w-5 h-5" /> },
    { label: "اطلاعات تکمیلی", icon: <SquarePen className="w-6 h-6" /> },
    { label: "آپلود فایل", icon: <CloudUpload className="w-6 h-6" /> }, // 🔹 اضافه کردن Step7
  ];

  useEffect(() => {
    console.log("formData : ", formData);
  }, [formData]);

  return (
    <Card
      dir="rtl"
      className="
    w-full max-w-5xl mx-auto 
    mt-16 sm:mt-24 lg:mt-32 mb-10 
    px-4 sm:px-6 
    shadow-lg rounded-2xl
  "
    >
      <CardHeader>
        <div className="flex items-center justify-center">
          {steps.map((s, i) => (
            <div key={i} className="flex-1 flex items-center">
              {/* Step circle */}
              <div
                // onClick={() => {
                //   setStep(i + 1);
                // }}
                className={`relative z-10  w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 
              rounded-full flex items-center justify-center 
              text-xs sm:text-sm lg:text-base font-bold text-white
              transition-all duration-300
              ${i < step ? "bg-primary" : "bg-gray-300"}
            `}
              >
                {s.icon}
              </div>

              {/* Line connector (except last step) */}
              {i < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 sm:h-1 -ml-1 transition-all duration-300
                ${i < step - 1 ? "bg-primary" : "bg-gray-300"}
              `}
                />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {/* Each step renders its own Formik */}
            {step === 1 && !isEdit && <Step1 goNext={goNext} />}

            {step === 2 && (
              <Step2
                formData={formData}
                setFormData={setFormData}
                goNext={goNext}
                goPrev={goPrev}
                submitLoading={isLoading}
                updateFn={updateAd}
                adId={adId}
                mode={mode}
              />
            )}

            {step === 3 && (
              <Step3
                formData={formData}
                setFormData={setFormData}
                goNext={goNext}
                goPrev={goPrev}
                submitLoading={isLoading}
                updateFn={updateAd}
                adId={adId}
              />
            )}

            {step === 4 && (
              <Step4
                formData={formData}
                setFormData={setFormData}
                goNext={goNext}
                goPrev={goPrev}
                submitLoading={isLoading}
                updateFn={updateAd}
                adId={adId}
              />
            )}

            {step === 5 && (
              <Step5
                formData={formData}
                setFormData={setFormData}
                goNext={goNext}
                goPrev={goPrev}
                submitLoading={isLoading}
                updateFn={updateAd}
                adId={adId}
              />
            )}

            {step === 6 && (
              <Step6
                formData={formData}
                setFormData={setFormData}
                goNext={goNext}
                goPrev={goPrev}
                submitLoading={timingLoading}
                updateFn={createTiming}
                adId={adId}
              />
            )}

            {step === 7 && (
              <Step7
                formData={formData}
                setFormData={setFormData}
                goNext={goNext}
                goPrev={goPrev}
                submitLoading={isLoading}
                updateFn={updateAd}
                adId={adId}
              />
            )}

            {step === 8 && (
              <Step8
                formData={formData}
                setFormData={setFormData}
                goNext={goNext}
                goPrev={goPrev}
                submitLoading={isLoading}
                updateFn={updateAd}
                adId={adId}
              />
            )}
            {step === 9 && (
              <Step9
                // formData={formData}
                // setFormData={setFormData}
                goNext={goNext}
                goPrev={goPrev}
                // submitLoading={isLoading}
                // updateFn={updateAd}
                adId={adId}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default FormStepper;
