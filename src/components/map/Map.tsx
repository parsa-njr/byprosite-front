import { useRef, useState } from "react";
import NeshanMap, { NeshanMapRef } from "@neshan-maps-platform/react-openlayers";
import { toLonLat, fromLonLat } from "@neshan-maps-platform/ol/proj";
import SearchBox from "./SearchBox";
interface MapProps {
  onLocationChange?: (location: { latitude: number; longitude: number }) => void;
  onAddressChange?: (data: {
    address: string;
    state?: string;
    county?: string;
    city?: string;
  }) => void
   initialCenter?: { latitude: number; longitude: number };
}

const Map: React.FC<MapProps> = ({ onAddressChange, onLocationChange,initialCenter  }) => {
  const mapRef = useRef<NeshanMapRef | null>(null);
  const [center, setCenter] = useState({
  latitude: initialCenter?.latitude || 32.64116522249553,
  longitude: initialCenter?.longitude || 51.66706588502487,
});

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`,
        {
          headers: {
            "Api-Key": "service.f7655f077ad444faa12ebe3d33af04b2",
          },
        }
      );

      const data = await res.json();
       if (data?.status === "OK") {
        onAddressChange?.({
          address: data.formatted_address || data.address,
          state: data.state,
          county: data.county,
          city: data.city,
        });
      } else {
        onAddressChange?.({
          address: "آدرس یافت نشد",
        });
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      onAddressChange?.({ address: "خطا در دریافت آدرس" });
    }
  };

  const onInit = (map: any) => {
    map.setMapType("osm-bright");

    // گرفتن مرکز اولیه
    const view = map.getView();
    const centerCoords = view?.getCenter();
    if (centerCoords) {
      const [lng, lat] = toLonLat(centerCoords);
      setCenter({ latitude: lat, longitude: lng });
      fetchAddress(lat, lng);
      onLocationChange?.({ latitude: lat, longitude: lng });
    }

    // هر بار که نقشه حرکت کند:
    map.on("moveend", () => {
      const newCenter = map.getView().getCenter();
      if (newCenter) {
        const [lng, lat] = toLonLat(newCenter);
        const newLoc = { latitude: lat, longitude: lng };

        setCenter(newLoc);
        fetchAddress(lat, lng);
        onLocationChange?.(newLoc);
      }
    });
    
  };

    // وقتی کاربر مکان جدیدی از جستجو انتخاب می‌کند
  const handleSelectLocation = async (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setCenter({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    
    // دریافت اطلاعات کامل آدرس از Neshan
    await fetchAddress(location.latitude, location.longitude);
    
    onLocationChange?.({
      latitude: location.latitude,
      longitude: location.longitude,
    });

    const map = mapRef.current?.map;
    if (map) {
      map.getView().setCenter(fromLonLat([location.longitude, location.latitude]));
      map.getView().setZoom(16);
    }
  };

  return (
      <div className=" relative  w-full">

        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90%] md:w-[400px] z-20">
          <SearchBox
            onSelectLocation={handleSelectLocation}
            currentCenter={center}
          />
      </div>

      <NeshanMap
        ref={mapRef}
        mapKey="web.b8d6e95353e34f23866ae39a2f266e9f"
        defaultType="neshan"
        center={center}
        zoom={14}
        traffic={false}
        poi={false}
        style={{
          height: "50vh",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
        }}
        onInit={onInit}
      />

      {/* پین ثابت در مرکز نقشه */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="red"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="white"
          className="w-8 h-8 drop-shadow-lg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.25c-3.728 0-6.75 3.022-6.75 6.75 0 4.94 6.75 12.75 6.75 12.75s6.75-7.81 6.75-12.75c0-3.728-3.022-6.75-6.75-6.75z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Map;
