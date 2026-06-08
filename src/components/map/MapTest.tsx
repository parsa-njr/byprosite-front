// // import React, { useRef, useState } from "react";
// // import NeshanMap from "@neshan-maps-platform/react-openlayers";
// // import { fromLonLat } from "ol/proj";
// // import { Feature } from "ol";
// // import Point from "ol/geom/Point";
// // import { Style, Icon } from "ol/style";
// // import VectorSource from "ol/source/Vector";
// // import VectorLayer from "ol/layer/Vector";

// // const Map = () => {
// //   const mapRef = useRef<any>(null);
// //   const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
// //   const markerLayerRef = useRef<any>(null);

// //   const handleMapClick = (event: any) => {
// //     const [lng, lat] = event.coordinate;
// //     setMarkerPosition({ lat, lng });

// //     const map = mapRef.current;
// //     if (!map) return;

// //     // Remove previous marker if exists
// //     if (markerLayerRef.current) {
// //       map.removeLayer(markerLayerRef.current);
// //     }

// //     // Create marker feature
// //     const marker = new Feature({
// //       geometry: new Point(fromLonLat([lng, lat])),
// //     });

// //     // Marker style (you can replace the icon URL)
// //     marker.setStyle(
// //       new Style({
// //         image: new Icon({
// //           src: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
// //           scale: 0.07,
// //           anchor: [0.5, 1],
// //         }),
// //       })
// //     );

// //     // Add marker to vector layer
// //     const vectorSource = new VectorSource({
// //       features: [marker],
// //     });

// //     const markerLayer = new VectorLayer({
// //       source: vectorSource,
// //     });

// //     map.addLayer(markerLayer);
// //     markerLayerRef.current = markerLayer;
// //   };

// //   return (
// //     <div className="w-full">
// //       <NeshanMap
// //         mapKey="service.f7655f077ad444faa12ebe3d33af04b2"
// //         defaultType="neshan"
// //         center={{ latitude: 35.7665394, longitude: 51.4749824 }}
// //         zoom={14}
// //         style={{ height: "40vh", width: "100%", borderRadius: "12px", overflow: "hidden" }}
// //         onInit={(map: any) => {
// //           mapRef.current = map;
// //           map.on("click", handleMapClick);
// //         }}
// //       />

// //       {markerPosition && (
// //         <div className="mt-3 text-sm text-gray-700">
// //           📍 <b>Latitude:</b> {markerPosition.lat.toFixed(6)} | <b>Longitude:</b>{" "}
// //           {markerPosition.lng.toFixed(6)}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Map;

// import React, { useState } from "react";
// // import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
// // import L from "leaflet";
// import { Map } from "@neshan-maps-platform/ol";
// import NeshanMap, {
//   NeshanMapRef,
// } from "@neshan-maps-platform/react-openlayers";

// // Marker icon fix for default Leaflet (since Vite can break its path)
// // const markerIcon = new L.Icon({
// //   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
// //   iconSize: [35, 35],
// //   iconAnchor: [17, 35],
// // });

// // function LocationMarker({
// //   onSelect,
// // }: {
// //   onSelect: (lat: number, lng: number) => void;
// // }) {
// //   const [position, setPosition] = useState<[number, number] | null>([
// //     32.647094, 51.667514,
// //   ]);

// //   useMapEvents({
// //     click(e) {
// //       setPosition([e.latlng.lat, e.latlng.lng]);
// //       onSelect(e.latlng.lat, e.latlng.lng);
// //     },
// //   });
// //   // @ts-ignore
// //   return position ? <Marker position={position} icon={markerIcon} /> : null;
// // }

// // const Map = ({ onMapClick }) => {
// //   const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>({
// //     lat: 32.64709,
// //     lng: 51.667514,
// //   });

// //   return (
// //     <div className="w-full">
// //       <MapContainer
// //         // @ts-ignore
// //         center={[32.647094, 51.667514]}
// //         zoom={14}
// //         style={{
// //           height: "30vh",
// //           width: "100%",
// //           borderRadius: "12px",
// //           overflow: "hidden",
// //         }}
// //       >
// //         <TileLayer
// //           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //           // @ts-ignore
// //           attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
// //         />
// //         <LocationMarker
// //           onSelect={(lat, lng) => {
// //             setLatLng({ lat, lng });
// //             onMapClick(lat, lng);
// //           }}
// //         />
// //       </MapContainer>

// //       {/* {latLng && (
// //         <div className="mt-3 text-sm text-gray-700">
// //           📍 <b>Latitude:</b> {latLng.lat.toFixed(6)} | <b>Longitude:</b>{" "}
// //           {latLng.lng.toFixed(6)}
// //         </div>
// //       )} */}
// //     </div>
// //   );
// // };

// const Map = ({}) => {
//   return <NeshanMap mapKey="service.7a3c0bfaad6b4c1fa91015a89e9ce4e0"></NeshanMap>;
// };

// export default Map;
