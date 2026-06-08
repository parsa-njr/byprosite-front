import React, { useState } from "react";
import StepHeader from "../StepHeader";
import { CloudUpload, Magnet, Paperclip, Timer } from "lucide-react";
import FileUpload from "@/components/shared/FileUpload";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Step9 = ({ adId, goNext, goPrev }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);

    // fake loading effect (2 seconds)
    setTimeout(() => {
      setLoading(false);
      console.log("Form submitted!");
      toast.success("آگهی با موفقیت ثبت شد");
    }, 1000);
  };
  return (
    <div>
      <>
        <StepHeader
          title="آپلود فایل"
          icon={<CloudUpload className="h-8 w-8 text-primary" />}
        />

        <div className="mb-8 rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white">
          <h3 className="flex items-center text-lg font-semibold text-primary gap-2 pb-2 border-b border-gray-200">
            <span className="bg-secondary/20 p-2 rounded-full">
              <Magnet className="h-5 w-5 text-secondary" />
            </span>
            تصویر اصلی آگهی
          </h3>
          <div>
            <FileUpload
              label="آپلود تصویر اصلی آگهی"
              advertisementId={adId}
              segment="0"
              allowedTypes={["image/jpeg", "image/png"]}
            />
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm bg-white">
          <h3 className="flex items-center text-lg font-semibold text-primary gap-2 pb-2 border-b border-gray-200">
            <span className="bg-secondary/20 p-2 rounded-full">
              <Paperclip className="h-5 w-5 text-secondary" />
            </span>
            فایل های آگهی
          </h3>
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* First row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <FileUpload
                label="آپلود فایل های آگهی"
                advertisementId={adId}
                segment="1"
              />
              <FileUpload
                label="آپلود فایل های آگهی"
                advertisementId={adId}
                segment="1"
              />
              <FileUpload
                label="آپلود فایل های آگهی"
                advertisementId={adId}
                segment="1"
              />
            </div>

            {/* Second row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <FileUpload
                label="آپلود فایل های آگهی"
                advertisementId={adId}
                segment="1"
              />
              <FileUpload
                label="آپلود فایل های آگهی"
                advertisementId={adId}
                segment="1"
              />
              <FileUpload
                label="آپلود فایل های آگهی"
                advertisementId={adId}
                segment="1"
              />
            </div>

            {/* Third row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <FileUpload
                label="آپلود فایل های آگهی"
                advertisementId={adId}
                segment="1"
              />
              <FileUpload
                label="آپلود فایل های آگهی"
                advertisementId={adId}
                segment="1"
              />
              <FileUpload
                label="آپلود فایل های آگهی"
                advertisementId={adId}
                segment="1"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            className="w-full sm:w-auto"
          >
            قبلی
          </Button>
          <Button onClick={() => handleSubmit()} className="w-full sm:w-auto">
            {loading ? "در حال ارسال..." : "ثبت نهایی"}
          </Button>
        </div>
      </>
    </div>
  );
};

export default Step9;
