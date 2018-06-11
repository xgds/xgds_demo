var rp = rp || {};

rp.getCoords = function(coords){
    return rp.coordinator.printCoords(coords);
}

//app.vent.on('onMapSetup', rp.initializeMousePositionControl);


rp.initializeMousePositionControl = function() {
    rp.mousePositionControl = new ol.control.MousePosition({
	coordinateFormat:  rp.getCoords,
   // coordinateFormat: ol.coordinate.createStringXY(4),
	projection: LONG_LAT,
      // comment the following two lines to have the mouse position
      // be placed within the map.
	className: 'custom-mouse-position',
	target: document.getElementById('postmap'),
	undefinedHTML: 'Unknown Position'
    });
}

rp.coordinator = {

    radius: 1737400,
    moonSPHERE: new ol.Sphere(1737400),
      //south_pole_proj4String: '+proj=stere +lat_0=-90 +lat_ts=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=1737400 +b=1737400 +units=m +no_defs',
    south_pole_code: 'IAU2000:30120',
    south_pole_proj4String: '+proj=stere +lat_0=-90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=1737400 +b=1737400 +units=m +no_defs',
    north_pole_code: 'IAU2000:30118',
    north_pole_proj4String: '+proj=stere +lat_0=90 +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=1737400 +b=1737400 +units=m +no_defs',
    valid_longitude: function(lon) {
        while (lon > 180) lon -= 360;
        while (lon < -180) lon += 360;
        return lon;
    },

      // Go from lon/lat in degrees to location in projection
    north_project: function(geo_location) {
        var longitude = geo_location[0];
        var latitude = geo_location[1];
        longitude = this.valid_longitude(longitude);
        if (latitude > 90 || latitude < -90){
            return [NaN, NaN];
        }

         // To radians for math functions
        longitude = longitude * Math.PI / 180.0;
        latitude = latitude * Math.PI / 180.0;
        var x, y;
        var rads_away_from_pole = (Math.PI / 2.0 - latitude);
        var theta = longitude - (Math.PI / 2.0);
        var R = 2.0 * this.radius / Math.tan((Math.PI - rads_away_from_pole) / 2.0);
         // Special case
        if (rads_away_from_pole == 0){
            R = 0;
        }
        x = R * Math.cos(theta);
        y = R * Math.sin(theta);
        return [x, y];
    },

      // Go from a location in the projection to a lon/lat in degrees
    north_unproject: function(mouse_location) {
        if (mouse_location) {
            var x = mouse_location[0];
            var y = mouse_location[1];
            // To radians for math functions
            var longitude;
            var latitude;
            var R = Math.sqrt(x * x + y * y);
            var rads_away_from_pole = Math.PI - 2.0 * Math.atan((2.0 * this.radius) / R);
            // Special case
            if (R == 0) {
		rads_away_from_pole = 0;
            }
            latitude = ( Math.PI / 2.0 - rads_away_from_pole);
            longitude = Math.atan2(y, x) + (Math.PI / 2.0);
            // Back to degrees
            longitude *= 180.0 / Math.PI;
            latitude *= 180.0 / Math.PI;
            return [longitude, latitude];

        }
        else return [NaN, NaN];
    },

      // Go from lon/lat in degrees to location in projection
    south_project: function(geo_location) {
        var longitude = geo_location[0];
        var latitude = geo_location[1];
        longitude = this.valid_longitude(longitude);
        if (latitude > 90 || latitude < -90){
            return [NaN, NaN];
        }

         // To radians for math functions
        longitude = longitude * Math.PI / 180.0;
        latitude = latitude * Math.PI / 180.0;
        var x, y;
        longitude = -longitude;

        var rads_away_from_pole = ( Math.PI / 2.0 + latitude);
        var theta = longitude - ( - Math.PI / 2.0);
        var R = 2.0 * this.radius / Math.tan((Math.PI - rads_away_from_pole) / 2.0);
         // Special case
        if (rads_away_from_pole == 0){
            R = 0;
        }
        x = R * Math.cos(theta);
        y = R * Math.sin(theta);
        return [x, y];
    },

      // go from location in projection to lon/lat in degrees
    south_unproject: function(mouse_location) {
        if (mouse_location) {
            var x = mouse_location[0];
            var y = mouse_location[1];
            // To radians for math functions
            var longitude;
            var latitude;

            var R = Math.sqrt(x * x + y * y);
            var rads_away_from_pole = Math.PI - 2.0 * Math.atan((2.0 * this.radius) / R);
            // Special case
            if (R == 0) {
		rads_away_from_pole = 0;
            }
            latitude = (- Math.PI / 2.0 + rads_away_from_pole);
            longitude = Math.atan2(y, x) + ( - Math.PI / 2.0);
            longitude = -longitude; // because this is a south pole projection

            // Back to degrees
            longitude *= 180.0 / Math.PI;
            latitude *= 180.0 / Math.PI;
            return [longitude, latitude];
        }
        else return [NaN, NaN];
    },

    printCoords: function(coord) {
        var result = this.north_project(coord);
        return "lat: " + coord[1] + " lon: " + coord[0] + "<br/> x: " + result[1] + " y: " + result[0];
    },

    init: function() {
        rp.initializeMousePositionControl();
        app.map.map.addControl(rp.mousePositionControl);
    },

    setupCoordinateSystem: function(code) {

        proj4.defs(rp.coordinator.south_pole_code, rp.coordinator.south_pole_proj4String);
        var south_pole_projection = new ol.proj.Projection({
            code: rp.coordinator.south_pole_code,
            extent: [-992800, -992800, 992800, 992800],
//          extent: [-31406, 87890, -22012, 117740],
            units: 'm',
            axisOrientation: 'enu',
            getPointResolution: rp.coordinator.getPointResolution
        });
        south_pole_projection.unprojectFunction = rp.coordinator.south_unproject;
        ol.proj.addProjection(south_pole_projection);
        ol.proj.addCoordinateTransforms(LONG_LAT, rp.coordinator.south_pole_code,
					function(coordinate) {
                  // forward
					    return rp.coordinator.south_project(coordinate);
					},
					function(coordinate) {
                  // inverse
					    return rp.coordinator.south_unproject(coordinate);
					}
				       );

         // north pole
        proj4.defs(rp.coordinator.north_pole_code, rp.coordinator.north_pole_proj4String);
        var north_pole_projection = new ol.proj.Projection({
            code: rp.coordinator.north_pole_code,
            extent: [-992800, -992800, 992800, 992800],
            units: 'm',
            axisOrientation: 'enu',
            getPointResolution: rp.coordinator.getPointResolution
        });
        north_pole_projection.unprojectFunction = rp.coordinator.north_unproject;
        ol.proj.addProjection(north_pole_projection);
        ol.proj.addCoordinateTransforms(LONG_LAT, rp.coordinator.north_pole_code,
					function(coordinate) {
                  // forward
					    return rp.coordinator.north_project(coordinate);
					},
					function(coordinate) {
                  // inverse
					    return rp.coordinator.north_unproject(coordinate);
					}
				       );

    },
    getPointResolution: function(resolution, point) {
          // Estimate point resolution by transforming the center pixel to EPSG:4326,
          // measuring its width and height on the normal sphere, and taking the
          // average of the width and height.
        var toEPSG4326 = ol.proj.getTransform(rp.coordinator.north_pole_code, LONG_LAT);
          var vertices = [
              point[0] - resolution / 2, point[1],
              point[0] + resolution / 2, point[1],
              point[0], point[1] - resolution / 2,
              point[0], point[1] + resolution / 2
          ];
        vertices = toEPSG4326(vertices, vertices, 2);
        var width = rp.coordinator.moonSPHERE.haversineDistance(vertices.slice(0, 2), vertices.slice(2, 4));
        var height = rp.coordinator.moonSPHERE.haversineDistance(vertices.slice(4, 6), vertices.slice(6, 8));
        var pointResolution = (width + height) / 2;
        return pointResolution;
    }
};
