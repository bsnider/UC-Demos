var app, mapView, searchWidgetNav, searchWidgetPanel, graphicsLayer, graphicsLayerGround;

require(["esri/Map",
  "esri/Basemap",
  "esri/views/MapView",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Search",
  "esri/core/watchUtils",
  "dojo/query",

  "esri/layers/GraphicsLayer",
  "esri/Graphic",
  "esri/geometry/Point",
  "esri/geometry/Polyline",
  "esri/geometry/Polygon",

  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/ObjectSymbol3DLayer",
  "esri/symbols/PointSymbol3D",
  "esri/symbols/PathSymbol3DLayer",
  "esri/symbols/LineSymbol3D",

  "dojo/domReady!"
], function(Map, Basemap, MapView, SceneView, FeatureLayer, Search, watchUtils, query,
  GraphicsLayer, Graphic, Point, Polyline, Polygon,
  SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, ObjectSymbol3DLayer, PointSymbol3D, PathSymbol3DLayer, LineSymbol3D) {
  $(document).ready(function() {
    app = {
      //scale: 500000,
      center: [-84.18151858651342, 43.680183989775934, -91.04604789894074],
      camera: { // autocasts as new Camera()
        position: { // autocasts as new Point()
          longitude: -79.201,
          latitude: 36.245,
          z: 1344220.082
        },
        heading: 334.021,
        tilt: 33.321
      },

      basemap: "streets",
      viewPadding: {
        bottom: 0
      },
      ground: "world-elevation",
      uiPadding: {
        bottom: 30
      },
      mapView: null,
      sceneView: null,
      activeView: null
    };

    // MAP VIEW //////////////////////////////////////////////////////////////////////////
    var map = new Map({
      basemap: app.basemap
    });
    app.mapView = new MapView({
      container: "mapViewDiv",
      map: map,
      scale: app.scale,
      center: app.center,
      padding: app.viewPadding,
      ui: {
        components: ["zoom", "compass", "attribution"],
        padding: app.uiPadding,
        position: "top-right"
      }
    });

    // SCENE VIEW //////////////////////////////////////////////////////////////////////////
    var mapScene = new Map({
      basemap: app.basemap,
      ground: app.ground
    });
    app.sceneView = new SceneView({
      container: "sceneViewDiv",
      map: mapScene,
      scale: app.scale,
      center: app.center,
      padding: app.viewPadding,
      camera: app.camera,
      ui: {
        components: ["zoom", "compass", "attribution", "home"],
        padding: app.uiPadding,
        position: "top-right"
      },
      visible: true
    });

    app.activeView = app.sceneView;

    // var featureLayer = new FeatureLayer({
    //   url: "http://services.arcgis.com/Wl7Y1m92PbjtJs5n/arcgis/rest/services/airplane_poly/FeatureServer/0" //,
    //     //popupEnabled: false
    // });
    // mapScene.add(featureLayer);

    app.sceneView.on("click", function(event) {
      graphicsLayer.popupEnabled = false;
      ``
      // The event object contains the mapPoint and screenPoint of the location
      // on the screen that was clicked.
      console.log("screen point", event.screenPoint);
      console.log("map point", event.mapPoint);
      console.log("camera", app.sceneView.camera);
      console.log("center", app.sceneView.center);
    });

    /*********************
     * Add graphics layer for extent polygon
     *********************/

    graphicsLayerGround = new GraphicsLayer({
      elevationInfo: {
        mode: "on-the-ground"
      },
      popupEnabled: false
    });
    mapScene.add(graphicsLayerGround);

    /*********************
     * Add graphics layer for non-draped features
     *********************/

    graphicsLayer = new GraphicsLayer({
      elevationInfo: {
        mode: "relative-to-ground"
      },
      popupEnabled: false
    });
    mapScene.add(graphicsLayer);

    /***************************
     * Add a 3D polygon graphic for the extent
     ***************************/

    var polygon = new Polygon([
      [-100.04175125121228, 44.42641385544636], //top left
      [-76.74864706950858, 53.96407946008397], //top right
      [-75.07804047297067, 43.077201852094085], //bottom right
      [-88.28055079532774, 37.89549892511324], //bottom left
      [-100.04175125121228, 44.42641385544636] //top left
    ]);
    var fillSymbol = new SimpleFillSymbol({
      color: [227, 139, 79, 0.5],
      outline: { // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 1
      }
    });
    var polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol
    });

    graphicsLayerGround.add(polygonGraphic);

    /*************************
     * Add center point symbol
     *************************/
    var centerSymbol = new PointSymbol3D({
      symbolLayers: [new ObjectSymbol3DLayer({
        resource: {
          primitive: "sphere" // cube, cone, diamond, tetrahedron, cylinder
        },
        material: {
          color: [120,229,52,.5]
        },
        height: 40000,
        width: 40000
      })]
    });
    var centerPoint = new Point({
      x: -84.18151858651342,
      y: 43.680183989775934,
      z: 0
    });
    var centerGraphic = new Graphic({
      geometry: centerPoint,
      symbol: centerSymbol
    });
    graphicsLayer.add(centerGraphic);

    /****************************
     * Add camera ground xy point graphic
     ****************************/

     var camXYSymbol = new PointSymbol3D({
       symbolLayers: [new ObjectSymbol3DLayer({
         resource: {
           primitive: "sphere" // cube, cone, diamond, tetrahedron, cylinder
         },
         material: {
           color: [0, 169, 230, .6] // blue
         },
         height: 1000000,
         width: 20000
       })]
     });
    var camXYPoint = new Point(
      [-79.27943956844277, 36.472007963105845, 0]
    );
    var camXYGraphic = new Graphic({
      geometry: camXYPoint,
      symbol: camXYSymbol
    });
    //graphicsLayer.add(camHeightGraphic);
    //graphicsLayer.add(camFocusGraphic);

    /****************************
     * Add camera focus polyline graphic
     ****************************/

    var camFocusLine = new Polyline([
      [-84.18151858651342, 43.680183989775934, 0],
      [-79.27943956844277, 36.472007963105845, 1293757.1773598082]
    ]);
    var camFocusSymbol = new LineSymbol3D({
      symbolLayers: [new PathSymbol3DLayer({
        size: 5000, // 20 meters in diameter
        material: {
          color: [120,229,52,.8]
        }
      })]
    });
    var camFocusGraphic = new Graphic({
      geometry: camFocusLine,
      symbol: camFocusSymbol
    });
    //graphicsLayer.add(camFocusGraphic);

    /****************************
     * Add camera lens polyline graphic
     ****************************/
    var lensLine = new Polyline([
      [-79.27943956844277, 36.472007963105845, 1293757.1773598082],
      [-79.15943956844277, 36.272007963105845, 1336757.1773598082]
    ]);
    var lensSymbol = new LineSymbol3D({
      symbolLayers: [new PathSymbol3DLayer({
        size: 20000, // 20 meters in diameter
        material: {
          color: [0, 169, 230]
        }
      })]
    });
    var lensGraphic = new Graphic({
      geometry: lensLine,
      symbol: lensSymbol
    });

    var camLine = new Polyline([
      [-79.15943956844277, 36.272007963105845, 1336757.1773598082],
      [-78.67943956844277, 35.472007963105845, 1513757.1773598082]
    ]);
    var camSymbol = new LineSymbol3D({
      symbolLayers: [new PathSymbol3DLayer({
        size: 50000, // 20 meters in diameter
        material: {
          color: [0, 169, 230]
        }
      })]
    });
    var camGraphic = new Graphic({
      geometry: camLine,
      symbol: camSymbol
    });
    //graphicsLayer.add(camLensGraphic);
    //graphicsLayer.add(camLensGraphic2);

    // EXECUTE AFTER MAP INIT //////////////////////////////////////////////////////////////////////////
    app.activeView.then(function() {
      graphicsLayer.popupEnabled = false;
      app.sceneView.popup.visible = false;
      app.activeView.ui.move("zoom", "top-right");
      app.activeView.ui.move("compass", "top-right");

      searchWidgetNav = createSearchWidget("searchNavDiv");
      searchWidgetPanel = createSearchWidget("searchPanelDiv");
      show3DParams();
      app.sceneView.watch('camera', function() {
        //displays the map center and camera values
        show3DParams();
      });

      $("#showElevation").click(function() {
        console.log("click");
        updateElevation();
      });

      $("#zoomOutBookmark").click(function() {
        console.log("click");
        app.sceneView.goTo({
          position: { // autocasts as new Point()
            longitude: -56.39854415444632,
            latitude: 34.74886609921763,
            z: 3361860.691838715
          },
          heading: 293.4916819967126,
          tilt: 36.290548090191386
        });

        graphicsLayer.add(camXYGraphic);
        graphicsLayer.add(camFocusGraphic);
        graphicsLayer.add(lensGraphic);
        graphicsLayer.add(camGraphic);
      });

      $("#zoomInBookmark").click(function() {
        console.log("click");
        //app.sceneView.camera;
        app.sceneView.goTo({
          position: { // autocasts as new Point()
            longitude: -79.201,
            latitude: 36.245,
            z: 1344220.082
          },
          heading: 334.021,
          tilt: 33.321
        }).then(function() {
          var cam = app.sceneView.camera.clone();
          cam.position.longitude = -79.201;
          cam.position.latitude = 36.245;
          cam.position.z = 1344220.082;
          cam.heading = 334.021;
          cam.tilt = 33.321;
          app.sceneView.camera = cam;
        });

        graphicsLayer.remove(camXYGraphic);
        graphicsLayer.remove(camFocusGraphic);
        graphicsLayer.remove(lensGraphic);
        graphicsLayer.remove(camGraphic);
      });

      function updateElevation(ev) {
        console.log("click2");
        // Turn ground layers visibility on/off
        app.sceneView.map.ground.layers.forEach(function(layer) {
          layer.visible = layer.visible ? false : true;
          console.log(layer.visible);
          //layer.visible = ev.target.checked;
        });
      }
    });

    // CREATE SEARCH WIDGET //////////////////////////////////////////////////////////////////////////
    function createSearchWidget(parentId) {
      var search = new Search({
        viewModel: {
          view: app.activeView,
          highlightEnabled: false,
          popupEnabled: false,
          showPopupOnSelect: false
        }
      }, parentId);
      search.startup();
      return search;
    }

    // TOGGLE BETWEEN 2D AND 3D //////////////////////////////////////////////////////////////////////////
    function syncViews(fromView, toView) {
      function sync() {
        toView.set({
          viewpoint: fromView.viewpoint
        });
      }
      if (toView.isInstanceOf(SceneView) && !toView.ready) {
        watchUtils.whenTrueOnce(toView, "ready").then(function(isReady) {
          if (isReady) {
            sync();
          }
        });
      } else {
        sync();
      }
    }

    query("nav li a[data-toggle='tab']").on("click", function(e) {
      // Sync views
      if (e.target.text === "Map") {
        syncViews(app.sceneView, app.mapView);
        app.activeView = app.mapView;
      } else {
        syncViews(app.mapView, app.sceneView);
        app.activeView = app.sceneView;
      }
      // Set search
      searchWidgetNav.viewModel.view = app.activeView;
      searchWidgetPanel.viewModel.view = app.activeView;
    });

    // CHANGE BASEMAP //////////////////////////////////////////////////////////////////////////
    query("#selectBasemapPanel").on("change", function(e) {
      //mapView.map.basemap = e.target.options[e.target.selectedIndex].dataset.vector;
      app.mapView.map.basemap = e.target.value;
      app.sceneView.map.basemap = e.target.value;
    });

    // REFRESH CENTER //////////////////////////////////////////////////////////////////////////

    // CENTER LAT LONG
    $("#centerLatLongRefresh").click(function(evt) {
      var inputRef = $("#" + evt.currentTarget.id).parent().siblings()[0].id;
      var coords = $("#" + inputRef).val();
      centerLatLongRefresh(coords);
    });

    $('#centerLatLong').keypress(function(e) {
      if (e.which == 13) { //Enter key pressed
        var coords = $("#centerLatLong").val();
        centerLatLongRefresh(coords);
      }
    });

    function centerLatLongRefresh(value) {
      var coordsArray = value.split(', ').map(Number);
      app.sceneView.goTo(coordsArray)
        .then(function() {
          console.log(app.sceneView.center);
        });
    }

    // CENTER Z
    $("#centerZeeRefresh").click(function(evt) {
      var inputRef = $("#" + evt.currentTarget.id).parent().siblings()[0].id;
      var value = $("#" + inputRef).val();
      centerZeeRefresh(value);
    });

    $('#centerZVal').keypress(function(e) {
      if (e.which == 13) { //Enter key pressed
        var value = $("#centerZVal").val();
        centerZeeRefresh(value);
      }
    });

    function centerZeeRefresh(value) {
      var newCenter = app.sceneView.center.clone();
      newCenter.z = value;

      app.sceneView.goTo({
          center: newCenter,
          //ensure camera position is maintained
          position: app.sceneView.camera.position
        })
        .then(function() {
          console.log(app.sceneView.center);
        });
    }

    // REFRESH CAMERA //////////////////////////////////////////////////////////////////////////

    //CAMERA HEADING
    $("#cameraHeadingRefresh").click(function(evt) {
      var inputRef = $("#" + evt.currentTarget.id).parent().siblings()[0].id;
      var value = $("#" + inputRef).val();
      cameraHeading(value)
    });

    $('#cameraHeading').keypress(function(e) {
      if (e.which == 13) { //Enter key pressed
        var value = $("#cameraHeading").val();
        cameraHeading(value)
      }
    });

    function cameraHeading(value) {
      app.sceneView.goTo({
          heading: value,
          //ensure tilt is maintained
          tilt: app.sceneView.camera.tilt
        })
        .then(function() {
          console.log(app.sceneView.camera);
        });
    }

    // CAMERA TILT
    $("#cameraTiltRefresh").click(function(evt) {
      var inputRef = $("#" + evt.currentTarget.id).parent().siblings()[0].id;
      var value = $("#" + inputRef).val();
      cameraTiltRefresh(value);
    });

    $('#cameraTilt').keypress(function(e) {
      if (e.which == 13) { //Enter key pressed
        var value = $("#cameraTilt").val();
        cameraTiltRefresh(value);
      }
    });

    function cameraTiltRefresh(value) {
      app.sceneView.goTo({
          tilt: value
        })
        .then(function() {
          console.log(app.sceneView.camera);
        });
    }

    // CAMERA LAT LONG
    $("#cameraLatLongRefresh").click(function(evt) {
      var inputRef = $("#" + evt.currentTarget.id).parent().siblings()[0].id;
      var coords = $("#" + inputRef).val();
      cameraLatLongRefresh(coords);
    });

    $('#cameraLatLong').keypress(function(e) {
      if (e.which == 13) { //Enter key pressed
        var coords = $("#cameraLatLong").val();
        cameraLatLongRefresh(coords);
      }
    });

    function cameraLatLongRefresh(value) {
      var coordsArray = value.split(', ').map(Number);
      var cam = app.sceneView.camera.clone();
      cam.position.longitude = coordsArray[0];
      cam.position.latitude = coordsArray[1];
      app.sceneView.goTo({
          //ensure center is maintained
          center: app.sceneView.center,
          position: cam.position
        })
        .then(function() {
          console.log(app.sceneView.camera);
        });
    }

    // CAMERA Z
    $("#cameraZRefresh").click(function(evt) {
      var inputRef = $("#" + evt.currentTarget.id).parent().siblings()[0].id;
      var value = $("#" + inputRef).val();

      app.sceneView.goTo({
          tilt: value
        })
        .then(function() {
          console.log(app.sceneView.camera);
        });
    });

    $('#cameraZVal').keypress(function(e) {
      if (e.which == 13) { //Enter key pressed
        var value = $("#cameraZVal").val();
        cameraZRefresh(value);
      }
    });

    function cameraZRefresh(value) {
      var coordsArray = value.split(', ').map(Number);
      var cam = app.sceneView.camera.clone();
      cam.position.z = value;
      app.sceneView.goTo({
          //ensure center is maintained
          center: app.sceneView.center,
          position: cam.position
        })
        .then(function() {
          console.log(app.sceneView.camera);
        });
    }

    // COPY TEXT //////////////////////////////////////////////////////////////////////////
    $(".copyBtn").click(function(evt) {
      var inputRef = $("#" + evt.currentTarget.id).parent().siblings()[0];
      window.getSelection().removeAllRanges();
      inputRef.select();
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      setTimeout(function() {
        $(copyModal).modal('toggle');
      }, 1000);
    });

    // GET MAP PARAMS //////////////////////////////////////////////////////////////////////////
    function show3DParams(evt) {
      //center text
      var latCoord = app.sceneView.center.latitude.toFixed(3);
      var longCoord = app.sceneView.center.longitude.toFixed(3);
      var centerCoords = longCoord + ", " + latCoord;
      $("#centerLatLong").val(centerCoords);

      var zVal = app.sceneView.center.z.toFixed(3);
      $("#centerZVal").val(zVal);

      //camera text
      var fov = app.sceneView.camera.fov.toFixed(3);
      $("#cameraFOV").val(fov);

      var heading = app.sceneView.camera.heading.toFixed(3);
      $("#cameraHeading").val(heading);

      var tilt = app.sceneView.camera.tilt.toFixed(3);
      $("#cameraTilt").val(tilt);

      var camLatCoord = app.sceneView.camera.position.latitude.toFixed(3);
      var camLongCoord = app.sceneView.camera.position.longitude.toFixed(3);
      var camCoords = camLongCoord + ", " + camLatCoord;
      $("#cameraLatLong").val(camCoords);

      var camZVal = app.sceneView.camera.position.z.toFixed(3);
      $("#cameraZVal").val(camZVal);
    }

  });
});
