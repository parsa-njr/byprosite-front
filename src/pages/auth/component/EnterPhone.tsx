import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoginLogoHeader from "./LoginLogoHeader";
import { EnterPhoneProps } from "@/types";
import { useValidatePhoneNumber } from "@/query/auth/useAuth";
import CustomInput from "@/components/shared/CustomInput";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("لطفا شماره موبایل خود را وارد کنید.")
    .test("valid-phone", "لطفا شماره موبایل معتبر وارد کنید.", (value) => {
      if (!value) return false;
      const phoneRegex = /^09\d{9}$/;
      return phoneRegex.test(value);
    }),
});

// ✅ Form Values type
interface FormValues {
  phoneNumber: string;
}

const EnterPhone: React.FC<EnterPhoneProps> = ({
  setPage,
  mode = "signUp",
  setPhoneNumber,
  phoneNumber,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    await handleValidatePhone(values.phoneNumber);
    setSubmitting(false);
  };

  const { mutate: validatePhoneNumber, isPending } = useValidatePhoneNumber();

  const handleValidatePhone = (phoneNumber: string) => {
    validatePhoneNumber(
      {
        phoneNumber,
        sendActiveCodeType:
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

            if (setPhoneNumber) {
              setPhoneNumber(phoneNumber);
            }

            if (mode === "signUp") {
              setPage(2);
            } else if (mode === "login") {
              setPage(3);
            } else if (mode === "forgetPassword") {
              setPage(5);
            }
          }
        },
        onError: (error: any) => {
          console.error("Validation failed:", error);
          toast.error(
            <div>
              {error?.response?.data?.errors?.map((item: string, i: number) => (
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

  return (
    <Card className="w-full max-w-md h-fit mx-auto mt-20 sm:mt-32 px-4 sm:px-6">
      <LoginLogoHeader />

      <CardContent className="mt-5">
        <h2 className="text-xl font-semibold mb-5">
          {mode === "signUp"
            ? "ثبت نام"
            : mode === "login"
            ? "ورود"
            : "بازیابی رمز عبور"}
        </h2>

        <Formik<FormValues>
          initialValues={{ phoneNumber: phoneNumber || "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="flex flex-col gap-8">
              <div className="space-y-2">
                <p className="text-[#3f4064] text-sm leading-6 text-right pb-2">
                  لطفا شماره موبایل خود را وارد کنید.
                </p>
                <CustomInput
                  type="number"
                  onChange={(val) => setFieldValue("phoneNumber", val)}
                  value={values?.phoneNumber}
                  maxLength={11}
                />{" "}
                <ErrorMessage
                  name="phoneNumber"
                  component="p"
                  className="text-sm font-medium text-destructive"
                />
              </div>
              <Button
                className="w-full text-white bg-primary"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : mode === "signUp" ? (
                  "ثبت نام"
                ) : (
                  "ورود"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>

      <CardFooter className="flex flex-col gap-5">
        <div>
          <p className="text-sm text-[#3f4064] text-center sm:text-right">
            ورود شما به معنای پذیرش{" "}
            <span className="text-[#008eb2]">شرایط و قوانین حریم ‌خصوصی</span>{" "}
            است
          </p>
        </div>

        <div className="text-center sm:text-right w-full">
          {mode === "signUp" ? (
            <p className="text-xs text-[#3f4064]">
              حساب کاربری دارید ؟{" "}
              <span
                onClick={() => {
                  navigate("/login");
                }}
                className="text-[#008eb2] cursor-pointer"
              >
                ورود
              </span>
            </p>
          ) : (
            <p className="text-xs text-[#3f4064]">
              حساب کاربری ندارید ؟{" "}
              <span
                onClick={() => {
                  navigate("/sign-up");
                }}
                className="text-[#008eb2] cursor-pointer"
              >
                ثبت نام
              </span>
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default EnterPhone;
