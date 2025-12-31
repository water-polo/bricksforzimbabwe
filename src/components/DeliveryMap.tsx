'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons (Next.js issue)
// We'll use DivIcons with emojis/SVGs to avoid asset loading issues
const warehouseIcon = L.divIcon({
    html: '<div style="font-size: 24px; line-height: 1;">🏭</div>',
    className: 'custom-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const userIcon = L.divIcon({
    html: '<div style="font-size: 24px; line-height: 1;">📍</div>',
    className: 'custom-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30] // Bottom center
});

interface Props {
    start: { lat: number; lng: number };
    end?: { lat: number; lng: number } | null;
}

function MapUpdater({ start, end }: Props) {
    const map = useMap();
    useEffect(() => {
        if (start && end) {
            const bounds = L.latLngBounds([
                [start.lat, start.lng],
                [end.lat, end.lng]
            ]);
            map.fitBounds(bounds, { padding: [50, 50] });
        } else if (start) {
            map.setView([start.lat, start.lng], 15);
        }
    }, [start, end, map]);
    return null;
}

export default function DeliveryMap({ start, end }: Props) {
    // Ensure we have valid numbers
    if (!start || isNaN(start.lat)) return null;

    return (
        <div style={{ height: '100%', width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}>
            {/* Note: In production you might want to use a specific height in CSS or style prop */}
            <MapContainer
                center={[start.lat, start.lng]}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[start.lat, start.lng]} icon={warehouseIcon} title="Our Location">
                    <Popup>Bricks for Zimbabwe<br />Koala Park Premises, Seke Road</Popup>
                </Marker>

                {end && (
                    <>
                        <Marker position={[end.lat, end.lng]} icon={userIcon} title="Delivery Location">
                        </Marker>
                        <Polyline
                            positions={[
                                [start.lat, start.lng],
                                [end.lat, end.lng]
                            ]}
                            color="#0ea5e9"
                            dashArray="10, 10"
                            weight={3}
                            opacity={0.7}
                        />
                    </>
                )}
                <MapUpdater start={start} end={end} />
            </MapContainer>
        </div>
    );
}
