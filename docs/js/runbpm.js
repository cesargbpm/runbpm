var map = L.map("map").fitWorld();
var started = false;
var lastlatlng = {};

var tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function onLocationFound(e) {
  var radius = e.accuracy / 2;
  console.log("radius:", radius);
  console.log("latlng:", e.latlng);

  if (started === true) {
    L.marker(e.latlng).addTo(map).bindPopup("Start").openPopup();
    started = false;
  }
  lastlatlng = e.latlng;
  //
  //if (stoped === true){
  //  L.marker(e.latlng).addTo(map).bindPopup("Stop").openPopup();
  //  stoped = false;
  //}

  //var locationCircle = L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

map.on("locationfound", onLocationFound);
map.on("locationerror", onLocationError);

map.locate({ setView: true, maxZoom: 19 });

function start_locate() {
  console.log("Start locating");
  map.locate({ setView: true, maxZoom: 19, watch: true });
  started = true;
}

function stop_locate() {
  console.log("Stop locating");
  console.log("lastlatlng ", lastlatlng);
  L.marker(lastlatlng).addTo(map).bindPopup("Stop").openPopup();
  map.stopLocate();
}
