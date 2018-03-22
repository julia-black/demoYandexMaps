$(document).ready(function () {
    ymaps.ready(init);
    var myMap;
    var myPlacemark;
    var myPlacemarks = [];
    var multiRoute;
    var objectManager;

    function download(file) {
        let myFile = new File([file], {'type': 'json'}),
            link = document.createElement("a"),
            url = window.URL.createObjectURL(myFile);
        link.download = "text.json";
        link.href = url;
        link.click();
    }

    function clickSaveRoute() {

        var route = {
            type: 'FeatureCollection',
            features: []
        };
        for (let i = 0; i < myPlacemarks.length; i++) {
            route.features.push({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [
                        myPlacemarks[i].geometry.getCoordinates(0), myPlacemarks[i].geometry.getCoordinates(1),
                    ]
                },
                properties: {
                    balloonContent: '---',
                    hintContent: '-'
                },
                options: {
                    preset: 'islands#violetDotIcon'
                }
            });
        }
        if (myPlacemarks.length > 1) {
            var str = JSON.stringify(route);
            console.log(str);
            route = JSON.parse(str);
            console.log(route);
        }
        download(str);
    }

    function addNewPlacemark() {
        var searchAddress = "Россия, Саратов";

        ymaps.geocode(searchAddress).then(
            function (res) {
                var firstGeoObject = res.geoObjects.get(0),
                    coordinates = firstGeoObject.geometry.getCoordinates();

                myPlacemark = new ymaps.Placemark(coordinates, {}, {draggable: true});

                myPlacemarks.push(myPlacemark);

                myMap.geoObjects.add(myPlacemark);

                myPlacemark.events.add('dragend', function (e) {
                    var placemarkCoordinates = e.get('target').geometry.getCoordinates();

                    ymaps.geocode(placemarkCoordinates)
                        .then(function (resAddress) {
                            //   alert(placemarkCoordinates + ' ' + resAddress.geoObjects.get(0).properties.get('text'));
                        });

                    if (myPlacemarks.length > 1) {
                        if (multiRoute) {
                            myMap.geoObjects.remove(multiRoute);
                        }
                        var placemarks = [];
                        for (let i = 0; i < myPlacemarks.length; i++) {
                            placemarks.push(myPlacemarks[i].geometry.getCoordinates());
                        }
                        // alert(placemarks);

                        multiRoute = new ymaps.multiRouter.MultiRoute({
                            referencePoints: placemarks,
                            params: {
                                //Тип маршрутизации - пешеходная маршрутизация.
                                routingMode: 'pedestrian'
                            }
                        }, {
                            editorDrawOver: false,
                            wayPointDraggable: true,
                            viaPointDraggable: true,
                            routeStrokeColor: "000088",
                            routeActiveStrokeColor: "ff0000",
                            pinIconFillColor: "ff0000",
                            boundsAutoApply: true,
                            zoomMargin: 30
                        });
                        myMap.geoObjects.remove(myPlacemarks);
                        myMap.geoObjects.add(multiRoute);
                        myMap.geoObjects.remove(myPlacemark);
                    }
                });
            }
        );

    }

    function clickAddPlacemark() {
        addNewPlacemark();
    }

    //загрузить интересные места из json
    function clickImportPlacemarks() {
        ymaps.ready().done(function (ym) {
            jQuery.getJSON('data.json', function (json) {

                var geoObjects = ym.geoQuery(json)
                    .addToMap(myMap)
                    .applyBoundsToMap(myMap, {
                        checkZoomRange: true
                    });
            });
        });
    }

    //загрузить маршрут из json
    function clickImportRoute() {
        ymaps.ready().done(function (ym) {
            jQuery.getJSON('route.json', function (json) {
                let geoObjects = ym.geoQuery(json);
                myPlacemarks = geoObjects._objects;
                if (myPlacemarks.length > 1) {
                    if (multiRoute) {
                        myMap.geoObjects.remove(multiRoute);
                    }
                    var placemarks = [];
                    for (let i = 0; i < myPlacemarks.length; i++) {
                        placemarks.push(myPlacemarks[i].geometry.getCoordinates());
                    }
                    multiRoute = new ymaps.multiRouter.MultiRoute({
                        referencePoints: placemarks,
                        params: {
                            routingMode: 'pedestrian'
                        }
                    }, {
                        editorDrawOver: false,
                        wayPointDraggable: false,
                        viaPointDraggable: false,
                        routeActivePedestrianSegmentStrokeStyle: "solid",
                        routeActivePedestrianSegmentStrokeColor: "#00CDCD",
                        pinIconFillColor: "ff0000",
                        balloonContentBodyLayout: ymaps.templateLayoutFactory.createClass('$[properties.humanJamsTime]'),
                        boundsAutoApply: true,
                        zoomMargin: 30
                    });

                    myMap.geoObjects.remove(myPlacemarks);
                    myMap.geoObjects.add(multiRoute);
                    myMap.geoObjects.remove(myPlacemark);
                }
            });
        });
    }

    function init() {
        myMap = new ymaps.Map("map", {
            center: [51.533970, 46.021121],
            zoom: 14
        });

        var htmlBalloon = '<div class="popup">';
        htmlBalloon += '<img src="circus.jpg" alt="" />';
        htmlBalloon += '<div class="popup-text">';
        htmlBalloon += '<p>Цирк им. Братьев Никитиных</p>';
        htmlBalloon += '<p>Достопримечательность г.Саратова</p>';
        htmlBalloon += '</div>';
        htmlBalloon += '</div>';

        var placemark = new ymaps.Placemark([51.533970, 46.021121], {
            balloonContent: htmlBalloon,

        }, {
            balloonCloseButton: true,
            iconLayout: 'default#image',
            iconImageHref: 'http://blog.karmanov.ws/files/APIYaMaps1/min_marker.png',
            iconImageSize: [40, 51],
            iconImageOffset: [-20, -47],
            balloonShadow: true,
        });

        var geoObjectsCollection = new ymaps.GeoObjectCollection();
        geoObjectsCollection.add(placemark);
        myMap.geoObjects.add(geoObjectsCollection);

        $(".add-placemark").on('click', clickAddPlacemark);
        $(".save-rout").on('click', clickSaveRoute);
        $(".import-rout").on('click', clickImportRoute);
        $(".import-placemarks").on('click', clickImportPlacemarks);

        // Спозиционируем карту так, чтобы на ней были видны все объекты, если их больше 1
        if (geoObjectsCollection.getLength() > 1) {
            myMap.setBounds(geoObjectsCollection.getBounds());
        }

        var event = {
            title: "Конференция",
            date: "сегодня"
        };
    }
});