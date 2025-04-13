"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const CancerTreatmentMap = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
  }, []);

  const onLoad = (mapInstance: any) => {
    setMap(mapInstance);
  };

  const onUnmount = () => {
    setMap(null);
  };

  const renderMap = () => {
    if (!location) return null;

    return (
      <LoadScript googleMapsApiKey="AIzaSyAOVYRIgupAurZup5y1PRh8I" libraries={["places"]}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "500px" }}
          center={{ lat: location.lat, lng: location.lng }}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker position={{ lat: location.lat, lng: location.lng }} />
        </GoogleMap>
      </LoadScript>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Cancer Treatment Centers Near You</h1>
      <Card>
        <CardContent>
          {location ? renderMap() : <p>Fetching your location...</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default CancerTreatmentMap;
