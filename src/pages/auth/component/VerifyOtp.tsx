import CountdownTimer from "@/components/shared/CountdownTimer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { ArrowRight, ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import authApi from "@/api/authApi";
import { toast } from "react-toastify";
import LoginLogoHeader from "./LoginLogoHeader";
import { VerifyOtpProps } from "@/types";
import { useValidatePhoneNumber, useVerifyOtp } from "@/query/auth/useAuth";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  code: Yup.string()
    .min(4, "کد تایید باید 4 رقم باشد")
    .max(4, "کد تایید باید 4 رقم باشد")
    .matches(/^\d+$/, "کد تایید باید فقط شامل اعداد باشد"),
});

// ✅ VerifyOtp props

// ✅ VerifyOtp form values
export interface VerifyOtpFormValues {
  code: string;
}

const VerifyOtp: React.FC<VerifyOtpProps> = ({
  setPage,
  mode = "signUp",
  phoneNumber = null,
  setUserId,
}) => {
  const [timerKey, setTimerKey] = useState(1);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const backUrl = searchParams.get("backUrl");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();

  const handleVerifyOtp = (code: string) => {
    verifyOtp(
      {
        phoneNumber,
        code,
        checkActiveCodeType:
          mode === "signUp"
            ? "SignIn"
            : mode === "forgetPassword"
            ? "ForgetPassword"
            : "LogIn",
      },
      {
        onSuccess: (response) => {
          if (response?.data.success) {
            toast.success(response?.data.message, {
              position: "top-right",
              autoClose: 5000,
            });

            if (mode === "signUp") {
              if (setUserId) {
                setUserId(response?.data?.detail?.user?.id);
              }
              setPage(3);
            } else if (mode === "login") {
              if (backUrl) {
                navigate(`/${backUrl}`);
              } else {
                navigate(`/`);
              }

              localStorage.setItem(
                "user",
                JSON.stringify(response?.data?.detail?.user ?? {})
              );
              localStorage.setItem(
                "accessToken",
                response?.data?.detail?.token ?? ""
              );
            } else if (mode === "forgetPassword") {
              setPage(6);
            }
          }
        },
        onError: (error: any) => {
          console.error("Validation failed:", error);
          toast.error(
            <div>
              {error.response?.data?.errors?.map((item: string, i: number) => (
                <div key={i}>{item}</div>
              )) || "خطایی نا شناخته رخ داد"}
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        },
      }
    );
  };

  const onSubmitHandler = (
    values: VerifyOtpFormValues,
    { setSubmitting }: FormikHelpers<VerifyOtpFormValues>
  ) => {
    handleVerifyOtp(values.code);
    setSubmitting(false); // still needed for Formik internal state
  };

  const { mutate: resendCode, isPending: isResending } =
    useValidatePhoneNumber();

  const resendCodeFn = () => {
    resendCode(
      {
        phoneNumber,
        sendActiveCodeType: "Resend",
      },
      {
        onSuccess: (response) => {
          if (response?.data.success) {
            toast.success(response?.data.message, {
              position: "top-right",
              autoClose: 5000,
            });
          }
        },
        onError: (error: any) => {
          console.error("Validation failed:", error);
          toast.error(
            <div>
              {error.response?.data?.errors?.map((item: string, i: number) => (
                <div key={i}>{item}</div>
              )) || "خطایی نا شناخته رخ داد"}
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        },
      }
    );
  };

  const handleOTPKeyPress = (
    event: React.KeyboardEvent,
    submitForm: () => void
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submitForm();
    }
  };

  return (
    <Card className="w-full max-w-md h-fit mx-auto mt-20 sm:mt-32 px-4 sm:px-6">
      <LoginLogoHeader />

      <CardContent className="mt-5">
        {/* Header */}
        <div className="flex items-center mb-5">
          <button
            className="w-10 sm:w-12 flex justify-center font-bold text-gray-700 cursor-pointer"
            onClick={() => setPage(1)}
          >
            <ArrowRight size={"1.5rem"} />
          </button>
          <p className="text-lg sm:text-xl font-semibold text-center sm:text-right flex-1">
            کد تایید را وارد کنید
          </p>
        </div>

        <Formik<VerifyOtpFormValues>
          initialValues={{ code: "" }}
          validationSchema={validationSchema}
          onSubmit={onSubmitHandler}
        >
          {({ values, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <InputOTP
                  pattern={REGEXP_ONLY_DIGITS}
                  maxLength={4}
                  ref={inputRef}
                  value={values.code}
                  onChange={(value) =>
                    handleChange({ target: { name: "code", value } })
                  }
                  onKeyDown={(e) => handleOTPKeyPress(e, handleSubmit)}
                >
                  <InputOTPGroup
                    // ref={inputRef}
                    dir="ltr"
                    className="mx-auto flex gap-3 sm:gap-4"
                  >
                    <InputOTPSlot
                      index={0}
                      className="size-12 sm:size-14 text-lg"
                    />
                    <InputOTPSlot
                      index={1}
                      className="size-12 sm:size-14 text-lg"
                    />
                    <InputOTPSlot
                      index={2}
                      className="size-12 sm:size-14 text-lg"
                    />
                    <InputOTPSlot
                      index={3}
                      className="size-12 sm:size-14 text-lg"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {/* Switch login method */}
              {mode === "login" && (
                <Button
                  variant="link"
                  type="button"
                  className="text-[#008eb2] text-sm mt-5 p-0"
                  onClick={() => setPage(1)}
                >
                  ورود با رمز عبور <ChevronLeft />
                </Button>
              )}

              {/* Countdown timer */}
              <div className="flex items-center justify-center gap-2 my-5 text-sm flex-wrap text-gray-600">
                <p className="text-sm">مانده تا دریافت مجدد کد</p> :
                <CountdownTimer
                  resendCodeFn={resendCodeFn}
                  key={timerKey}
                  initialTime="02:00"
                />
              </div>

              {/* Submit */}
              <Button
                className="w-full text-white"
                size="lg"
                type="submit"
                disabled={isVerifying}
              >
                {isVerifying ? <Loader2 className="animate-spin" /> : "ادامه"}
              </Button>
            </form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default VerifyOtp;
