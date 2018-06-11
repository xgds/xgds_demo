getInitialLayers = function() {

    return [
//       this never worked
//       new ol.layer.Tile( {
//          name: "onmoon",
//          extent: [-992800, -992800, 992800, 992800],
//          source: new ol.source.TileWMS({url:'http://onmoon.jpl.nasa.gov/wms.cgi',
//                                  projection: ol.proj.get(DEFAULT_COORD_SYSTEM),
//                                  params: {'LAYERS': 'msa', 
//                                            'TILED': true,
//                                            'transparent': 'TRUE',
//                                            'SRS': 'IAU2000:30120',
//                                            'version': '1.0.0'}
//                                  })
//       }),
//         new ol.layer.Tile( {
//             name: "asu_south_pole_basemap",
//           extent: [-992800, -992800, 992800, 992800],
//               source: new ol.source.TileWMS({url:'http://webmap.lroc.asu.edu/', 
//                                      params: {'projection': 'SP_STEREO', 
//                                             'c_lon': 0,
//                                             'c_lat': 0,
//                                             'x':0, 
//                                             'y':0, 
//                                             'resolution':3474.8,
//                                             'srs':'IAU2000:30120',
//                                             'version': '1.0.0',
//                                             'LAYERS':'luna_wac_global'},
//                                            projection: ol.proj.get(DEFAULT_COORD_SYSTEM)
//                                     })
//       })
        new ol.layer.Tile( {
            name: "asu_north_pole_basemap",
            extent: [-992800, -992800, 992800, 992800],
            source: new ol.source.TileWMS({url:'https://webmap.lroc.asu.edu/',
					   params: {'FORMAT': 'image/png',
						    'STYLES': ' ',
						    'PROJECTION': 'NP_STEREO',
						    'C_LON': 0,
						    'C_LAT': 0,
						    'X':0,
						    'Y':0,
						    'RESOLUTION':3474.8,
						    'SRS':'IAU2000:30118',
						    'VERSION': '1.1.1',
						    'LAYERS':'luna_wac_global'},
					   projection: ol.proj.get(DEFAULT_COORD_SYSTEM)
					  })
        }),
        // new ol.layer.Tile( {
        //     name: "erlanger_tile",
        //     extent: [25932, -99762, 68241, -58081],
        //     minResolution: 0,
        //     maxResolution: 256,
        //     /* You are required to use a TileImage instead of ol.source.XYZ
        //      * IF you have a projection where the origin is in the lower left AND you have a tileGrid
        //      * http://openlayers.org/en/v3.10.1/apidoc/ol.source.XYZ.html
        //      * */
        //     source: new ol.source.TileImage({
        //         projection: ol.proj.get(DEFAULT_COORD_SYSTEM),
        //         tileGrid: new ol.tilegrid.TileGrid({
        //             extent: [25932, -99762, 68241, -58081],
        //             minZoom: 0,
        //             origin: [25932, -99762],
        //             resolutions: [256, 128, 64, 32, 16, 8, 4, 2, 1],
        //             tileSize: [256, 256]
        //         }),
        //         tileUrlFunction: function(coordinate) {
        //             if (coordinate === null) {
        //                 return undefined;
        //             }
        //             var z = coordinate[0];
        //             var x = coordinate[1];
        //             var y = coordinate[2];
        //             var url = '/data/xgds_map_server/geoTiff/erlanger-tile/' +z +'/' + x +'/' + y +'.png';
        //             return url;
        //         }
        //     })
        // }),
        new ol.layer.Vector( {
            name: "erlanger_tile_bounds",
            source: new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.LineString([[25932, -99762], // lower left
						      [68241, -99762], // upper left
						      [68241, -58081], // upper right
						      [25932, -58081], // lower right
						      [25932, -99762]])
                })]
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    width: 4
                })
            })
        })
    ]

}
