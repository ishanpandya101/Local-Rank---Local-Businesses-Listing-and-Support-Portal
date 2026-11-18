import React, { createContext, useContext, useState, useEffect } from "react";

// Known coordinates for major Surat & Gujarat localities
export const LOCALITIES = {
  "Surat Central": { lat: 21.1702, lng: 72.8311, label: "Surat Central (Ring Road / Station)" },
  "Adajan": { lat: 21.1926, lng: 72.7997, label: "Adajan (Anand Mahal / LP Savani)" },
  "Vesu": { lat: 21.1458, lng: 72.7758, label: "Vesu (VIP Road / University)" },
  "Varachha": { lat: 21.2185, lng: 72.8596, label: "Varachha (Mini Bazaar / Main Rd)" },
  "Piplod": { lat: 21.1568, lng: 72.7825, label: "Piplod (Dumas Road / Kargil Chowk)" },
  "City Light": { lat: 21.1624, lng: 72.7912, label: "City Light (Science Centre)" },
  "Katargam": { lat: 21.2312, lng: 72.8251, label: "Katargam (GIDC / Gajera Circle)" },
  "Pal": { lat: 21.1874, lng: 72.7634, label: "Pal (Hazira Rd / Galaxy Circle)" },
  "Ghod Dod Road": { lat: 21.1782, lng: 72.8123, label: "Ghod Dod Road (Athwa Gate)" }
};

// Haversine formula to compute exact distance in kilometers
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function formatDistance(distanceKm) {
  if (distanceKm === null || distanceKm === undefined) return "";
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
  const [userCoords, setUserCoords] = useState(() => {
    try {
      const saved = localStorage.getItem("localrank_coords");
      return saved ? JSON.parse(saved) : LOCALITIES["Adajan"];
    } catch {
      return LOCALITIES["Adajan"];
    }
  });

  const [selectedLocality, setSelectedLocality] = useState(() => {
    return localStorage.getItem("localrank_locality") || "Adajan";
  });

  const [isDetecting, setIsDetecting] = useState(false);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [maxDistanceRadius, setMaxDistanceRadius] = useState("all"); // 'all', '2', '5', '10'

  useEffect(() => {
    localStorage.setItem("localrank_coords", JSON.stringify(userCoords));
  }, [userCoords]);

  useEffect(() => {
    localStorage.setItem("localrank_locality", selectedLocality);
  }, [selectedLocality]);

  // Real browser GPS detection
  const detectLiveLocation = () => {
    if (!navigator.geolocation) {
      return { success: false, msg: "Geolocation is not supported by your browser." };
    }

    setIsDetecting(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude });
          setSelectedLocality("My Current GPS Location");
          setIsGpsActive(true);
          setIsDetecting(false);
          resolve({ success: true, lat: latitude, lng: longitude });
        },
        (error) => {
          setIsDetecting(false);
          // Graceful fallback to Adajan center
          resolve({
            success: false,
            msg: error.message || "Location access permission denied. Using Adajan, Surat as default."
          });
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  };

  const changeLocality = (localityKey) => {
    if (LOCALITIES[localityKey]) {
      setUserCoords(LOCALITIES[localityKey]);
      setSelectedLocality(localityKey);
      setIsGpsActive(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        userCoords,
        selectedLocality,
        isDetecting,
        isGpsActive,
        maxDistanceRadius,
        setMaxDistanceRadius,
        detectLiveLocation,
        changeLocality,
        calculateDistanceTo: (targetLat, targetLng) =>
          calculateDistanceKm(userCoords.lat, userCoords.lng, targetLat, targetLng)
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
