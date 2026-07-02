import { useEffect, useState } from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import { getMapData } from "../services/mapService";

function StoveMap() {

    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadMap() {

        try {

            const data = await getMapData();

            setMarkers(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadMap();

        const interval = setInterval(() => {

            loadMap();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    if (loading) {

        return (
            <p style={{ color: "white" }}>
                Loading map...
            </p>
        );

    }

    return (

        <div>

            <h2>Stove Locations</h2>

            <MapContainer
                center={[-13.5, 27.8]}
                zoom={5.5}
                style={{
                    height: "500px",
                    width: "100%",
                    borderRadius: "10px"
                }}
            >

                <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {markers.map((marker) => (

                    <Marker
                        key={marker.device}
                        position={[
                            marker.latitude,
                            marker.longitude
                        ]}
                    >

                        <Popup>

                            <strong>{marker.stove}</strong>

                            <br />

                            Device: {marker.device}

                            <br />

                            Status: {marker.status}

                        </Popup>

                    </Marker>

                ))}

            </MapContainer>

        </div>

    );

}

export default StoveMap;