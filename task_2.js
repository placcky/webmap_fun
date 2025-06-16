const map = L.map('map').setView([47.504972467085906, 19.06335750900263], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // 5 simple poligon (parks and squares in Budapest)
    const polygons = [
    [ // Margitsziget
        [47.5154000223606, 19.043498227068714],
        [47.52730702539873, 19.044826274872925],
        [47.53558408782779, 19.053018310312456],
        [47.525875925144675, 19.05075585271301]
    ],
    [ // Városliget
        [47.521611758229994, 19.083270679072946],
        [47.51308219432892, 19.093669285654727],
        [47.50764903169089, 19.08605803333131],
        [47.518062486695094, 19.07321635395545]
    ],
    [ // Népliget
        [47.48518495815783, 19.107336299273427],
        [47.475746820378795, 19.099535841226132],
        [47.473628630118085, 19.10692671033138],
        [47.48193879908021, 19.114421444577232]
    ],
    [ // Városmajor
        [47.50903261506668, 19.01548206701053],
        [47.50776532554891, 19.01468014708665],
        [47.505598420230925, 19.0206519707258],
        [47.507891104598244, 19.021053066823054]
    ],
    [ // Kossuth tér
        [47.50841225321661, 19.045463513846126],
        [47.508479971150344, 19.04782659327951],
        [47.5059453747032, 19.04766900371635],
        [47.50634200248298, 19.044933678601335]
    ]
    ];


// Leaflet own method to get the centre points of the poligons
const polygonLayers = polygons.map(coords =>
  L.polygon(coords, {
    color: 'black',       
    fillColor: 'aqua',
    fillOpacity: 0.5        
  }).addTo(map)
);


const centroids = polygonLayers.map(polygon => {
  const center = polygon.getBounds().getCenter();  
  return [center.lat, center.lng];
});

  // Calculating distance (Haversine formula)
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

  // Click event 
  map.on('click', function(e) {
    const clickedLat = e.latlng.lat;
    const clickedLng = e.latlng.lng;

    // Deleting the previously active selected highlight
    for (let i = 0; i < centroids.length; i++) {
      document.getElementById(`poly-${i}`).classList.remove('highlight');
    }

    // Calculating dstances and min
    let minDist = Infinity;
    let closestIndex = -1;
    centroids.forEach((centroid, i) => {
      const dist = getDistance(clickedLat, clickedLng, centroid[0], centroid[1]);
      if (dist < minDist) {
        minDist = dist;
        closestIndex = i;
      }
    });

    // Highlighting poligons
    document.getElementById(`poly-${closestIndex}`).classList.add('highlight');
  });