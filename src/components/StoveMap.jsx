import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function StoveMap() {
  return (
    <div>
      <h2>Stove Locations</h2>

      <MapContainer
        center={[-13.5, 27.8]}
        zoom={5.5}
        style={{
          height: "350px",
          width: "100%",
          borderRadius: "10px"
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[-15.4167, 28.2833]}>
          <Popup>
            STV001 - Lusaka
          </Popup>
        </Marker>

        <Marker position={[-12.9683, 28.6366]}>
          <Popup>
            STV002 - Ndola
          </Popup>
        </Marker>

        <Marker position={[-12.8167, 28.2000]}>
          <Popup>
            STV003 - Kitwe
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default StoveMap;