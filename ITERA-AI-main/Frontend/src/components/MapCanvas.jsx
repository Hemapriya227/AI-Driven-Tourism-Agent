import React, { useEffect, useMemo, useRef } from 'react';
import { APIProvider, Map, useMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export default function MapCanvas({ itinerary = [], lastReachedIndex, destinationCenter }) {

  const initialCenter = useMemo(() => {
    if (itinerary.length > 0) {
      const lat = parseFloat(itinerary[0].lat);
      const lng = parseFloat(itinerary[0].lon);
      if (!isNaN(lat) && !isNaN(lng)) return { lat, lng };
    }
    if (destinationCenter) {
      return { lat: destinationCenter.lat, lng: destinationCenter.lon };
    }
    return { lat: 41.3851, lng: 2.1734 };
  }, []);

  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-bg-beige">
      <APIProvider apiKey={API_KEY}>
        <Map
          defaultCenter={initialCenter}
          defaultZoom={13}
          mapId="itera_map"
          disableDefaultUI={true}
          gestureHandling={'greedy'}
        >
          {/* RED ADVANCED MARKERS */}
          {itinerary.map((poi, idx) => {
            const lat = parseFloat(poi.lat);
            const lng = parseFloat(poi.lon);
            if (isNaN(lat) || isNaN(lng)) return null;

            const isReached = idx <= lastReachedIndex;

            return (
              <AdvancedMarker
                key={`${poi.id}-${idx}`}
                position={{ lat, lng }}
                zIndex={1000}
                title={poi.title}
              >
                <Pin
                  background={isReached ? '#94a3b8' : '#ef4444'}
                  borderColor={isReached ? '#64748b' : '#b91c1c'}
                  glyphColor={'#ffffff'}
                  glyph={(idx + 1).toString()}
                />
              </AdvancedMarker>
            );
          })}

          {/* ROAD-AWARE DIRECTIONS POLYLINE */}
          {itinerary.length > 1 && <JourneyPath itinerary={itinerary} />}
        </Map>
      </APIProvider>
    </div>
  );
}

function JourneyPath({ itinerary }) {
  const map = useMap();
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    const validItinerary = itinerary.filter(p => {
      const lat = parseFloat(p.lat);
      const lng = parseFloat(p.lon);
      return !isNaN(lat) && !isNaN(lng);
    });

    if (validItinerary.length < 2) return;

    // Clean up previous renderer
    if (rendererRef.current) {
      rendererRef.current.setMap(null);
      rendererRef.current = null;
    }

    const directionsService = new window.google.maps.DirectionsService();
    const renderer = new window.google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,       // We handle markers ourselves
      preserveViewport: false,     // Let directions fit the map
      polylineOptions: {
        strokeColor: "#ef4444",    // Red road-aware line
        strokeWeight: 5,
        strokeOpacity: 0.8
      }
    });

    rendererRef.current = renderer;

    const origin = {
      lat: parseFloat(validItinerary[0].lat),
      lng: parseFloat(validItinerary[0].lon)
    };
    const destination = {
      lat: parseFloat(validItinerary[validItinerary.length - 1].lat),
      lng: parseFloat(validItinerary[validItinerary.length - 1].lon)
    };

    // Google Directions API supports max 25 waypoints
    const waypoints = validItinerary.slice(1, -1).slice(0, 23).map(poi => ({
      location: { lat: parseFloat(poi.lat), lng: parseFloat(poi.lon) },
      stopover: true
    }));

    directionsService.route(
      {
        origin,
        destination,
        waypoints,
        travelMode: window.google.maps.TravelMode.WALKING,
        optimizeWaypoints: false
      },
      (result, status) => {
        if (status === 'OK') {
          renderer.setDirections(result);
          map.fitBounds(result.routes[0].bounds, {
            top: 100, bottom: 100, left: 450, right: 100
          });
        } else {
          // Fallback: simple straight polyline if Directions API fails
          console.warn(`Directions API failed (${status}), falling back to polyline`);
          renderer.setMap(null);

          const coords = validItinerary.map(p => ({
            lat: parseFloat(p.lat),
            lng: parseFloat(p.lon)
          }));

          const fallback = new window.google.maps.Polyline({
            path: coords,
            geodesic: true,
            strokeColor: "#ef4444",
            strokeOpacity: 0.8,
            strokeWeight: 5,
          });
          fallback.setMap(map);

          const bounds = new window.google.maps.LatLngBounds();
          coords.forEach(c => bounds.extend(c));
          map.fitBounds(bounds, { top: 100, bottom: 100, left: 450, right: 100 });

          // Store fallback for cleanup
          rendererRef.current = { setMap: (m) => fallback.setMap(m) };
        }
      }
    );

    return () => {
      if (rendererRef.current) rendererRef.current.setMap(null);
    };
  }, [map, itinerary]);

  return null;
}