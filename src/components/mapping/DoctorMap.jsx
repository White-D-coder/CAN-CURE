"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const DoctorMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock doctor data with locations
  const mockDoctors = [
    {
      id: 1,
      name: 'Dr. Emily Richards',
      specialization: 'Oncology',
      rating: 4.9,
      distance: 2.3,
      location: [40.7128, -74.0060], // NYC coordinates
      available: true,
      nextAvailable: '2024-01-25 10:00 AM',
      experience: 15,
      successRate: 96,
    },
    {
      id: 2,
      name: 'Dr. Robert Chen',
      specialization: 'Surgical Oncology',
      rating: 4.8,
      distance: 3.7,
      location: [40.7589, -73.9851],
      available: false,
      nextAvailable: '2024-01-26 2:00 PM',
      experience: 12,
      successRate: 94,
    },
    {
      id: 3,
      name: 'Dr. Lisa Montgomery',
      specialization: 'Radiation Oncology',
      rating: 4.9,
      distance: 1.8,
      location: [40.7505, -73.9934],
      available: true,
      nextAvailable: '2024-01-25 3:30 PM',
      experience: 18,
      successRate: 97,
    },
    {
      id: 4,
      name: 'Dr. Michael Johnson',
      specialization: 'Medical Oncology',
      rating: 4.7,
      distance: 4.2,
      location: [40.6892, -74.0445],
      available: true,
      nextAvailable: '2024-01-25 11:15 AM',
      experience: 10,
      successRate: 92,
    },
  ];

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setDoctors(mockDoctors);
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Default to NYC if location access fails
          setUserLocation([40.7128, -74.0060]);
          setDoctors(mockDoctors);
          setLoading(false);
        }
      );
    } else {
      // Default to NYC if geolocation is not supported
      setUserLocation([40.7128, -74.0060]);
      setDoctors(mockDoctors);
      setLoading(false);
    }
  }, []);

  const MapEvents = () => {
    useMapEvents({
      click: (e) => {
        console.log('Map clicked at:', e.latlng);
        // Could implement click-to-add-location functionality
      },
    });
    return null;
  };

  const getMarkerColor = (doctor) => {
    if (!doctor.available) return '#ef4444'; // Red for unavailable
    if (doctor.distance < 2) return '#10b981'; // Green for close
    if (doctor.distance < 4) return '#f59e0b'; // Yellow for medium distance
    return '#6b7280'; // Gray for far
  };

  const customIcon = (doctor) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${getMarkerColor(doctor)};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
      ">${doctor.available ? '✓' : '✗'}</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleBookAppointment = (doctor) => {
    alert(`Booking appointment with ${doctor.name}. This would redirect to appointment booking system.`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors near you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading map: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Find Doctors Near You</h2>
        <p className="text-gray-600">
          {doctors.filter(d => d.available).length} doctors available now
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="h-96 rounded-lg overflow-hidden shadow-lg">
            {userLocation && (
            <MapContainer
              key={`${userLocation[0]}-${userLocation[1]}`}
              center={userLocation}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapEvents />
              
              {/* User location marker */}
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>
                    <div className="text-center">
                      <strong>Your Location</strong>
                    </div>
                  </Popup>
                </Marker>
              )}
              
              {/* Doctor markers */}
              {doctors.map((doctor) => (
                <Marker
                  key={doctor.id}
                  position={doctor.location}
                  icon={customIcon(doctor)}
                  eventHandlers={{
                    click: () => setSelectedDoctor(doctor),
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-bold text-lg">{doctor.name}</h3>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">⭐ {doctor.rating} rating</p>
                        <p className="text-sm">📍 {doctor.distance.toFixed(1)} km away</p>
                        <p className="text-sm">
                          {doctor.available ? '✅ Available now' : '❌ Next: ' + doctor.nextAvailable}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookAppointment(doctor)}
                        className="mt-3 w-full bg-blue-600 text-white py-1 px-3 rounded text-sm hover:bg-blue-700"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
            )}
          </div>
        </div>

        {/* Doctor List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Nearby Doctors</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {doctors
              .sort((a, b) => a.distance - b.distance)
              .map((doctor) => (
                <div
                  key={doctor.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{doctor.name}</h4>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm">
                          <span className="text-yellow-500 mr-1">⭐</span>
                          <span>{doctor.rating}</span>
                          <span className="mx-2">•</span>
                          <span>{doctor.experience} years exp.</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-1">📍</span>
                          <span>{doctor.distance.toFixed(1)} km away</span>
                          <span className="mx-2">•</span>
                          <span>{doctor.successRate}% success rate</span>
                        </div>
                        <div className={`text-sm font-medium ${
                          doctor.available ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {doctor.available ? '✅ Available now' : `❌ Next: ${doctor.nextAvailable}`}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookAppointment(doctor);
                    }}
                    className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Selected Doctor Details */}
      {selectedDoctor && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Doctor Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg">{selectedDoctor.name}</h4>
              <p className="text-gray-600">{selectedDoctor.specialization}</p>
              <div className="mt-4 space-y-2">
                <p><span className="font-medium">Experience:</span> {selectedDoctor.experience} years</p>
                <p><span className="font-medium">Success Rate:</span> {selectedDoctor.successRate}%</p>
                <p><span className="font-medium">Rating:</span> ⭐ {selectedDoctor.rating}</p>
                <p><span className="font-medium">Distance:</span> {selectedDoctor.distance.toFixed(1)} km</p>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Availability</h5>
              <p className={selectedDoctor.available ? 'text-green-600' : 'text-red-600'}>
                {selectedDoctor.available ? 'Available now' : `Next available: ${selectedDoctor.nextAvailable}`}
              </p>
              <button
                onClick={() => handleBookAppointment(selectedDoctor)}
                className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorMap;
