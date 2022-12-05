let map, infoWindow;
var myMap;
var myObject = new Array();
var myInterval;
var intervalCounter = 0;
var myInfoWindow;
var centerpoint;
var markers = [];           // array to hold markers
var kmRadius = 20;          // draw 20 km radius
// although we are using a static data source consisting of 4 pairs of
// lat/lon/elevation, we could have used an Ajax call to get such data
// from a database or a middleware or API. This array is just to show
// an example of polygon data source
var dataSource = [
    "-90.00012,45.00045,0 -90.00012,45.00046,0 -89.99988,45.00046,0 -89.99988,45.00045,0",
    "-89.99919,45.00111,0 -89.99919,45.00119,0 -89.99896,45.00119,0 -89.99896,45.00111,0",
    "-89.99826,45.00197,0 -89.99826,45.00206,0 -89.99803,45.00206,0 -89.99803,45.00197,0",
    "-89.99733,45.00283,0 -89.99733,45.00292,0 -89.99710,45.00292,0 -89.99710,45.00283,0",
    "-89.99641,45.00370,0 -89.99641,45.00379,0 -89.99617,45.00379,0 -89.99617,45.00370,0",
    "-89.99965,45.00068,0 -89.99965,45.00076,0 -89.99942,45.00076,0 -89.99942,45.00068,0",
    "-89.99872,45.00154,0 -89.99872,45.00163,0 -89.99849,45.00163,0 -89.99849,45.00154,0",
    "-89.99780,45.00240,0 -89.99780,45.00249,0 -89.99757,45.00249,0 -89.99757,45.00240,0",
    "-89.99687,45.00327,0 -89.99687,45.00335,0 -89.99664,45.00335,0 -89.99664,45.00327,0",
    "-89.99594,45.00358,0 -89.99594,45.00349,0 -89.99617,45.00349,0 -89.99617,45.00358,0",
    "-90.00012,45.00271,0 -90.00012,45.00279,0 -89.99988,45.00279,0 -89.99988,45.00271,0",
    "-89.99594,45.00453,0 -89.99594,45.00444,0 -89.99617,45.00444,0 -89.99617,45.00453,0",
    "-89.99647,45.00944,0 -89.99644,45.00942,0 -89.99666,45.00938,0 -89.99668,45.00937,0",
    "-89.99687,45.00936,0 -89.99687,45.00928,0 -89.99710,45.00928,0 -89.99710,45.00936,0"
];

$(document).ready(function () {
    //initialize();
});
function initialize() {
    //Initialization of MAP 
    var latlng = new google.maps.LatLng(45.00495, -90.00052);
    //var latlng = new google.maps.LatLng(position[0], position[1]);
    map = new google.maps.Map(document.getElementById("map"), {
        center: latlng,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });
    //infoWindow = new google.maps.InfoWindow();
    //// Getting Current Position on MAP
    //if (navigator.geolocation) {
    //    navigator.geolocation.getCurrentPosition(
    //        (position) => {
    //            const pos = {
    //                lat: position.coords.latitude,
    //                lng: position.coords.longitude,
    //            };
    //            position = pos;
    //            infoWindow.setPosition(pos);
    //            infoWindow.setContent("Location found.");
    //            infoWindow.open(map);
    //            map.setCenter(pos);
    //        },
    //        () => {
    //            handleLocationError(true, infoWindow, map.getCenter());
    //        }
    //    );
    //} else {
    //    // Browser doesn't support Geolocation
    //    handleLocationError(false, infoWindow, map.getCenter());
    //}
    myInfoWindow = new google.maps.InfoWindow();
    // add listener
    google.maps.event.addDomListener(
        map,
        'click',
        function (event) { createMarker(event.latLng); }
    );
    // draw the button to try again
    //createSelectionControl();

    // start the animation to display each polygon
    //myInterval = setInterval(function () { drawPolygon(); }, 500);
}
function createMarker(coord) {
    var pos = new google.maps.LatLng(coord.lat(), coord.lng());
    var marker = new google.maps.Marker({
        position: pos,
        map: map
    });
    markers.push(marker);
    marker = new google.maps.Circle({
        center: pos,
        map: myMap,
        strokeColor: '#000',
        strokeWeight: 2,
        strokeOpacity: 0.5,
        fillColor: '#f0f0f0',
        fillOpacity: 0.5,
        radius: kmRadius * 1000
    });
    markers.push(marker);
}
function drawPolygon() {
    // get an item from the array, parse information and then have the
    // parser display the polygon on the map
    parseInformation(dataSource[intervalCounter]);
    // if we have gone through all of our array items, let's stop
    // the interval
    intervalCounter++;
    if (intervalCounter >= dataSource.length) {
        clearInterval(myInterval);
    }
}
function parseInformation(data) {
    var polygon = setupPolygon(data);
    myObject.push(
        new google.maps.Polygon({
            paths: polygon,
            strokeColor: '#00ff00',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#00ff00',
            fillOpacity: 0.35
        })
    );
    var obj = myObject[myObject.length - 1];
    obj.setMap(myMap);
    google.maps.event.addListener(obj, 'click', showInformation);
}
function setupPolygon(latlonstr) {
    var latlonstr = latlonstr.trim();
    var individualPoints = latlonstr.split(' ');
    var individualPointsLength = individualPoints.length;
    var point = new Array();
    var returnData = new Array();
    for (var i = 0; i < individualPointsLength; i++) {
        point = individualPoints[i].split(',');
        returnData[i] = new google.maps.LatLng(
            parseFloat(point[1]),
            parseFloat(point[0])
        );
    }
    return returnData;
}
function showInformation(event) {
    var message = getMessage(this, false);
    myInfoWindow.setOptions({ content: message });
    myInfoWindow.setPosition(event.latLng);
    myInfoWindow.open(myMap);
}