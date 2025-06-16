// Positioning the webmap (centre point: Budapest, Chain-bridge)
const map = L.map('map').setView([47.49919125628265, 19.043832195184752], 13);

// Basemap layer
var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ext: 'png'
});

Stadia_AlidadeSmooth.addTo(map);

// Adding markers to the map
var myIcon = L.icon({
  iconUrl: './assets/icon_coffee.png',
  shadowUrl: './assets/icon_shadow.png',
  iconSize: [38, 38],
  shadowSize: [38, 38],
  popupAnchor: [5, -10]
});

const markerData = [
  { coords: [47.49074329713184, 19.061497065470146], title: "Flour Style Wok Bar" },
  { coords: [47.48934312859177, 19.063568863222336], title: "Ha Mo Asian Bistro" },
  { coords: [47.496712638148416, 19.06360274711736], title: "Bors GasztroBar" },
  { coords: [47.488325031124766, 19.062557726363142], title: "fini’z" },
  { coords: [47.47706628083873, 19.046633702051007], title: "Prosit Buda Bistro" },
  { coords: [47.5056206862066, 19.037223450089336], title: "Franziska - Buda" },
  { coords: [47.510160917243816, 19.030081717835902], title: "IGEN" },
  { coords: [47.515882413684, 19.049669399085655], title: "Briós" },
  { coords: [47.506856528653564, 19.05984726242395], title: "Noise Café" },
  { coords: [47.509582778342654, 19.03354041703177], title: "Csúcsök sourdough bread bakery" }
];

const markerObjects = markerData.map(item => 
  L.marker(item.coords, { icon: myIcon })
    .addTo(map)
    .bindPopup(`<strong>${item.title}</strong><br>One of the most visited places of me!`)
);

// Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Click handler
map.on('click', function(e) {
  const clickedLat = e.latlng.lat;
  const clickedLng = e.latlng.lng;

  let count = 0;
  markerObjects.forEach(marker => {
    const markerLat = marker.getLatLng().lat;
    const markerLng = marker.getLatLng().lng;
    const dist = getDistance(clickedLat, clickedLng, markerLat, markerLng);
    if (dist <= 1.0) {
      count++;
    }
  });

  alert(`You clicked at:\nLatitude: ${clickedLat.toFixed(5)}, Longitude: ${clickedLng.toFixed(5)}\nThere are ${count} places within 1 km of the selected point.`);
});
