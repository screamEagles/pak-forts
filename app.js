const pakMap = L.map('map').setView([30.3753, 69.3451], 5);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contibutors, Coded by Umair Shakeel (a.k.a screamEagles)';

const tiles = L.tileLayer(tileUrl, {attribution});
tiles.addTo(pakMap);

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googleSat.addTo(pakMap);

function generateList() {
    const ul = document.querySelector('.list');
    fortsList.forEach((fortress) => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        const a = document.createElement('a');
        const p = document.createElement('p');
        const p2 = document.createElement('p');

        div.classList.add('fort');
        a.innerText = fortress.properties.name;
        a.href = '#';
        p.innerText = fortress.properties.location;
        p2.innerText = fortress.properties.ownership;
        a.addEventListener('click', () => {
            flyToFort(fortress);
        });
        div.appendChild(a);
        div.appendChild(p);
        div.appendChild(p2);
        li.appendChild(div);
        ul.appendChild(li);
    });
}

generateList();

function makePopupContent(fortress) {
    return `
    <div>
        <h4>${fortress.properties.name}</h4>
        <p>${fortress.properties.location}</p>
        <p>${fortress.properties.ownership}</p>
    </div>
  `;
}

function onEachFeature(feature, layer) {
    layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) });
}

let fortIcon = L.icon({
    iconUrl: 'resources/fort_marker.png',
    iconSize: [47, 47]
})

const fortsLayer = L.geoJSON(fortsList, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng,  { icon: fortIcon });
    }
});
fortsLayer.addTo(pakMap);

function flyToFort(fort) {
    const lat = fort.geometry.coordinates[1];
    const lng = fort.geometry.coordinates[0];
    pakMap.flyTo([lat, lng], 14, {
        duration: 3
    });
    setTimeout(() => {
        L.popup({closeButton: false, offset: L.point(0, -8)})
        .setLatLng([lat, lng])
        .setContent(makePopupContent(fort))
        .openOn(pakMap);
    }, 3000);
}

let baseLayers = {
    "Satelite Map": googleSat,
    "Open Street Map": tiles,
};

let overlays = {
    "Marker": fortsLayer,
};
L.control.layers(baseLayers, overlays).addTo(pakMap);