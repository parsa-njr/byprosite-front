import { useRef, useState, useEffect } from "react";
import NeshanMap, { NeshanMapRef } from "@neshan-maps-platform/react-openlayers";
import { fromLonLat } from "@neshan-maps-platform/ol/proj";

interface MapProps {
  initialCenter: { latitude: number; longitude: number };
  markerPosition: { latitude: number; longitude: number };
}

const ShowMap: React.FC<MapProps> = ({ 
  initialCenter,
  markerPosition 
}) => {
  const mapRef = useRef<NeshanMapRef | null>(null);
  const [pixelPosition, setPixelPosition] = useState<{ top: number; left: number } | null>(null);

  const updateMarkerPixelPosition = () => {
    const map = mapRef.current?.map;
    if (!map) return;

    // Convert geographic coordinates to pixel coordinates
    const coordinate = fromLonLat([initialCenter.longitude, initialCenter.latitude]);
    const pixel = map.getPixelFromCoordinate(coordinate);
    
    setPixelPosition({
      left: pixel[0],
      top: pixel[1]
    });
  };

  const onInit = (map: any) => {
    map.setMapType("osm-bright");

    // Update marker position after map is initialized
    setTimeout(() => {
      updateMarkerPixelPosition();
    }, 100);

    // Update marker pixel position when map moves or zooms
    map.on("moveend", updateMarkerPixelPosition);
    map.on("postrender", updateMarkerPixelPosition);
  };

  // Update marker position when markerPosition prop changes
//   useEffect(() => {
//     if (mapRef.current) {
//       updateMarkerPixelPosition();
//     }
//   }, [markerPosition]);

  return (
    <div className="relative w-full">
      <NeshanMap
        ref={mapRef}
        mapKey="web.b8d6e95353e34f23866ae39a2f266e9f"
        defaultType="neshan"
        center={initialCenter}
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

      {/* Fixed marker at specific geographic coordinates */}
      {pixelPosition && (
        <div 
          className="absolute pointer-events-none z-10"
          style={{
            left: pixelPosition.left,
            top: pixelPosition.top,
            transform: 'translate(-50%, -100%)' // Center the bottom of icon on coordinates
          }}
        >
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
      )}
    </div>
  );
};

export default ShowMap;