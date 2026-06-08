import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FC, useState } from "react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import authApi from "@/api/authApi";
import LoginLogoHeader from "./LoginLogoHeader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ActivityType, CustomerLegalStatus, SignUpFormValues } from "@/types";
import { useFirstSignUp } from "@/query/auth/useAuth";
import CustomInput from "@/components/shared/CustomInput";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("نام الزامی است."),
  lastName: Yup.string().required("نام خانوادگی الزامی است."),
  customerLegalStatus: Yup.string().required("نوع شخصیت الزامی است."),
  activityType: Yup.string().required("نوع فعالیت الزامی است."),
  password: Yup.string()
    .required("رمز عبور الزامی است.")
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد.")
    .matches(
      /[^a-zA-Z0-9]/,
      "رمز عبور باید حداقل یک کاراکتر غیر الفبایی-عددی داشته باشد."
    )
    .matches(/[a-z]/, "رمز عبور باید حداقل یک حرف کوچک (a-z) داشته باشد.")
    .matches(/[A-Z]/, "رمز عبور باید حداقل یک حرف بزرگ (A-Z) داشته باشد.")
    .matches(/[0-9]/, "رمز عبور باید حداقل دارای یک عدد (0-9) باشد."),
  // 👇 conditional fields
  companyName: Yup.string().when("customerLegalStatus", {
    is: "LegalEntity",
    then: (schema) => schema.required("نام شرکت الزامی است."),
    otherwise: (schema) => schema.notRequired(),
  }),
  companyManageName: Yup.string().when("customerLegalStatus", {
    is: "LegalEntity",
    then: (schema) => schema.required("نام مدیر شرکت الزامی است."),
    otherwise: (schema) => schema.notRequired(),
  }),
  companyManageFamily: Yup.string().when("customerLegalStatus", {
    is: "LegalEntity",
    then: (schema) => schema.required("نام خانوادگی مدیر شرکت الزامی است."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export interface SignUpFormProps {
  userId: string | null; // required, passed from VerifyOtp
}

const SignUpForm: FC<SignUpFormProps> = ({ userId }) => {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [searchParams] = useSearchParams();

  const initialValues: SignUpFormValues = {
    userId: userId ?? "",
    firstName: "",
    lastName: "",
    companyName: "",
    companyManageName: "",
    companyManageFamily: "",
    email: "",
    password: "",
    confirmPassword: "",
    customerLegalStatus: "",
    activityType: "",
  };

  const backUrl = searchParams.get("backUrl");
  const backupUrl = searchParams.get("backupUrl");
  const navigate = useNavigate();

  const customerLegalStatusOpt = [
    { label: "حقیقی", value: CustomerLegalStatus.Individual },
    { label: "حقوقی", value: CustomerLegalStatus.LegalEntity },
  ];
  const activityTypeOpt = [
    { label: "خریدار", value: ActivityType.Buyer },
    { label: "فروشنده", value: ActivityType.Seller },
    { label: "هردو", value: ActivityType.BuyerAndSeller },
  ];

  const { mutate: firstSignUp, isPending } = useFirstSignUp();

  const handleSubmit = (values: SignUpFormValues) => {
    console.log("passssss :: ", values);
    setSubmitLoading(true);

    firstSignUp(values, {
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
            if (backupUrl) {
              navigate(`/${backUrl}?backUrl=${backupUrl}`);
            } else {
              navigate(`/${backUrl}`);
            }
          } else {
            navigate(`/`);
          }
        }
        setSubmitLoading(false);
      },
      onError: (error: any) => {
        console.error("Validation failed:", error);
        setSubmitLoading(false);

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
    });
  };
  return (
    <Card className="w-full max-w-2xl h-fit mx-auto mt-16 sm:mt-24 px-4 sm:px-6">
      <LoginLogoHeader />

      <CardContent className="mt-2">
        <h2 className="text-lg sm:text-xl font-semibold mb-5">تکمیل اطلاعات</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, errors, touched }) => (
            <Form className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <CustomInput
                    type="text"
                    onChange={(val) => setFieldValue("firstName", val)}
                    value={values?.firstName}
                    label="نام"
                    placeholder="نام"
                    error={touched.firstName && errors.firstName}
                  />
                </div>
                <div className="flex-1">
                  <CustomInput
                    type="text"
                    onChange={(val) => setFieldValue("lastName", val)}
                    value={values?.lastName}
                    label="نام خانوادگی"
                    placeholder="نام خانوادگی"
                    error={touched.lastName && errors.lastName}
                  />
                </div>
              </div>

              {/* activityType & customerLegalStatus */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <CustomInput
                    type="select"
                    onChange={(val) => setFieldValue("activityType", val)}
                    options={activityTypeOpt}
                    value={values?.activityType}
                    label="نوع فعالیت"
                    placeholder="انتخاب کنید"
                    error={touched.activityType && errors.activityType}
                  />
                </div>

                <div className="flex-1">
                  <CustomInput
                    type="select"
                    onChange={(val) =>
                      setFieldValue("customerLegalStatus", val)
                    }
                    options={customerLegalStatusOpt}
                    value={values?.customerLegalStatus}
                    label="نوع شخصیت"
                    placeholder="انتخاب کنید"
                    error={
                      touched.customerLegalStatus && errors.customerLegalStatus
                    }
                  />
                </div>
              </div>

              {/* companyName & password */}
              <div className="flex flex-col md:flex-row gap-4">
                {values.customerLegalStatus === "LegalEntity" && (
                  <div className="flex-1">
                    <CustomInput
                      type="text"
                      onChange={(val) => setFieldValue("companyName", val)}
                      value={values?.companyName}
                      label="نام شرکت"
                      placeholder="نام شرکت"
                      error={touched.companyName && errors.companyName}
                    />
                  </div>
                )}

                <div className="flex-1 relative">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 mb-1 block"
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
              </div>

              {values.customerLegalStatus === "LegalEntity" && (
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <CustomInput
                      type="text"
                      onChange={(val) =>
                        setFieldValue("companyManageName", val)
                      }
                      value={values?.companyManageName}
                      label="نام مدیر شرکت"
                      placeholder="نام مدیر شرکت"
                      error={
                        touched.companyManageName && errors.companyManageName
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <CustomInput
                      type="text"
                      onChange={(val) =>
                        setFieldValue("companyManageFamily", val)
                      }
                      value={values?.companyManageFamily}
                      label="نام خانوادگی مدیر شرکت"
                      placeholder="نام خانوادگی مدیر شرکت"
                      error={
                        touched.companyManageFamily &&
                        errors.companyManageFamily
                      }
                    />
                  </div>
                </div>
              )}

              {/* submit */}
              <Button
                className="w-full text-white"
                size="lg"
                type="submit"
                disabled={submitLoading}
              >
                {isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "ثبت اطلاعات"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
