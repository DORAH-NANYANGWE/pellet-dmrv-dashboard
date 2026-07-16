import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";

import { useEffect } from "react";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

function FitBounds({ stoves }) {
    const map = useMap();

    useEffect(() => {
        if (stoves.length === 0) return;

        const bounds = L.latLngBounds(
            stoves.map((stove) => [
                Number(stove.gps_latitude),
                Number(stove.gps_longitude),
            ])
        );

        map.fitBounds(bounds, {
            padding: [50, 50],
        });

    }, [stoves, map]);

    return null;
}

function FleetMap({ stoves }) {
    const navigate = useNavigate();

    // Show any stove that has coordinates,
    // even if GPS Fix is currently lost.
    const validStoves = stoves.filter(
        (stove) =>
            stove.gps_latitude !== null &&
            stove.gps_longitude !== null &&
            !isNaN(Number(stove.gps_latitude)) &&
            !isNaN(Number(stove.gps_longitude))
    );

    if (validStoves.length === 0) {
        return (
            <div
                style={{
                    height: "420px",
                    background: "#273549",
                    borderRadius: "12px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#cbd5e1",
                    marginBottom: "30px",
                }}
            >
                No stove locations available.
            </div>
        );
    }

    return (
        <MapContainer
            center={[
                Number(validStoves[0].gps_latitude),
                Number(validStoves[0].gps_longitude),
            ]}
            zoom={11}
            style={{
                height: "420px",
                width: "100%",
                borderRadius: "12px",
                marginBottom: "30px",
            }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FitBounds stoves={validStoves} />

            {validStoves.map((stove) => (
                <Marker
                    key={stove.device_code}
                    position={[
                        Number(stove.gps_latitude),
                        Number(stove.gps_longitude),
                    ]}
                >
                    <Popup>
                        <strong>{stove.device_code}</strong>

                        <br />
                        Status: {stove.status}

                        <br />
                        GPS: {stove.gps_fix ? "🟢 GPS Fix" : "🟡 Last Known Location"}

                        <br />
                        Temperature: {stove.temperature ?? "--"}°C

                        <br />

                        <button
                            style={{
                                marginTop: "10px",
                                padding: "6px 10px",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                navigate(`/fleet/${stove.device_code}`)
                            }
                        >
                            View Details
                        </button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default FleetMap;