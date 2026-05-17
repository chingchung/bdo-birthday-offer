"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";
import type { Offer } from "@/types";

// Hash an id into a deterministic number
function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Stable pseudo-random HK coordinates per offer id
export function offerCoords(id: string): [number, number] {
  const h = hash(id);
  const lat = 22.265 + ((h & 0xFFFF) / 0xFFFF) * 0.16;             // 22.265 – 22.425
  const lng = 113.97 + (((h >> 16) & 0xFFFF) / 0xFFFF) * 0.27;     // 113.97 – 114.24
  return [lat, lng];
}

function makeIcon(offer: Offer) {
  const logo = offer.brand?.logo_url;
  const fallback = (offer.brand?.name_tc ?? "?").slice(0, 1);
  const html = logo
    ? `<div class="bdo-marker-inner"><img src="${logo}" alt="" /></div>`
    : `<div class="bdo-marker-inner fallback">${fallback}</div>`;
  return L.divIcon({
    className: "bdo-marker",
    html,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
}

export default function MobileMap({
  offers,
  onSelect,
}: {
  offers: Offer[];
  onSelect: (o: Offer) => void;
}) {
  const markers = useMemo(
    () =>
      offers.map((o) => ({
        offer: o,
        coords: offerCoords(o.id),
        icon: makeIcon(o),
      })),
    [offers]
  );

  return (
    <MapContainer
      center={[22.345, 114.12]}
      zoom={11}
      zoomControl={false}
      attributionControl={false}
      className="absolute inset-0 z-0"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        subdomains={["a", "b", "c", "d"]}
      />
      {markers.map(({ offer, coords, icon }) => (
        <Marker
          key={offer.id}
          position={coords}
          icon={icon}
          eventHandlers={{ click: () => onSelect(offer) }}
        />
      ))}
    </MapContainer>
  );
}
