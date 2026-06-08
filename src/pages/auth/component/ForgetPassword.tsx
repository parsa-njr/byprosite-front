import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import LoginLogoHeader from "./LoginLogoHeader";
import { AuthMode, Setter } from "@/types";
import { useForgetPassword } from "@/query/auth/useAuth";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("رمز عبور الزامی است.")
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد.")
    .matches(
      /[^a-zA-Z0-9]/,
      "رمز عبور باید حداقل یک کاراکتر غیر الفبایی-عددی داشته باشد."
    )
    .matches(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک (a-z) داشته باشد.")
    .matches(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ (A-Z) داشته باشد."),
  reNewPassword: Yup.string()
    .required("رمز عبور الزامی است.")
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد.")
    .matches(
      /[^a-zA-Z0-9]/,
      "رمز عبور باید حداقل یک کاراکتر غیر الفبایی-عددی داشته باشد."
    )
    .matches(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک (a-z) داشته باشد.")
    .matches(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ (A-Z) داشته باشد."),
});

export interface ForgetPasswordFormValues {
  newPassword: string;
  reNewPassword: string;
}

export interface ForgetPasswordProps {
  setPage: Setter<number>;
  mode?: AuthMode;
  phoneNumber: string | null; // required to reset password
}

const ForgetPassword: React.FC<ForgetPasswordProps> = ({
  setPage,
  phoneNumber,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatedPassword, setShowReapeatedPassword] = useState(false);

  // inside your component
  const { mutate: forgetPassword, isPending } = useForgetPassword();

  const handleSubmit = (
    values: ForgetPasswordFormValues,
    { setSubmitting }: FormikHelpers<ForgetPasswordFormValues>
  ) => {
    forgetPassword(
      {
        phoneNumber,
        newPassword: values.newPassword,
        reNewPassword: values.reNewPassword,
      },
      {
        onSuccess: (response) => {
          if (response?.data.success) {
            toast.success(response?.data.message, {
              position: "top-right",
              autoClose: 5000,
            });
            setPage(1); // go back to first step
          }
        },
        onError: (error: any) => {
          console.error("Validation failed:", error);
          toast.error(
            <div>
              {error?.response?.data?.errors?.map((item: string, i: number) => (
                <div key={i}>{item}</div>
              )) || "خطایی ناشناخته رخ داد"}
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
            }
          );
        },
        onSettled: () => {
          setSubmitting(false);
        },
      }
    );
  };

  return (
    <Card className="w-full max-w-md h-fit mx-auto mt-20 sm:mt-32 px-4 sm:px-6">
      <LoginLogoHeader />

      <CardContent className="mt-5">
        <h2 className="text-xl font-semibold mb-5 text-center sm:text-right">
          بازیابی رمز عبور
        </h2>

        <Formik<ForgetPasswordFormValues>
          initialValues={{ newPassword: "", reNewPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-8">
              <div className="space-y-2">
                {/* New Password */}
                <div className="relative">
                  <Field
                    id="newPassword"
                    name="newPassword"
                    as={Input}
                    type={showPassword ? "text" : "password"}
                    placeholder="رمز جدید"
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
                  <ErrorMessage
                    name="newPassword"
                    component="p"
                    className="text-sm font-medium text-destructive"
                  />
                </div>

                {/* Repeat Password */}
                <div className="relative mt-3">
                  <Field
                    id="reNewPassword"
                    name="reNewPassword"
                    as={Input}
                    type={showRepeatedPassword ? "text" : "password"}
                    placeholder="تکرار رمز جدید"
                    className="pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowReapeatedPassword(!showRepeatedPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showRepeatedPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                  <ErrorMessage
                    name="reNewPassword"
                    component="p"
                    className="text-sm font-medium text-destructive"
                  />
                </div>
              </div>

              <Button
                className="w-full text-white"
                size="lg"
                type="submit"
                disabled={isSubmitting}
              >
                {isPending ? <Loader2 className="animate-spin" /> : "ثبت"}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default ForgetPassword;
