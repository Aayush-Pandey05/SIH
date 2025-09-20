import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import axios from "axios";
import Modal from "./Modal";
import { useFormStore } from "../store/useFormStore";
import { Loader2 } from "lucide-react";

const DrawingComponent = ({ onPolygonComplete, onPolygonDelete }) => {
  const map = useMap();
  const drawnItems = useRef(new L.FeatureGroup());

  const calculateArea = (latLngs) => {
    let area = 0;
    const R = 6371000; 
    if (latLngs.length < 3) return 0;

    for (let i = 0; i < latLngs.length; i++) {
      const p1 = latLngs[i];
      const p2 = latLngs[(i + 1) % latLngs.length];
      area +=
        (((p2.lng - p1.lng) * Math.PI) / 180) *
        (2 +
          Math.sin((p1.lat * Math.PI) / 180) +
          Math.sin((p2.lat * Math.PI) / 180));
    }
    return Math.abs(area * ((R * R) / 2));
  };

  useEffect(() => {
    map.addLayer(drawnItems.current);

    const drawControl = new L.Control.Draw({
      edit: { featureGroup: drawnItems.current },
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
    });
    map.addControl(drawControl);

    map.on("draw:created", (e) => {
      const layer = e.layer;
      drawnItems.current.addLayer(layer);

      const polygonCoords = layer
        .toGeoJSON()
        .geometry.coordinates[0].map((coord) => ({
          lat: coord[1],
          lng: coord[0],
        }));

      onPolygonComplete(polygonCoords, calculateArea(polygonCoords));
    });

    map.on("draw:deleted", () => {
      drawnItems.current.clearLayers();
      onPolygonDelete();
    });

    return () => {
      map.removeControl(drawControl);
      map.removeLayer(drawnItems.current);
    };
  }, [map, onPolygonComplete, onPolygonDelete]);

  return null;
};

const RoofMapper = () => {
  const [polygon, setPolygon] = useState(null);
  const [area, setArea] = useState(0);
  const [center, setCenter] = useState([20.5937, 78.9629]);
  const [latLng, setLatLng] = useState(null);
  const [districtName, setDistrictName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapRef = useRef();

  const { isSubmittingUserData, submitUserDataForm } = useFormStore();

  useEffect(() => {

    const originalStyle = document.body.style.background;

   
    document.body.style.background =
      "linear-gradient(to bottom right, #0f172a, #2563eb, #06b6d4)";

    
    return () => {
      // Restore the original background
      document.body.style.background = originalStyle;
    };
  }, []); 

  const MapController = () => {
    const map = useMap();
    mapRef.current = map;
    return null;
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: query, format: "json", limit: 5 },
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      fetchSuggestions(query);
    }, 500);
    setTypingTimeout(timeout);
  };

  const handleSuggestionClick = (suggestion) => {
    const { lat, lon } = suggestion;
    setCenter([parseFloat(lat), parseFloat(lon)]);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    if (mapRef.current) {
      mapRef.current.setView([parseFloat(lat), parseFloat(lon)], 15);
    }
  };

  const onPolygonComplete = async (coords, calculatedArea) => {
    setPolygon(coords);
    setArea(calculatedArea);

    const latSum = coords.reduce((sum, c) => sum + c.lat, 0) / coords.length;
    const lngSum = coords.reduce((sum, c) => sum + c.lng, 0) / coords.length;
    const centroid = { lat: latSum, lng: lngSum };
    setLatLng(centroid);

    try {
      const { data } = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: { format: "json", lat: centroid.lat, lon: centroid.lng },
        }
      );
      setDistrictName(data.address?.county || "Unknown");
    } catch {
      setDistrictName("Unknown");
    }
  };

  const onPolygonDelete = () => {
    setPolygon(null);
    setArea(0);
    setLatLng(null);
    setDistrictName("");
  };

  const handleSubmit = async () => {
    if (!area || !latLng || !districtName) {
      alert("Please draw a polygon first.");
      return;
    }
    try {
      await submitUserDataForm(latLng.lat, latLng.lng, area, districtName);
      window.location.reload();
    } catch (error) {
      console.error("API error:", error);
    }
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-[600px] w-full shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-indigo-700">
      {/* Sidebar */}
      <div className="relative z-10 w-full lg:w-72 p-6 border-b lg:border-b-0 lg:border-r border-white/20 bg-white/20 backdrop-blur-lg text-white flex flex-col justify-between h-auto lg:h-full rounded-b-2xl lg:rounded-bl-2xl lg:rounded-br-none">
        <div className="flex flex-row lg:flex-col justify-around lg:justify-start gap-6 lg:gap-4">
          <div>
            <p className="text-xs lg:text-sm text-cyan-100">Roof Area</p>
            <p className="font-semibold text-sm lg:text-base">
              {area.toFixed(2)} sq.m
            </p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-cyan-100">
              Latitude, Longitude
            </p>
            <p className="font-semibold text-sm lg:text-base">
              {latLng?.lat?.toFixed(4) ?? "N/A"},{" "}
              {latLng?.lng?.toFixed(4) ?? "N/A"}
            </p>
          </div>
          <div>
            <p className="text-xs lg:text-sm text-cyan-100">District</p>
            <p className="font-semibold text-sm lg:text-lg">
              {districtName || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 text-white text-sm lg:text-base rounded-lg shadow-md transition-all flex items-center justify-center gap-2 ${
              isSubmittingUserData
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#00a63e] hover:bg-[#008c34] hover:shadow-lg hover:scale-105"
            }`}
            disabled={isSubmittingUserData}
          >
            {isSubmittingUserData ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              "Send"
            )}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-700 to-cyan-600 text-white text-sm lg:text-base rounded-lg shadow-md hover:from-cyan-800 hover:to-cyan-700 hover:shadow-lg hover:scale-105 transition-all"
            disabled={isSubmittingUserData}
          >
            Enter Data Manually
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="relative z-10 flex-1 min-h-[300px] rounded-tr-2xl rounded-br-2xl overflow-hidden">
        <div className="absolute top-4 left-16 right-12 z-50">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search location..."
            className="w-full p-2 text-sm lg:text-base rounded-lg border border-white/40 bg-white/80 text-gray-900 placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400"
          />
          {suggestions.length > 0 && (
            <ul className="bg-white/90 border border-cyan-300 text-gray-800 rounded-lg max-h-40 lg:max-h-52 overflow-y-auto mt-1 shadow-lg backdrop-blur-sm">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 text-sm lg:text-base cursor-pointer border-b border-gray-200 hover:bg-cyan-100 hover:text-teal-800"
                >
                  <span className="block truncate">
                    {suggestion.display_name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <MapContainer
          center={center}
          zoom={10}
          className="h-full w-full"
          style={{ zIndex: 1 }}
        >
          <MapController />
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DrawingComponent
            onPolygonComplete={onPolygonComplete}
            onPolygonDelete={onPolygonDelete}
          />
        </MapContainer>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default RoofMapper;
