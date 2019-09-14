
  <!--  
  Wix Page: Atlas -- $w(#html1)

  Onload sends "heartbeat" message to Wix; otherwise HTML code will finish running first
  and not receive any data from Wix.
  Try not to use console log otherwise the google maps key can be viewed from the browser. 
  TO-DO: change the variable url to the final domain name once received 
  Google Maps documentation: https://developers.google.com/maps/documentation/javascript/marker-clustering
  -->
  <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no">
      <meta charset="utf-8">
      <title>Marker Clustering</title>
      <style type="text/css">

      /* Loading bar for when the Atlas is still loading */
      .loader {
    position: absolute;
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 250px;
    height: 250px;
    animation: spin 2s linear infinite;
  }
  .overlay {
      background: #FFFFFF;  
      position: absolute;  
      top: 100;                  
      right: 100;               
      bottom: 100;
      left: 500;
      opacity: 1;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Text inside the loading bar */
  #load_text {
    width: 200px;
    height: 200px;
    position: absolute;
    top: calc(50% - 40px);
    left: calc(50% - 295px);
    text-align: center;
    font-family: sans-serif;
    font-size: 20px;
  }
        /* Always set the map height explicitly to define the size of the div
         * element that contains the map. */
        #map {
          opacity: 0.1;
          height: 100%;
          pointer-events: none;
        }
        /* Optional: Makes the sample page fill the window. */
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        /* Centers the heading text (not sure if it is working though) */
        #firstHeading {
          padding-top: 5px;
          padding-bottom: 5px;
          margin-bottom: 0px;
          margin-top: 0px;
        }
        #paragraph {
          padding-top: 0px;
          padding-bottom: 0px;
          margin-bottom: 0px;
          margin-top: 0px;
        }
        /* Sets the width and height of the main picture */
        #pic {
          width: 100px;
          height: 100px;
          padding-bottom: 0px;
          margin-bottom: 0px;
          margin-top: 5px;
        }
        /* Sets the width and height of the icon */
        #icon {
          width: 20px;
          height: 20px;
          padding-top: 0px;
          padding-bottom: 0px;
          margin-bottom: 0px;
          margin-top: 0px;
        }
       
       /* Always set the map height explicitly to define the size of the div
   * element that contains the map. */

  /* The popup bubble styling. */
  .popup-bubble {
    /* Position the bubble centred-above its parent. */
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -100%);
    /* Style the bubble. */
    background-color: white;
    padding: 0px;
    border-radius: 0px;
    font-family: arial black;
    overflow-y: auto;
    height: 400px;
    box-shadow: 0px;
  }
  /* The parent of the bubble. A zero-height div at the top of the tip. */
  .popup-bubble-anchor {
    /* Position the div a fixed distance above the tip. */
    position: absolute;
    width: 100%;
    bottom: /* TIP_HEIGHT= */ 8px;
    left: 0;
  }
  /* This element draws the tip. */
  .popup-bubble-anchor::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    /* Center the tip horizontally. */
    transform: translate(-50%, 0);
    /* The tip is a https://css-tricks.com/snippets/css/css-triangle/ */
    width: 0;
    height: 0;
    /* The tip is 8px high, and 12px wide. */
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: /* TIP_HEIGHT= */ 8px solid white;
  }
  /* JavaScript will position this div at the bottom of the popup tip. */
  .popup-container {
    cursor: auto;
    height: 0;
    position: absolute;
    /* The max width of the info window. */
    width: 200px;
  }
        
      <div id="place-list"></div>

  html, body {

    height: 100%;
    margin: 0;
    padding: 0;
  }

        
      </style>

   <div class="overlay" id="loader">
      <div id="load_text"> Loading Atlas</div>
    <div class="loader" > </div>
        </div>
  <script type="text/javascript">



        const delay = ms => new Promise(res => setTimeout(res, ms));
        /* initialize all variables for later usage */
        var currentInfoWindow = null;
        var map;
        var markers = [];
        var markerCluster;
        var lat;
        var lng;
        var name;
        var image;
        var icon;
        var replaced;
        var description;
        var service;
        var numStyles;

        /* CHANGE url to match the final domain name */
        var url = 'https://ajhsu3.wixsite.com/mares-mexicanos-a/'; 

        var iconArray = [];
        var operatorCount =0;
        var queryInput;
        var operatorInfo;

        /**
         * Supposed to clear all markers from array but not working correctly
         * 
         * Not needed
         */
        function clearOverlays() {

          for (var i = 0; i < markers.length; i++ ) {
            markers[i].setMap(null);
          }
          markers.length = 0;
        }

        /**
         * Creates new infoWindow for specific marker
         */
        function makeInfoWindowEvent(map, infowindow, marker) {
              google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
              });
        }


        /*
          
          
        }
        /**
         * Receive item from Wix database: marker = divesite, icon = tour operator
         * 
         */
        window.onmessage = (event) => { 

            var item = event.data;
            if(item.marker === "marker"){

            lat = item.lat;
            lng = item.long;
            name = item.nombreSitio;
            replaced = name.split(' ').join('_');
            
            /* This is for the octupus and mangrove on the contentwindow*/
            image = item.fuente1;
            icon = item.fuente3;

            /*create LatLng variable for google*/
            var myLatlng = new google.maps.LatLng(lat,lng);

           
           /* customize marker */
            var diver = {
              url: "https://www.dropbox.com/s/rpcshedn0zdsi03/diveSiteIcon.png?raw=1",
              scaledSize: new google.maps.Size(50, 25)
            }
            var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
            
          /* replaces summary with empty string if it is null to prevent error*/
          if (item.summary === null || item.summary === undefined){
            item.summary = "";
          }


            name = name.replace(/_/g, " "); //replace underscores

            var contentString =
            '<div style="width:225px; height:320px"> <img id="pic" src=' + image + ' style="width:225px;height:180px;> <div id="content">'+
              '<h2 id="firstHeading">' + name + '</h2>'  + '<p id="paragraph">' + item.summary + '</p>'+
              '<div id="bodyContent">'+
              '<br><img id="icon" src=' + icon + '>' + '</div>'+ 
              '<a href=' +url+ 'update1/'+replaced+ ' target="_blank" rel="noopener"> More </a>'
              '</div>'+
              '</div>';

            var infoWindow = new google.maps.InfoWindow({
            content: contentString
            });
            var diver;
              
            /*Change the diver picture if there is no description. Used to discern between markers with information and 
            * markers without information
            */
           if(item.pageDescription === null | item.pageDescription === undefined){
              diver = {
              url: "https://www.dropbox.com/s/rpcshedn0zdsi03/diveSiteIcon.png?raw=1",
              scaledSize: new google.maps.Size(50, 25)
            }
          }
          else{
             diver = {
              url: "https://www.dropbox.com/s/rpcshedn0zdsi03/diveSiteIcon.png?raw=1", //insert link of the diver image for sites with page descriptions (currently the same as the pages without page descriptions)
              scaledSize: new google.maps.Size(50, 25) 
              }
              }
          var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                icon: diver,
                title: item.nombreSitio,
                infowindow: infoWindow
            });
          
          
            marker.addListener('click', function() {
              if(currentInfoWindow != null) {
                currentInfoWindow.close();
              }
              infoWindow.open(map, marker);
              currentInfoWindow = infoWindow;
            });
            markers.push(marker);

            markerCluster.addMarker(marker);



          }

         


    else if (item.marker === "icon"){

      /* Hide loading bar once we read the last item */
      if(item.operatorName === "LANDS_END_DIVERS"){
               setTimeout(function(){ 
                document.getElementById("map").style.opacity = 1.0;
                document.getElementById("map").style.pointerEvents = "auto";
              loader.hidden = true;
                     }, 4500);
              
              }

                  /*NewLat and newLng are programmatically generated latitudes and longitudes that came from searching the 
                  * the tour operators on Google Maps. NewLat and newLng are more precise than the operatorLat and operatorLon
                  * from the database but may contain the wrong lat/lng because the Google search found a site that does not
                  * match the database's site.
                  */
                   if(item.newLat === undefined || item.newLat ===0){
                      
                      lat = item.operatorLat;
                      lng = item.operatorLon;
                      }
                      else{
                      lat = item.newLat;
                      lng = item.newLng;
                    }

                    /*Sample beach flag png used by Google Maps*/
                      var image = {
            url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(20, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 0)
          };
          // Shapes define the clickable region of the icon. The type defines an HTML
          // <area> element 'poly' which traces out a polygon as a series of X,Y points.
          // The final coordinate closes the poly by connecting to the first coordinate.
          var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };

            /*Customizable marker*/
            var icon = new google.maps.Marker({
              position: {lat: lat, lng: lng},
              map: map,
              //icon: image, 
              //shape: shape,
              //title: beach[0],
              //zIndex: beach[3]
            });

           
           /*simply send the item, the Wix page will display its information on the Atlas*/
            icon.addListener('click', function() {
              sendMessage(item);
              
        
           
  })
            /*icon is not visible until appropriate zoom level */
            icon.setVisible(false);
            /*push into the marker array (not marker clusterer,, tourOperators are not clustered)*/
            iconArray.push(icon);
          
  }
          
          /*User has searched a location on the Atlas search bar. Wix will send its information here 
          to zoom to site*/

          else{

             /*close current infowindow*/
             if(currentInfoWindow !== null){
                  currentInfoWindow.close();
                }
            var markerSites = markerCluster.getMarkers();
            var searched;
            var clusters;
            for(var i=0; i< markerSites.length; i++){
              if(markerSites[i].getTitle() === item){
                searched = markerSites[i];
                
                map.setZoom(9); //set zoom to 9 and then pan for a smoother transition*/
                map.panTo(markerSites[i].getPosition());
              }
            }

            /*delay by 1.5 seconds to give time for the clusters to load*/
            setTimeout(function(){ 

                    recursiveZoom(item);
                     }, 1500);

          
    }
          
  }
      
      /*continuously zoom by one level until the searched item is not found in a cluster*/
      function recursiveZoom(item){
        var clusters = markerCluster.getClusters();
        for(var j=0; j<clusters.length; j++){
          for(var i=0; i< clusters[j].markers_.length; i++){
            if(clusters[j].markers_[i].getTitle() === item){
              
              if(clusters[j].markers_.length <= 1){
                if(currentInfoWindow !== null){
                  currentInfoWindow.close();
                }
                clusters[j].markers_[i].infowindow.open(map, clusters[j].markers_[i]);
                currentInfoWindow = clusters[j].markers_[i].infowindow;
                return;
              }


               map.fitBounds(clusters[j].getBounds());
                  setTimeout(function(){ 
                    recursiveZoom(item);
                     }, 1500);

            return;
            }
          }
        }
                         }
                        


   const waitFunction = async () => {
    await delay(5000);

  }


  /*  FindPlaceName, FindPlaceRegion, FindPlace Address, and Geocode NOT used for Atlas anymore to prevent
  *   going over query limit. Results from each tour operator are stored in the database already.
  *   
  *   Execute a Google Maps search with the "site name", "estado, name", "address", "lat/lng" respectively.
  *   Documentation at: https://developers.google.com/places/web-service/search
  */
  function findPlaceName(input){
  var sw = new google.maps.LatLng(input.operatorLat - 1, input.operatorLon-1);

      var operator = input.operatorName;
      operator = operator.split('_').join(' ');


  var ne = new google.maps.LatLng(input.operatorLat+1, input.operatorLon+1);
  var bounds = new google.maps.LatLngBounds(sw, ne);
  var request = {
            query: operator,
            fields: ['name', 'geometry', 'place_id'],
            locationBias: bounds
          };
      service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
    for(var i =0; i<results.length; i++){
          var queryResult = JSON.parse(JSON.stringify(results[i]));

        /* Only use results if they are within 1 degree lat and 1 degree long from given lat/lng*/
        if (Math.abs(input.operatorLat - queryResult.geometry.location.lat) < 1 && Math.abs(input.operatorLon - queryResult.geometry.location.lng) < 1){
              var request = {
                  placeId: results[i].place_id,
                  fields: ['photos', 'name', 'geometry', 'opening_hours', 'rating']
                };
                service = new google.maps.places.PlacesService(map);
                service.getDetails(request, callback);
                return;
        }
        
          
            }
            findPlaceRegion(input);
          }
            else{
              findPlaceRegion(input);
            }
            

  })

          
  }
  function findPlaceRegion(input){
  var sw = new google.maps.LatLng(input.operatorLat - 1, input.operatorLon-1);

      var operator = input.operatorName;
      operator = operator.split('_').join(' ');


  var ne = new google.maps.LatLng(input.operatorLat+1, input.operatorLon+1);
  var bounds = new google.maps.LatLngBounds(sw, ne);
  var request = {
            query: operator,
            fields: ['name', 'geometry', 'place_id'],
            locationBias: bounds
          };
      service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
    for(var i =0; i<results.length; i++){
          var queryResult = JSON.parse(JSON.stringify(results[i]));
        if (Math.abs(input.operatorLat - queryResult.geometry.location.lat) < 1 && Math.abs(input.operatorLon - queryResult.geometry.location.lng) < 1){
              var request = {
                  placeId: results[i].place_id,
                  fields: ['photos', 'name', 'geometry', 'opening_hours', 'rating']
                };
                service = new google.maps.places.PlacesService(map);
                service.getDetails(request, callback1);
                return;
        }
        
          
            }
            findPlaceAddress(input);
          }
            else{
              findPlaceAddress(input);
            }
            

  })

          
  }




  function findPlaceAddress(input){
  var sw = new google.maps.LatLng(input.operatorLat - 1, input.operatorLon-1);

      var operator = input.address;
      if(operator === undefined || operator === null){
        geoCode(input);
        return;
      }
      operator = operator.split('_').join(' ');


  var ne = new google.maps.LatLng(input.operatorLat+1, input.operatorLon+1);
  var bounds = new google.maps.LatLngBounds(sw, ne);
  var request = {
            query: operator,
            fields: ['name', 'geometry', 'place_id'],
            locationBias: bounds
          };
      service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
              for(var i =0; i<results.length; i++){
          var queryResult = JSON.parse(JSON.stringify(results[i]));
        if (Math.abs(input.operatorLat - queryResult.geometry.location.lat) < 1 && Math.abs(input.operatorLon - queryResult.geometry.location.lng) < 1){
              var request = {
                  placeId: results[i].place_id,
                  fields: ['photos', 'name', 'geometry', 'opening_hours', 'rating']
                };
                service = new google.maps.places.PlacesService(map);
                service.getDetails(request, callback2);
                return;
        }
       
            }
            geoCode(input);
          }
            else{
              geoCode(input);
            }
            

  })

          
  }
  function geoCode(item){
    var geocoder = new google.maps.Geocoder;

  var latlng = {lat: parseFloat(item.operatorLat), lng: parseFloat(item.operatorLon)};
          geocoder.geocode({'location': latlng}, function(results, status) {
            if (status === 'OK') {
              if (results[0]) {
                var request = {
                placeId: results[0].place_id,
                fields: ['photos', 'name', 'geometry', 'opening_hours', 'rating']
                };
                service = new google.maps.places.PlacesService(map);
                service.getDetails(request, callback3);

                //infowindow.setContent(results[0].formatted_address);
              } else {
                window.alert('No results found');
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
            }


            })
  }

        //Send a heartbeat message to show that the page is loaded
        function sendMessage(msg){
            window.parent.postMessage(msg, "*");
        }


       

        function load() {


       const loader = document.getElementById("loader");
       loader.hidden = false;

   



          map = new google.maps.Map(document.getElementById('map'), {
            zoom: 5,
            center: {lat: 20, lng: -95},
            mapTypeControl: false,
            styles: [
    {
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "landscape.natural.landcover",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]

          });


  /*Customized marker clusters. Example found at: https://stackoverflow.com/questions/7834284/styling-markerclusterer-icons*/ 
  var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
          };
        //Levels 1 to n styles. Textcolor, image, height, width, and textSize of cluster icon
        var clusterStyles = [
         {
          textColor: 'gray',
          url: 'https://www.dropbox.com/s/m0snesgqoqad6ry/Marker%20cluster%20high%20def.png?raw=1',
          height: 95,
          width: 90,
          textSize: 13,
          anchorText: [0, 1]
        },
       {
          textColor: 'gray', 
          url: 'https://www.dropbox.com/s/xns0gubyv7acjzs/Marker%20cluster%202.00.png?raw=1',
          height: 100,
          width: 105,
          textSize: 17,
          anchorText: [3, 0],
        },
       {
          textColor: 'gray',
          anchorText: [12, 9],
          url: 'https://www.dropbox.com/s/f0con7hootidiit/Marker%20cluster%203.0.png?raw=1',
          height: 95,
          width: 100,
          textSize: 17,
         
          
          },
         
        {
          textColor: 'gray',
          url: 'https://www.dropbox.com/s/gqz02bbafzaulqx/Marker%20cluster%204.0.png?raw=1',
          height: 95,
          width: 115,
          textSize: 18,
          anchorText: [20, 8],
          //shape:shape

        },
         {
          textColor: 'gray',
          url: 'https://www.dropbox.com/s/93air93aof5vl7d/Marker%20cluster%205.0.png?raw=1',
          height: 120,
          width: 125,
          textSize: 20,
          anchorText: [17, 9],
        },

       
      ];
          // Add a marker clusterer to manage the markers. Adds styles to marker clusterer
          var mcOptions = {
            gridSize: 50,
            styles: clusterStyles,
            maxZoom: 15,
            imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
          };

  //Calculator function changes sizes of the marker clusters according to the number of markers in each cluster      
            markerCluster = new MarkerClusterer(map, markers, mcOptions);


            

            markerCluster.setCalculator(function(markers, numStyles){
            //create an index for icon styles
            var index = 0,
            //Count the total number of markers in this cluster
                count = markers.length,
            //Set total to loop through (starts at total number)
                total = count;

            /**
             * While we still have markers, divide by a set number and
             * increase the index. Cluster moves up to a new style.
             *
             * The bigger the index, the more markers the cluster contains,
             * so the bigger the cluster.
             */
            while (total !== 0) {
                //Create a new total by dividing by a set number
                total = parseInt(total / 3, 10);
                //Increase the index and move up to the next style
                index++;
            }

            /**
             * Make sure we always return a valid index. E.g. If we only have
             * 5 styles, but the index is 8, this will make sure we return
             * 5. Returning an index of 8 wouldn't have a marker style.
             */
            index = Math.min(index, numStyles);

            //Tell MarkerCluster this clusters details (and how to style it)
            return {
              
                text: count,// + " ("+ index + ")",
                index: index
            };
        });
           


            google.maps.event.addListener(map, 'zoom_changed', function() {
      var zoom = map.getZoom();
      // iterate over markers and call setVisible
      for (i = 0; i < iconArray.length; i++) {
          iconArray[i].setVisible(zoom >= 10);
      }
  }); 
        }

  //shorten the description without cutting off a word
  function shorten(str, maxLen, separator = ' ') {
    if (str.length <= maxLen) return str;
    return str.substr(0, str.lastIndexOf(separator, maxLen));
  }


  /* Not used */
  function getLength(markers){
    return markers.length;
  }


  /*Callback's are used in for the Google Place Services methods e.g. findPlaceName, geoCode. Not used in Atlas anymore 
  * to prevent over query limit
  */
  function callback(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var photoUrl;
          operatorInfo = JSON.parse(JSON.stringify(place));

      

      if(place.photos !== undefined){
      photoUrl = place.photos[0].getUrl({maxWidth: 400, maxHeight: 400});
          

      operatorInfo.photos = photoUrl;
      operatorInfo.origin = queryInput;

      sendMessage(operatorInfo);
      return;
   }



     }
         findPlaceRegion(queryInput);

    }

    function callback1(place, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var photoUrl;
      if(operatorInfo === null){
          operatorInfo = JSON.parse(JSON.stringify(place));
        }

      

      if(place.photos !== undefined){
      photoUrl = place.photos[0].getUrl({maxWidth: 400, maxHeight: 400});
          

      operatorInfo.photos = photoUrl;
      operatorInfo.origin = queryInput;

      sendMessage(operatorInfo);
      return;
   }



     }
         findPlaceAddress(queryInput);

    }

  function callback2(place, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {

  if(operatorInfo === null){
          operatorInfo = JSON.parse(JSON.stringify(place));
        }
      
      var photoUrl;
      if(place.photos !== undefined){
      photoUrl = place.photos[0].getUrl({maxWidth: 400, maxHeight: 400});

      operatorInfo.photos = photoUrl;
      operatorInfo.origin = queryInput;

      sendMessage(operatorInfo);
      return;
   }
  }
      geoCode(queryInput);

  }
  function callback3(place, status) {

    if (status == google.maps.places.PlacesServiceStatus.OK) {
      var photoUrl;

      if(place.photos !== undefined){
      photoUrl = place.photos[0].getUrl({maxWidth: 400, maxHeight: 400});
   }
      operatorInfo = JSON.parse(JSON.stringify(place));
      operatorInfo.photos = photoUrl;

     operatorInfo.origin = queryInput;

    }
   }



      </script>

  <!-- source from Walter Chang's github. Fixes the marker cluster clickable area. -->
      <script src="https://wjc011.github.io/">
      </script>

  <!-- Rawgit soon to be deprecated -->
     <!--<script src="https://cdn.rawgit.com/googlemaps/v3-utility-library/master/markerclustererplus/src/markerclusterer.js"></script>
      <script src="https://cdn.jsdelivr.net/gh/googlemaps/v3-utility-library@master/markerclustererplus/src/markerclusterer.js"></script>
  -->

          <!-- Needed for the Google Place Service -->
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDRXh4TSkX7baZwlZDOQekCqg5byR682Oo&libraries=places" async defer></script>
    </head>

    <body onload="load()">

      <div id="map"></div>

    </body>
  </html>
