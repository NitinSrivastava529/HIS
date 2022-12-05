let map;
let infoWindow;
var centerpoint;
var markers = [];           // array to hold markers
var kmRadius = 0.2;          // draw 20 km radius
var directionsDisplay;
var myInterval;
var directionsService = new google.maps.DirectionsService();
var _Index;
$(document).ready(function () {
    //initialize(); not required because already use in Link as Callback
});
function initialize() {
    _Index = 0;
    //Initialization of MAP
    var latlng = new google.maps.LatLng(26.910282518535272, 80.9573723717934);
    //var latlng = new google.maps.LatLng(position[0], position[1]);
    map = new google.maps.Map(document.getElementById("map"), {
        center: latlng,
        zoom: -1,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    infoWindow = new google.maps.InfoWindow();

    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                position = pos;
                map.setCenter(pos);
                ///var pos = new google.maps.LatLng(coord.lat(), coord.lng());
                var marker = new google.maps.Marker({
                    position: pos,
                    map: map
                });
                markers.push(marker);
                marker = new google.maps.Circle({
                    center: pos,
                    map: map,
                    strokeColor: '#000',
                    strokeWeight: 2,
                    strokeOpacity: 0.5,
                    fillColor: '#f0f0f0',
                    fillOpacity: 0.5,
                    radius: 1 * 1000
                });
                markers.push(marker);
            },
            () => {
                handleLocationError(true, infoWindow, map.getCenter());
            }
        );
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

    // add listener
    google.maps.event.addDomListener(map, 'click', function (event) { createMarker(event.latLng); });

    myInterval = setInterval(function () { drawRoute(); }, 2000);
 
}

function drawRoute() {
    let dataSource = [
        '26.8931563,80.9445839',
        '26.8943213,80.9502367',
        '26.8951924,80.951041',
        '26.8951924,80.951041',
        '26.8960511,80.9513537',
        '26.8961873,80.9517363',
        '26.8966249,80.9522833',
        '26.8968901,80.9523349',
        '26.8971944,80.9521606',
        '26.8976794,80.9518437',
        '26.89784,80.9514483',
        '26.8983295,80.9515898',
        '26.8989018,80.9521548',
        '26.8991985,80.9525129',
        '26.8993018,80.9536622',
        '26.8995526,80.9545552',
        '26.8996453,80.955238',
        '26.9001422,80.9553359',
        '26.9011939,80.9553275',
        '26.9016676,80.9552217',
        '26.902033,80.955227',
        '26.9024343,80.9553122',
        '26.9030675,80.9553131',
        '26.9034718,80.955253',
        '26.9040303,80.9553899',
        '26.904458,80.9555212',
        '26.905334,80.9556927',
        '26.9057075,80.9557811',
        '26.9061942,80.9557663',
        '26.9068748,80.9561228',
        '26.907072,80.9560056',
        '26.907651,80.9563318',
        '26.9080069,80.9562545',
        '26.9085474,80.9564756',
        '26.9087636,80.9565971',
        '26.9087956,80.9568557',
        '26.908993,80.9570038',
        '26.9088931,80.9568191',
        '26.9091295,80.9570721',
        '26.9095729,80.9571576',
        '26.909785,80.9572946',
        '26.9104187,80.9573799',
        '26.9095174,80.9573913',
        '26.9103887,80.9571265',
        '26.9105263,80.9573199',
        '26.9115065,80.9572265',
        '26.9114827,80.9568956',
        '26.9115553,80.9574487',
        '26.9117549,80.9573612',
        '26.9115241,80.9570681',
        '26.9115303,80.9574015',
        '26.9115063,80.9569084',
        '26.9113735,80.9572731',
        '26.9115645,80.9574638'];


        //"26.8877787,80.9419614",
        //"26.8879265,80.9446312",
        //"26.8923905,80.948795",
        //"26.8933667,80.9495664",
        //"26.895707,80.9514444",
        //"26.8994431,80.9527825",
        //"26.899741,80.9540157",
        //"26.9033709,80.955337",
        //"26.9106478,80.957613",
        //"26.9115517,80.9574424",
        //"26.9114609,80.9569251",
        //"26.8862651,80.9435697",
        //"26.8862795,80.9436093",
        //"26.8875443,80.9420786"];


        //"26.910234683135045,80.95730799878125",
        //"26.908829369759257,80.95682384584381",
        //"26.89972102686782,80.95519306286928",
        //"26.89826668561682,80.95158817418877",
        //"26.896965417044523,80.95236065033461",
        //"26.89025275316335,80.94753668701686",
        //"26.88432474157946,80.94407127319602",
        //"26.881874980128014,80.94497249536614"];
         calcRoute(dataSource[_Index], dataSource[_Index+1]);
        _Index++;
}

function calcRoute(startaddress, endaddress) {
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    var t1 = startaddress.split(',');
    var t2 = endaddress.split(',');
    var start = new google.maps.LatLng(t1[0],t1[1]);
    var end = new google.maps.LatLng(t2[0], t2[1]);
    //var start = new google.maps.LatLng(26.910234683135045, 80.95730799878125);
    //var end = new google.maps.LatLng(26.88192415276274, 80.94479708658163);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
        } else {
            alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        }
    });
    var pos = new google.maps.LatLng(t2[0], t2[1]);
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: 'http://localhost:54687/Areas/Customer/JsModule/ambulance.png'
    });
    markers.push(marker);
}
function createMarker(coord) {
    var pos = new google.maps.LatLng(coord.lat(), coord.lng());
    var marker = new google.maps.Marker({
        position: pos,
        map: map,
        icon: 'http://localhost:54687/Areas/Customer/JsModule/ambulance.png'
    });
    markers.push(marker);
    //marker = new google.maps.Circle({
    //    center: pos,
    //    map: map,
    //    strokeColor: '#000',
    //    strokeWeight: 2,
    //    strokeOpacity: 0.5,
    //    fillColor: '#f0f0f0',
    //    fillOpacity: 0.5,
    //    radius: kmRadius * 1000
    //});
    //markers.push(marker);
}
function mapLocation() {
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();

    function initialize() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        var chicago = new google.maps.LatLng(37.334818, -121.884886);
        var mapOptions = {
            zoom: 7,
            center: chicago
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        directionsDisplay.setMap(map);
        google.maps.event.addDomListener(document.getElementById('routebtn'), 'click', calcRoute);
    }

    function calcRoute() {
        var start = new google.maps.LatLng(37.334818, -121.884886);
        //var end = new google.maps.LatLng(38.334818, -181.884886);
        var end = new google.maps.LatLng(37.441883, -122.143019);
        var request = {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
            } else {
                alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
            }
        });
    }
    //google.maps.event.addDomListener(window, 'load', initialize);
}