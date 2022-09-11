var map = L.map("map").fitWorld();
var started = false;
var lastlatlng;
var path = [];
var distance = 0;

var tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function onLocationFound(e) {
  if (lastlatlng) {
    var lastDistance = lastlatlng.distanceTo(e.latlng);
    distance += lastDistance;
  }
  console.log("latlng:", e.latlng);

  path.push(e.latlng);
  lastlatlng = e.latlng;

  if (started === true) {
    L.marker(e.latlng).addTo(map).bindPopup("Start").openPopup();
    started = false;
  }
  var polyline = L.polyline(path, { color: "red" }).addTo(map);
  // zoom the map to the polyline
  map.fitBounds(polyline.getBounds());

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
  map.locate({
    setView: true,
    maxZoom: 19,
    watch: true,
    enableHighAccuracy: true,
  });
  started = true;
  document.getElementById("stop_button").style.visibility = "visible";
  document.getElementById("start_button").style.visibility = "hidden";
}

function stop_locate() {
  console.log("Stop locating");
  console.log("lastlatlng ", lastlatlng);
  console.log("path: ", path);
  var message = `Stop ${distance} metters `;
  // var polyline = L.polyline(path, { color: "red" }).addTo(map);
  // zoom the map to the polyline
  // map.fitBounds(polyline.getBounds());
  L.marker(lastlatlng).addTo(map).bindPopup(message).openPopup();
  map.stopLocate();
  document.getElementById("stop_button").style.visibility = "hidden";
  document.getElementById("restart_button").style.visibility = "visible";
}
