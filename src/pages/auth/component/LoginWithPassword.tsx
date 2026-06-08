import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import LoginLogoHeader from "./LoginLogoHeader";
import {
  LoginWithPasswordFormValues,
  LoginWithPasswordProps,
  LoginWithPasswordRequest,
} from "@/types";
import { useLoginWithPassword } from "@/query/auth/useAuth";
import CustomInput from "@/components/shared/CustomInput";

const validationSchema = Yup.object().shape({
  phoneNumber: Yup.string()
    .required("لطفا شماره موبایل خود را وارد کنید.")
    .test("valid-phone", "لطفا شماره موبایل معتبر وارد کنید.", (value) => {
      if (!value) return false;
      const phoneRegex = /^09\d{9}$/;
      return phoneRegex.test(value);
    }),
  password: Yup.string().required("لطفا رمز عبور خود را وارد کنید."),
});

const LoginWithPassword: React.FC<LoginWithPasswordProps> = ({
  setPage,
  setPhoneNumber,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const backUrl = searchParams.get("backUrl");

  // inside your component
  const { mutate: loginWithPassword, isPending } = useLoginWithPassword();

  const handleSubmit = (values: LoginWithPasswordFormValues) => {
    const body: LoginWithPasswordRequest = {
      phoneNumber: values.phoneNumber,
      password: values.password,
      code: "",
      isPersistent: values.isPersistent,
    };

    loginWithPassword(body, {
      onSuccess: (response) => {
        if (response?.data.success) {
          toast.success(response?.data.message, {
            position: "top-right",
            autoClose: 5000,
          });

          localStorage.setItem(
            "user",
            JSON.stringify(response?.data?.detail?.user ?? {})
          );
          localStorage.setItem(
            "accessToken",
            response?.data?.detail?.token ?? ""
          );

          if (backUrl) {
            navigate(`/${backUrl}`);
          } else {
            navigate(`/`);
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
    });
  };

  return (
    <Card className="w-full max-w-md h-fit mx-auto mt-20 sm:mt-32 mb-10 px-4 sm:px-6">
      <LoginLogoHeader />

      <CardContent>
        <h2 className="text-xl font-semibold mb-5 text-center sm:text-right">
          ورود
        </h2>

        <Formik<LoginWithPasswordFormValues>
          initialValues={{ phoneNumber: "", password: "", isPersistent: false }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="flex flex-col gap-6">
              {/* Phone number */}
              <div>
                <p className="text-[#3f4064] text-sm leading-6 text-right pb-2">
                  لطفا شماره موبایل خود را وارد کنید.
                </p>
                <CustomInput
                  type="number"
                  onChange={(val) => {
                    setFieldValue("phoneNumber", val);
                    setPhoneNumber(val);
                  }}
                  value={values?.phoneNumber}
                                    maxLength={11}

                />
                <ErrorMessage
                  name="phoneNumber"
                  component="p"
                  className="text-sm font-medium text-destructive"
                />
              </div>

              {/* Password */}
              <div className="flex-1 relative">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 mb-1 block text-right"
                >
                  رمز عبور
                </label>
                <div className="relative">
                  <Field
                    id="password"
                    name="password"
                    as={Input}
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز عبور"
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-sm font-medium text-destructive"
                />
              </div>

              {/* Submit */}
              <Button
                className="w-full text-white"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "ورود"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>

      <CardFooter className="flex flex-col gap-3">
        <div className="text-right w-full flex flex-col items-start gap-1">
          <Button
            variant="link"
            type="button"
            className="text-[#008eb2] text-sm cursor-pointer p-0"
            onClick={() => setPage(2)}
          >
            ورود با کد یکبار مصرف <ChevronLeft />
          </Button>
          <Button
            variant="link"
            type="button"
            className="text-[#008eb2] text-sm cursor-pointer p-0"
            onClick={() => setPage(4)}
          >
            فراموشی رمز عبور <ChevronLeft />
          </Button>
        </div>

        <div className="text-center sm:text-right w-full mt-2">
          <p className="text-xs text-[#3f4064]">
            حساب کاربری ندارید ؟{" "}
            <span
              onClick={() => navigate("/sign-up")}
              className="text-[#008eb2] cursor-pointer"
            >
              ثبت نام
            </span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginWithPassword;
