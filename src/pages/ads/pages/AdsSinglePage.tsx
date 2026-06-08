import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleAdToShow } from "@/query/ads/useAds";
import Loader from "@/components/shared/Loader";
import moment from "moment-jalaali";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ImageCard from "../components/AdsSinglePage/ImageCard";
import { Phone } from "lucide-react";
import Options from "../components/AdsSinglePage/Options";
import Properties from "../components/AdsSinglePage/Properties";
import AdDetails from "../components/AdsSinglePage/AdDetails";
import { MapPin } from "lucide-react";
import { useGetEnvironmentalProperies } from "@/query/globals/useGlobal";
import EnvOptions from "../components/AdsSinglePage/EnvOptions";
import ShowMap from "@/components/map/ShowMap";
import AttachmentGallery from "../components/AdsSinglePage/AttachmentsGallery";
const AdsSinglePage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isSuccess } = useGetSingleAdToShow(id || "0");
  const [mainImage, setMainImage] = useState<string | null>(null);
  const ad = data?.data?.data;
  const properties = data?.data?.properties;
  const attachments = data?.data?.attachments;
  const { data: envPropertyList, isLoading: propertyLoading } =
    useGetEnvironmentalProperies();

  const [envPropertyOpt, setEnvPropertyOpt] = useState([]);

  useEffect(() => {
    console.log("envPropertyList :: ", envPropertyList);
    if (envPropertyList) {
      setEnvPropertyOpt(() =>
        envPropertyList.data.data?.map((item) => ({
          label: item?.title,
          value: item?.id,
        }))
      );
    }
  }, [envPropertyList]);

  useEffect(() => {
    if (ad) getMainImage();
  }, [ad]);

  const getMainImage = () => {
    const image = data?.data?.attachments?.find(
      (att: any) => att.AdvertisementSegment === 0
    );
    if (image) setMainImage(image.FilePath);
  };

  if (!isSuccess || !ad) return <Loader />;

  return (
    <div className="pt-24 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* RIGHT - Info */}
        <Card className="p-8 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-8">
          {/* Title & Status */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {ad.title}
            </h1>
            <Badge
              variant="outline"
              className={`px-4 py-2 rounded-full text-sm ${
                ad.buySell === "buy"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {ad.buySell === "buy" ? "خرید" : "فروش"}
            </Badge>
          </div>

          {/* Description */}
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed border-t border-gray-200 dark:border-gray-700 pt-4">
            {ad.description || "توضیحی ثبت نشده است."}
          </div>

          {/* Details Grid */}
          <AdDetails ad={ad} />

          {/* Product Description */}
          <Section title="مجوز های محیط زیست">
            <EnvOptions
              options={envPropertyOpt || []}
              envList={ad?.environmentalProperties}
            />
          </Section>

          {/* Features Section */}
          <Section title="ویژگی‌های  آگهی">
            <Options
              chat={ad?.chat}
              testingWithoutSampling={ad?.testingWithoutSampling}
              testingWithSampling={ad?.testingWithSampling}
              loadingOrigin={ad?.loadingOrigin}
              transportationOriginDestination={
                ad?.transportationOriginDestination
              }
              unloadingDestination={ad?.unloadingDestination}
              inspectionCertificates={ad?.inspectionCertificates}
              warehouseStorage={ad?.warehouseStorage}
            />
          </Section>

          {/* Visiting Section */}
          {ad.visiting && (
            <Section title="بازدید از محصول">
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <div>
                  <strong>شروع بازدید:</strong>{" "}
                  {moment(ad.visitingStartTime).format("jYYYY/jMM/jDD")}
                </div>
                <div>
                  <strong>پایان بازدید:</strong>{" "}
                  {ad.visitingEndTime
                    ? moment(ad.visitingEndTime).format("jYYYY/jMM/jDD")
                    : "پایان بازدید مشخص نشده"}
                </div>
              </div>
            </Section>
          )}

          {/* Properties Section */}
          {(properties?.physical?.length > 0 ||
            properties?.chemical?.length > 0) && (
            <Section title="ویژگی‌های محصول">
              <Properties properties={properties} />
            </Section>
          )}
        </Card>
        {/* LEFT - Image + Contact */}
        <Card className="p-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col items-center justify-between space-y-6">
          {/* Image */}
          <ImageCard mainImage={mainImage} />

          {/* Map Section */}
          <div className="w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm relative">
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 dark:bg-gray-900/80 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 shadow">
              <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>موقعیت فروشنده</span>
            </div>
            {/* <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.294323116089!2d-122.41941558468112!3d37.77492977975813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c77e2f8c9%3A0x2d6b9dc7c77e2f8c9!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v1697403645123!5m2!1sen!2sus"
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            ></iframe> */}

            <ShowMap
              initialCenter={{
                latitude: 32.64116522249553,
                longitude: 51.66706588502487,
              }}
              markerPosition={{
                latitude: 32.65116522249553,
                longitude: 51.67706588502487,
              }}
            />
            {/* <ShowMap
            // initialCenter={{
            //   latitude: initialValues?.lat,
            //   longitude: initialValues?.lng,
            // }}
            // onAddressChange={handleAddressChange}
            // onLocationChange={handleLocationChange}
            // initialCenter={
            //   initialValues?.lat && initialValues?.lng
            //     ? { latitude: initialValues.lat, longitude: initialValues.lng }
            //     : undefined
            // }
          /> */}
          </div>

          {/* Contact Button */}
          <Button
            className="w-full mt-2 text-lg py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-semibold rounded-xl shadow-md"
            onClick={() => {
              const phoneNumber = ad?.answeringPhone;
              if (phoneNumber) {
                window.open(`tel:${phoneNumber}`);
              }
            }}
            disabled={!ad?.answeringPhone}
          >
            <Phone className="inline mr-2" />
            تماس با فروشنده
          </Button>

          {/* Image Gallery Section */}
          <AttachmentGallery attachments={attachments}/>
        </Card>
      </div>
    </div>
  );
};

export default AdsSinglePage;

// 🔹 Small reusable components for cleaner JSX
const Detail = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex justify-between bg-gray-50 dark:bg-gray-900 rounded-xl px-3 py-2">
    <span className="font-semibold text-gray-900 dark:text-gray-100">
      {label}:
    </span>
    <span className="text-gray-600 dark:text-gray-300">{children}</span>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
      {title}
    </h2>
    {children}
  </div>
);
