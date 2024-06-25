import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import L from "leaflet";
import classes from "./Map.module.css";
import PopupContent from "./PopupContent";
import { useCoordinates } from "../context/coordinates";

const myAPIKey = "4b378c2986934cf79016b165ae2739cb";

const greenDotIcon = L.divIcon({
  className: classes.customIcon,
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="7" fill="lightgreen" stroke="black" stroke-width="2"/>
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const blackPinIcon = L.divIcon({
  className: classes.customIcon,
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <path d="M16 0C10.48 0 6 4.48 6 10c0 7.75 8.69 18.01 9.06 18.44.46.56 1.38.56 1.84 0C17.31 28.01 26 17.75 26 10c0-5.52-4.48-10-10-10z" fill="black"/>
      <circle cx="16" cy="10" r="5" fill="black"/> <!-- To fill the pin head completely -->
      <text x="16.5" y="16" text-anchor="middle" font-family="Arial" font-size="15" fill="white" font-weight="bold">D</text>
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});


const blackCircleIcon = L.divIcon({
  className: classes.customIcon,
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="10" fill="black"/>
      <circle cx="16" cy="16" r="4" fill="white"/>
    </svg>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const MapComponent = () => {
  const [route, setRoute] = useState(null);
  const {
    originCoordinates,
    destinationCoordinates,
    stopCoordinates,
    setDistance,
    setIsLoading,
    setIsFetching,
    isLoading,
    showPath,
    setShowPath,
  } = useCoordinates();

  useEffect(() => {
    if (
      showPath &&
      originCoordinates.length === 2 &&
      destinationCoordinates.length === 2
    ) {
      const waypoints = [
        `${originCoordinates[1]},${originCoordinates[0]}`,
        ...(stopCoordinates &&
        stopCoordinates.length === 2 &&
        stopCoordinates[0] !== 0
          ? [`${stopCoordinates[1]},${stopCoordinates[0]}`]
          : []),
        `${destinationCoordinates[1]},${destinationCoordinates[0]}`,
      ].join("|");

      const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints}&mode=drive&apiKey=${myAPIKey}`;

      const fetchRoute = async () => {
        try {
          const response = await axios.get(url);
          if (
            !response.data ||
            !response.data.features ||
            response.data.features.length === 0
          ) {
            throw new Error("No route found");
          }
          const routeData = response.data.features[0];
          setIsLoading(false);
          setIsFetching(false);
          const distanceInKilometers = routeData.properties.distance / 1000;
          setDistance(distanceInKilometers);
          setRoute(routeData);
        } catch (error) {
          console.error("Error fetching route:", error);
          setRoute(null);
        }
      };

      fetchRoute().then(() => {
        setShowPath(false);
      });
    }
  }, [
    originCoordinates,
    destinationCoordinates,
    stopCoordinates,
    showPath,
    setDistance,
    setShowPath,
    setIsLoading,
    setIsFetching,
  ]);

  const calculateBounds = () => {
    const bounds = new L.LatLngBounds();

    if (route && route.geometry && route.geometry.coordinates) {
      const coordinates = route.geometry.coordinates;

      if (route.geometry.type === "MultiLineString") {
        coordinates.forEach((lineString) => {
          lineString.forEach((coord) => {
            bounds.extend([coord[1], coord[0]]);
          });
        });
      } else {
        coordinates.forEach((coord) => {
          bounds.extend([coord[1], coord[0]]);
        });
      }
    }

    if (originCoordinates.length === 2) {
      bounds.extend([originCoordinates[1], originCoordinates[0]]);
    }
    if (destinationCoordinates.length === 2) {
      bounds.extend([destinationCoordinates[1], destinationCoordinates[0]]);
    }

    if (stopCoordinates.length === 2) {
      bounds.extend([stopCoordinates[1], stopCoordinates[0]]);
    }
    return bounds.isValid() ? bounds : null;
  };

  const UpdateMapBounds = () => {
    const map = useMap();

    useEffect(() => {
      const bounds = calculateBounds();
      if (bounds) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }, [
      route,
      originCoordinates,
      destinationCoordinates,
      stopCoordinates,
      map,
    ]);

    return null;
  };

  return (
    <MapContainer center={[27, 85]} zoom={6} className={classes.map_container}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {route && !isLoading && (
        <>
          <GeoJSON
            key={JSON.stringify(route.geometry.coordinates)}
            data={route}
            style={() => ({
              color: "rgba(20, 137, 255, 0.7)",
              weight: 5,
            })}
            onEachFeature={(feature, layer) => {
              const timeInHours = (feature.properties.time / 3600).toFixed(2);
              const distanceInKm = (
                feature.properties.distance / 1000
              ).toLocaleString();
              layer.bindPopup(
                ReactDOMServer.renderToString(
                  <PopupContent
                    timeInHours={timeInHours}
                    distanceInKm={distanceInKm}
                  />
                )
              );
            }}
          />
          <UpdateMapBounds />
        </>
      )}
      {originCoordinates.length === 2 && originCoordinates[0] !== 0 && (
        <Marker
          position={[originCoordinates[1], originCoordinates[0]]}
          icon={greenDotIcon}
        >
          <Popup>Origin: {originCoordinates.join(", ")}</Popup>
          <UpdateMapBounds />
        </Marker>
      )}
      {destinationCoordinates.length === 2 &&
        destinationCoordinates[0] !== 0 && (
          <Marker
            position={[destinationCoordinates[1], destinationCoordinates[0]]}
            icon={blackPinIcon}
          >
            <Popup>Destination: {destinationCoordinates.join(", ")}</Popup>
            <UpdateMapBounds />
          </Marker>
        )}
      {stopCoordinates.length === 2 && stopCoordinates[0] !== 0 && (
        <Marker
          position={[stopCoordinates[1], stopCoordinates[0]]}
          icon={blackCircleIcon}
        >
          <Popup>Destination: {stopCoordinates.join(", ")}</Popup>
          <UpdateMapBounds />
        </Marker>
      )}
      {(route ||
        (originCoordinates.length === 2 && originCoordinates[0] !== 0) ||
        (destinationCoordinates.length === 2 &&
          destinationCoordinates[0] !== 0) ||
        stopCoordinates.length === 0) && <UpdateMapBounds />}
    </MapContainer>
  );
};

export default MapComponent;
