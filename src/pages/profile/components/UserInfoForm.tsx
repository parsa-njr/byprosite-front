import { Button } from "@/components/ui/button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { User } from "@/hooks/useUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import authApi from "@/api/authApi";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import CustomInput from "@/components/shared/CustomInput";

interface UserInfoFormProps {
  user: User;
  onClose: () => void;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("نام الزامی است."),
  lastName: Yup.string().required("نام خانوادگی الزامی است."),
  email: Yup.string()
    .email("ایمیل معتبر نیست")
    .required("ایمیل الزامی است."),
  phoneNumber: Yup.string()
    .required("شماره موبایل الزامی است.")
    .test("valid-phone", "لطفا شماره موبایل معتبر وارد کنید.", (value) => {
      if (!value) return false;
      const phoneRegex = /^09\d{9}$/;
      return phoneRegex.test(value);
    }),
});

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export default function UserInfoForm({ user, onClose }: UserInfoFormProps) {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string }) =>
      authApi.updateUserProfile(data),
    onSuccess: (response) => {
      toast.success("اطلاعات کاربر با موفقیت به‌روزرسانی شد");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // Update localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = {
          ...userData,
          firstName: response.data?.data?.firstName || userData.firstName,
          lastName: response.data?.data?.lastName || userData.lastName,
          email: response.data?.data?.email || userData.email,
          phoneNumber: response.data?.data?.phoneNumber || userData.phoneNumber,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      onClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در به‌روزرسانی اطلاعات");
    },
  });

  const initialValues: FormValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
  };

  const handleSubmit = (values: FormValues) => {
    const updateData: { firstName?: string; lastName?: string; email?: string; phoneNumber?: string } = {};
    
    if (values.firstName !== user.firstName) updateData.firstName = values.firstName;
    if (values.lastName !== user.lastName) updateData.lastName = values.lastName;
    if (values.email !== user.email) updateData.email = values.email;
    if (values.phoneNumber !== user.phoneNumber) updateData.phoneNumber = values.phoneNumber;

    if (Object.keys(updateData).length === 0) {
      toast.info("تغییراتی اعمال نشده است");
      onClose();
      return;
    }

    updateMutation.mutate(updateData);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched, isSubmitting }) => (
        <Form className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
          <div className="flex-1">
            <CustomInput
              type="text"
              onChange={(val) => setFieldValue("firstName", val)}
              value={values.firstName}
              label="نام"
              placeholder="نام خود را وارد کنید"
              error={touched.firstName && errors.firstName}
            />
          </div>
          <div className="flex-1">
            <CustomInput
              type="text"
              onChange={(val) => setFieldValue("lastName", val)}
              value={values.lastName}
              label="نام خانوادگی"
              placeholder="نام خانوادگی خود را وارد کنید"
              error={touched.lastName && errors.lastName}
            />
          </div>
          <div className="flex-1">
            <CustomInput
              type="text"
              onChange={(val) => setFieldValue("email", val)}
              value={values.email}
              label="ایمیل"
              placeholder="ایمیل خود را وارد کنید"
              error={touched.email && errors.email}
            />
          </div>
          <div className="flex-1">
            <CustomInput
              type="number"
              onChange={(val) => setFieldValue("phoneNumber", val)}
              value={values.phoneNumber}
              label="شماره موبایل"
              placeholder="شماره موبایل خود را وارد کنید"
              error={touched.phoneNumber && errors.phoneNumber}
            />
          </div>
          <div className="md:col-span-2 flex justify-end mt-4 gap-2" dir="rtl">
            <Button 
              type="button" 
              onClick={onClose} 
              variant="ghost"
              disabled={isSubmitting || updateMutation.isPending}
            >
              لغو
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting || updateMutation.isPending}
            >
              {(isSubmitting || updateMutation.isPending) ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره تغییرات"
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
