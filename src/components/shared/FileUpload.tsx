import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Upload, X, Save, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiClient } from "@/api/axiosClient";

interface FileUploadProps {
  label?: string;
  className?: string;
  allowedTypes?: string[];
  maxSizeMB?: number;
  segment: string | null;
  advertisementId: number;
  isMainImage?: boolean; // ✅ new prop to distinguish main image
}

export default function FileUpload({
  label = "آپلود فایل",
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"],
  maxSizeMB = 2,
  className = "w-60 max-w-85",
  segment,
  advertisementId,
  isMainImage = false,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentId, setAttachmentId] = useState<number | null>(null);

  // Keep track of initial title/desc to enable/disable save button
  const [initialTitle, setInitialTitle] = useState("");
  const [initialDesc, setInitialDesc] = useState("");

  const uploadFile = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("segment", segment || "0");

    try {
      setLoading(true);
      setProgress(0);

      const response = await apiClient.post(
        `/api/v1/files/${advertisementId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / (e.total || 1));
            setProgress(percent);
          },
        }
      );

      const attachment = response.data.attachment;
      setAttachmentId(attachment.id);

      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }

      setFile(selectedFile);
      toast.success("فایل با موفقیت آپلود شد");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("خطا در آپلود فایل");
    } finally {
      setLoading(false);
    }
  };

  // Update title/description
  const updateAttachment = async () => {
    if (!attachmentId) return;
    try {
      setLoading(true);
      await apiClient.put(`/api/v1/files/${attachmentId}`, {
        title,
        description,
      });
      toast.success("اطلاعات با موفقیت به‌روزرسانی شد");

      setInitialTitle(title);
      setInitialDesc(description);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("خطا در به‌روزرسانی");
    } finally {
      setLoading(false);
    }
  };

  // Delete attachment with Swal
  const deleteAttachment = async () => {
    if (!attachmentId) return;

    const result = await Swal.fire({
      title: "آیا از حذف این فایل مطمئن هستید؟",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "بله، حذف شود",
      cancelButtonText: "لغو",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await apiClient.delete(`/api/v1/files/${attachmentId}`);
      toast.success("فایل با موفقیت حذف شد");
      // Reset all states
      setFile(null);
      setPreview(null);
      setProgress(0);
      setAttachmentId(null);
      setTitle("");
      setDescription("");
      setInitialTitle("");
      setInitialDesc("");
    } catch (error) {
      toast.error("خطا در حذف فایل");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error(
        `فرمت فایل مجاز نیست. فرمت‌های مجاز: ${allowedTypes.join(", ")}`
      );
      return;
    }

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`حجم فایل نباید بیشتر از ${maxSizeMB} مگابایت باشد.`);
      return;
    }

    uploadFile(selectedFile);
  };

  // Enable save only if title or desc changed
  const isSaveDisabled = title === initialTitle && description === initialDesc;

  return (
    <div className={`mt-5 mx-auto ${className}`}>
      {/* File upload box */}
      <div className="border-2 rounded-lg flex items-center justify-between p-4 cursor-pointer relative transition-all h-14 overflow-hidden">
        {loading && (
          <div
            className="absolute top-1/2 left-2 h-0.5 bg-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        )}

        {loading ? (
          <div className="flex items-center justify-between w-full gap-3">
            <div className="w-12 h-12 flex items-center justify-center rounded border relative">
              <div className="absolute inset-0 bg-gray-200/70 backdrop-blur-sm rounded"></div>
              <Loader2 className="h-6 w-6 animate-spin text-primary relative z-10" />
            </div>
          </div>
        ) : file ? (
          <div className="flex items-center justify-between w-full gap-3">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-12 h-12 rounded object-cover border"
              />
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded border bg-gray-100 text-gray-500 text-xs">
                <FileText />
              </div>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="truncate w-5 flex-1 text-sm text-gray-700 cursor-pointer">
                    {file.name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{file.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={deleteAttachment}>
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>
        ) : (
          <label className="w-full flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-600">{label}</span>
            <Upload className="w-5 h-5 text-primary" />
            <input
              type="file"
              accept={allowedTypes.join(",")}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {/* Show title/description only for segment ≠ "0" and not main image */}
      {!isMainImage &&
        segment &&
        segment !== "0" &&
        segment !== "2" &&
        segment !== "3" &&
        segment !== "4" &&
        file && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="عنوان فایل"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm"
            />
            <textarea
              placeholder="توضیحات فایل"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 text-sm resize-none"
              rows={3}
            />
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={updateAttachment}
              disabled={isSaveDisabled}
            >
              <Save className="w-4 h-4" />
              ذخیره تغییرات
            </Button>
          </div>
        )}
    </div>
  );
}
