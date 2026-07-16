import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function GPSMap({
    latitude,
    longitude,
    stoveCode,
    status,
    temperature,
}) {
    const hasGPS =
        latitude !== null &&
        longitude !== null &&
        latitude !== "" &&
        longitude !== "" &&
        !isNaN(Number(latitude)) &&
        !isNaN(Number(longitude));

    if (!hasGPS) {
        return (
            <div
                style={{
                    height: "300px",
                    background: "#273549",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#cbd5e1",
                }}
            >
                <div style={{ fontSize: "48px" }}>📡</div>

                <h3>No GPS Fix</h3>

                <p style={{ color: "#94a3b8" }}>
                    This stove has not yet reported a valid location.
                </p>
            </div>
        );
    }

    return (
        <MapContainer
            center={[Number(latitude), Number(longitude)]}
            zoom={15}
            scrollWheelZoom={true}
            style={{
                height: "400px",
                width: "100%",
                borderRadius: "12px",
            }}
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker
                position={[
                    Number(latitude),
                    Number(longitude),
                ]}
            >
                <Popup>
                    <strong>{stoveCode}</strong>

                    <br />

                    Status: {status}

                    <br />

                    Temperature: {temperature ?? "--"} °C
                </Popup>
            </Marker>
        </MapContainer>
    );
}

export default GPSMap;