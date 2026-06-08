import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Plus,
  Trash2,
  MapPin,
  ShoppingBasket,
  Info,
  User,
  LayoutDashboard,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddressItem from "@/components/address/AddressItem";
import AddressFormModal from "@/components/address/AddressFormModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AddressFormValues,
  LevelTwoSignUpFormValues,
  LevelTwoSignUpRequest,
} from "@/types";
import { useSignUpLevelTwo } from "@/query/auth/useAuth";
import FieldArrayCategory from "./FieldArrayCategory";
import CustomInput from "@/components/shared/CustomInput";
import AddressComponent from "@/components/dynamicAddress/AddressComponent";

// ✅ Validation Schema
const validationSchema = Yup.object().shape({
  meliCode: Yup.string()
    // .required("کد ملی الزامی است")
    .matches(/^[0-9]{10}$/, "کد ملی باید 10 رقم باشد"),
  email: Yup.string().email("ایمیل معتبر نیست"),

  groupIds: Yup.array()
    .of(Yup.number().min(1, "گروه نامعتبر است"))
    .min(1, "حداقل یک گروه باید انتخاب شود"),
  addresses: Yup.array()
    .of(
      Yup.object().shape({
        addressValue: Yup.string().required("آدرس الزامی است"),
        addressDescription: Yup.string().required("توضیحات آدرس الزامی است"),
        type: Yup.string().required("نوع آدرس الزامی است"),
        // lat: Yup.number().required("عرض جغرافیایی الزامی است"),
        // lng: Yup.number().required("طول جغرافیایی الزامی است"),
        isDefault: Yup.boolean(),
        provinceId: Yup.number().required("استان الزامی است"),
        countyId: Yup.number().required("شهرستان الزامی است"),
        cityId: Yup.number().required("شهر الزامی است"),
      })
    )
    // .min(1, "حداقل یک آدرس باید اضافه شود"),
});

const LevelTwoSignUp = () => {
  const [mode, setMode] = useState<"create" | "edit" | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [initialAddress, setInitialAddress] =
    useState<Partial<AddressFormValues> | null>({
      addressValue: "",
      addressDescription: "",
      type: "Habitat",
      lat: 0,
      lng: 0,
      isDefault: false,
      provinceId: 0,
      countyId: 0,
      cityId: 0,
    });
  const [searchParams] = useSearchParams();

  const backUrl = searchParams.get("backUrl");
  const navigate = useNavigate();

  // inside your component
  const { mutate: signUpLevelTwo, isPending } = useSignUpLevelTwo();

  const handleSubmit = (values: LevelTwoSignUpRequest) => {
    console.log("Submitting values:", values);

    // format body to match API
    const body: LevelTwoSignUpRequest = {
      meliCode: values?.meliCode,
      email: values?.email,
      // shebaNumber: values?.shebaNumber,
      groupIds: values?.groupIds,
      // bankId: values?.bankId,
      addresses: values?.addresses,
    };

    signUpLevelTwo(body, {
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
        console.error("Submission failed:", error);
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
    <Card className="w-full max-w-3xl mx-auto mt-36">
      {/* <LoginLogoHeader /> */}

      <CardContent className="p-6">
        {/* <h2 className="text-2xl font-semibold mb-6 text-center">
          تکمیل اطلاعات
        </h2> */}

        <Formik<LevelTwoSignUpFormValues>
          initialValues={{
            meliCode: "",
            email: "",
            shebaNumber: "",
            groupIds: [],
            categories: [{ categoryId: "", groupIds: [] }],
            bankId: 0,
            addresses: [
              // {
              //   addressValue:
              //     "سپاهان شهر بلوار غدیر خیابان تعاون 2 مجتمع بهاران",
              //   addressDescription: "بلوک 9 طبقه دوم پلاک 6",
              //   type: "Habitat",
              //   lat: 32.5514839,
              //   lng: 51.6850178,
              //   isDefault: true,
              //   provinceId: 0,
              //   countyId: 0,
              //   cityId: 0,
              //   provinceName: "",
              //   countyName: "",
              //   cityName: "",
              // },
            ],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values, setFieldValue, errors }) => (
            <Form className="flex flex-col gap-6">
              {/* Basic Information Section */}
              <div className="mx-auto text-sm text-gray-400 flex gap-2 items-center">
                <Info />
                برای ثبت آگهی نیاز به تکمیل اطلاعات زیر می باشد
              </div>
              <div className="space-y-4">
                <h3 className="flex items-center text-lg font-semibold text-primary gap-2 pb-2 border-b border-gray-200">
                  <span className="bg-secondary/20 p-2 rounded-full">
                    <User className="h-5 w-5 text-secondary" />
                  </span>
                  اطلاعات اصلی
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <CustomInput
                      type="number"
                      onChange={(val) => setFieldValue("meliCode", val)}
                      value={values?.meliCode}
                      label="کد ملی"
                      placeholder="کد ملی"
                      maxLength={10}
                    />

                    <ErrorMessage
                      name="meliCode"
                      component="p"
                      className="text-sm font-medium text-destructive mt-1"
                    />
                  </div>

                  <div>
                    <CustomInput
                      type="text"
                      onChange={(val) => setFieldValue("email", val)}
                      value={values?.email}
                      label="ایمیل"
                      placeholder="ایمیل"
                    />

                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-sm font-medium text-destructive mt-1"
                    />
                  </div>
                </div>
              </div>
              <FieldArray name="categories">
                {({ push, remove }) => (
                  <>
                    <h3 className="flex items-center text-lg font-semibold text-primary gap-2 pb-2 border-b border-gray-200">
                      <span className="bg-secondary/20 p-2 rounded-full">
                        <LayoutDashboard className="h-5 w-5 text-secondary" />
                      </span>
                      زمینه فعالیت
                    </h3>
                    {values.categories.map((item, index) => (
                      <FieldArrayCategory
                        setFieldValue={setFieldValue}
                        values={values}
                        push={push}
                        remove={remove}
                        index={index}
                        item={item}
                      />
                    ))}
                  </>
                )}
              </FieldArray>
              <AddressComponent
                onSelect={(val) => {
                  setFieldValue("addresses[0]", val);
                }}
                defaultSelectedId={null}
                title="آدرس"
              />

              {/* Submit Button */}
              <Button
                className="w-full text-white mt-4"
                size="lg"
                type="submit"
                disabled={isPending}
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

export default LevelTwoSignUp;
