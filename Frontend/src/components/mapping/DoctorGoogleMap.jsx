"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";

// Map container style - responsive with rounded corners
const containerStyle = {
  width: "100%",
  height: "520px",
  borderRadius: "12px",
  overflow: "hidden",
};

// Default center (NYC) in case geolocation is denied
const defaultCenter = { lat: 40.7128, lng: -74.006 };

// Supported specialty filters
const SPECIALTY_KEYWORDS = {
  Oncologist: "oncologist",
  Radiologist: "radiologist",
  "Cancer Hospital": "cancer hospital",
};

export default function DoctorGoogleMap() {
  const [center, setCenter] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [places, setPlaces] = useState([]);
  const [specialty, setSpecialty] = useState("Oncologist");

  const mapRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Load Google Maps JS API with Places library
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  // Get user's current position on mount
  useEffect(() => {
    if (!isLoaded) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setCenter(defaultCenter);
      },
      { enableHighAccuracy: true }
    );
  }, [isLoaded]);

  // Fetch nearby doctors using Google Places Nearby Search
  const fetchNearby = React.useCallback(
    (origin) => {
      if (!origin || !mapRef.current || !window.google) return;
      const service = new window.google.maps.places.PlacesService(
        mapRef.current
      );
      const request = {
        location: new window.google.maps.LatLng(origin.lat, origin.lng),
        radius: 8000, // 8km radius
        type: ["doctor"],
        keyword: SPECIALTY_KEYWORDS[specialty] || "oncologist",
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setPlaces(results || []);
        } else {
          setPlaces([]);
        }
      });
    },
    [specialty]
  );

  // Refetch when center or specialty changes
  useEffect(() => {
    if (isLoaded && center) {
      fetchNearby(center);
    }
  }, [isLoaded, center, specialty, fetchNearby]);

  // Marker icon for user's location (blue dot-like marker)
  const userIcon = useMemo(() => {
    if (!window.google) return undefined;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "#4285F4",
      fillOpacity: 1,
      strokeColor: "white",
      strokeWeight: 2,
    };
  }, [isLoaded]);

  // Build custom marker icon using place photo if available
  const getPlaceIcon = (place) => {
    if (!window.google) return undefined;
    const photoUrl = place?.photos?.[0]?.getUrl({ maxWidth: 80, maxHeight: 80 });
    if (!photoUrl) return undefined; // fallback to default pin
    return {
      url: photoUrl,
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20),
    };
  };

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current?.getPlace?.();
    if (!place || !place.geometry || !place.geometry.location) return;
    const loc = place.geometry.location;
    const nextCenter = { lat: loc.lat(), lng: loc.lng() };
    setCenter(nextCenter);
    setSelectedPlace(null);
    fetchNearby(nextCenter);
  };

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        Failed to load Google Maps. Check your API key and billing.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[520px] rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">Loading map…</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="flex-1">
          <Autocomplete
            onLoad={(ac) => (autocompleteRef.current = ac)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Search area or hospital…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </Autocomplete>
        </div>
        <div>
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            {Object.keys(SPECIALTY_KEYWORDS).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      <GoogleMap
        onLoad={onMapLoad}
        mapContainerStyle={containerStyle}
        center={center || defaultCenter}
        zoom={center ? 13 : 11}
        options={{
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {center && (
          <Marker
            position={center}
            title="You are here"
            icon={userIcon}
            zIndex={9999}
          />
        )}

        {places.map((p) => (
          <Marker
            key={p.place_id}
            position={{
              lat: p.geometry.location.lat(),
              lng: p.geometry.location.lng(),
            }}
            title={p.name}
            icon={getPlaceIcon(p)}
            onClick={() => setSelectedPlace(p)}
          />
        ))}

        {selectedPlace && (
          <InfoWindow
            position={{
              lat: selectedPlace.geometry.location.lat(),
              lng: selectedPlace.geometry.location.lng(),
            }}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div className="min-w-[220px]">
              <div className="font-semibold">{selectedPlace.name}</div>
              <div className="text-sm text-gray-600">
                {selectedPlace.vicinity || selectedPlace.formatted_address}
              </div>
              {selectedPlace.photos?.[0] && (
                <img
                  src={selectedPlace.photos[0].getUrl({ maxWidth: 240, maxHeight: 140 })}
                  alt={selectedPlace.name}
                  className="mt-2 rounded"
                />
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}


