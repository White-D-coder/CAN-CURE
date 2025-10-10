"use client";
import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "500px" };

export default function GoogleDoctorsMap() {
  const [center, setCenter] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setCenter({ lat: 40.7128, lng: -74.006 }),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/doctors");
      const json = await res.json();
      setDoctors(json.doctors || []);
    };
    load();
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. Add it to your environment.
      </div>
    );
  }

  return (
    <div className="w-full">
      {center && (
        <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
            <Marker position={center} title="You" />
            {doctors.map((d) => (
              <Marker
                key={d.id}
                position={{ lat: d.latitude, lng: d.longitude }}
                title={d.name}
                onClick={() => setActiveId(d.id)}
              />
            ))}
            {doctors.map((d) =>
              activeId === d.id ? (
                <InfoWindow key={`info-${d.id}`} position={{ lat: d.latitude, lng: d.longitude }} onCloseClick={() => setActiveId(null)}>
                  <div className="min-w-[200px]">
                    <div className="font-semibold">{d.name}</div>
                    <div className="text-sm text-gray-600">{d.specialization}</div>
                    <div className="text-sm">⭐ {d.rating ?? "-"} • {d.experience ?? "-"} yrs</div>
                    <div className="text-sm">Success: {d.success_rate ?? "-"}%</div>
                    <div className="text-xs text-gray-500">{d.address ?? ""}</div>
                  </div>
                </InfoWindow>
              ) : null
            )}
          </GoogleMap>
        </LoadScript>
      )}
    </div>
  );
}

