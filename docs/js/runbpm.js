var map = L.map("map").fitWorld();
var started = false;
var lastlatlng;
var last_location_date;
var path = [];
var distance = 0;
var speed = 0;
var start_time;
var ss = 0;
var mm = 0;
var hh = 0;
var total_ss = 0;
var timer_interval;
var path_detail = [];

var tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function onLocationFound(e) {
  if (lastlatlng) {
    var last_distance = lastlatlng.distanceTo(e.latlng);
    distance += last_distance;
  }
  console.log("latlng:", e.latlng);

  let delta_time = 0;
  if (last_location_date) {
    console.log("last_location_date is nos null");
    console.log("last_location_date: ", last_location_date.toString());
    delta_time = new Date() - last_location_date;
    last_location_date = new Date();
    console.log("delta_time: ", delta_time);
    console.log("new last_location_date: ", last_location_date.toString());
  } else {
    console.log("last_location_date is null");
    delta_time = 0;
    last_location_date = new Date();
    console.log("new last_location_date: ", last_location_date.toString());
  }

  path.push(e.latlng);
  path_detail.push({
    latlng: e.latlng,
    distance: distance,
    delta_distance: last_distance ? last_distance : 0,
    delta_time: delta_time ? delta_time : 0,
    date: last_location_date,
  });
  console.log("path_detail_push ", path_detail);

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
  timer_interval = setInterval(start_timer, 1000);
}

function start_timer() {
  total_ss++;
  ss++;

  if (ss > 59) {
    mm++;
    ss = 0;
  }
  if (mm > 59) {
    hh++;
    mm = 0;
  }
  speed = total_ss > 0 ? Math.round(distance / ss) : 0;
  let print_Ss = ss < 10 ? "0" + ss : ss;
  let print_mm = mm < 10 ? "0" + mm : mm;
  let print_hh = hh < 10 ? "0" + hh : hh;
  document.getElementById(
    "timer"
  ).innerHTML = `${print_hh} : ${print_mm} : ${print_Ss}`;

  const path_info = path_detail
    ? path_detail[path_detail.length - 1]
    : { info: "no_path" };

  console.log(`Path_info ${JSON.stringify(path_info)}`);
  if (path_detail) {
    const speed =
      (path_info.delta_distance * 1000) /
      (path_info.delta_time * 1000 * 60 * 60);
    document.getElementById("speed_value").innerHTML = `Speed : ${speed} KM/H`;
  } else {
    document.getElementById("speed_value").innerHTML = `Starting...`;
  }
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
  clearInterval(timer_interval);
}
