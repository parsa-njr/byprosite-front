import React, { useEffect } from "react";
import FormStepper from "../components/FormStepper";
import { useGetSingleAd } from "@/query/ads/useAds";
import Loader from "@/components/shared/Loader";
import { useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const AdvertisementForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const { data, isSuccess } = useGetSingleAd(id || "0");

  useEffect(() => {
    console.log("data ? ", data);
  }, [data]);

  // —— Back-button blocker with SweetAlert2
  useEffect(() => {
    // push dummy state so browser back triggers popstate
    history.pushState(
      null,
      document.title,
      location.pathname + location.search
    );

    const handlePopState = async () => {
      const result = await Swal.fire({
        title: "آیا مطمئن هستید می‌خواهید این صفحه را ترک کنید؟",
        html: `
      <p class="text-right text-gray-700 leading-relaxed text-[15px]">
        اگر این صفحه را ترک کنید، آگهی شما همچنان در پروفایلتان قابل مشاهده خواهد بود.
        لطفاً قبل از ترک صفحه از ذخیره تغییرات خود اطمینان حاصل کنید.
      </p>
    `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "بله، صفحه را ترک کنم",
        cancelButtonText: "ماندن در صفحه",
        width: "420px",
        allowOutsideClick: false,
        position: "center",
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-xl shadow-xl p-6 font-sansWeb",
          title: "text-lg font-bold mb-4 text-right",
          confirmButton:
            "bg-primary cursor-pointer hover:opacity-90 text-white text-[16px] mx-[10px] mt-4 py-2 px-5 rounded-lg font-sansWeb",
          cancelButton:
            "bg-gray-300 cursor-pointer hover:opacity-90 text-gray-800 text-[16px] mx-[10px] mt-4 py-2 px-5 rounded-lg font-sansWeb",
        },
        scrollbarPadding: false,
      });

      if (result.isConfirmed) {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
        history.back();
      } else {
        history.pushState(
          null,
          document.title,
          location.pathname + location.search
        );
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // native fallback alert for F5 / tab close
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location]);

  // —— Optional: SweetAlert2 for internal refresh buttons
  useEffect(() => {
    const handleInternalRefresh = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.dataset?.refresh === "true") {
        e.preventDefault();
        const result = await Swal.fire({
          title: "آیا مطمئن هستید می‌خواهید صفحه را بازنشانی کنید؟",
          text: "تغییرات شما از بین خواهد رفت.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "بله، بازنشانی کنم",
          cancelButtonText: "ماندن در صفحه",
          reverseButtons: true,
          customClass: {
            popup: "rounded-xl shadow-xl text-right",
            confirmButton: "bg-red-500 text-white px-4 py-2 rounded-lg",
            cancelButton: "bg-gray-300 text-black px-4 py-2 rounded-lg ml-2",
          },
          scrollbarPadding: false,
        });

        if (result.isConfirmed) {
          window.location.reload();
        }
      }
    };

    document.addEventListener("click", handleInternalRefresh);
    return () => document.removeEventListener("click", handleInternalRefresh);
  }, []);

  return (
    <>
      {isSuccess ? (
        <FormStepper
          data={data?.data?.data}
          mode={new URLSearchParams(window.location.search).get("mode")}
        />
      ) : (
        <Loader />
      )}
    </>
  );
};

export default AdvertisementForm;
