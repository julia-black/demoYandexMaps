ymaps.ready(init);

function init() {
    var myMap;

    myMap = new ymaps.Map("map", {
        center: [51.533970, 46.021121],
        zoom: 17
    });

    var htmlBalloon = '<div class="popup">';
    htmlBalloon += '<img src="circus.jpg" alt="" />';
    htmlBalloon += '<div class="popup-text">';
    htmlBalloon += '<p>Цирк им. Братьев Никитиных</p>';
    htmlBalloon += '<p>Достопримечательность г.Саратова</p>';
    htmlBalloon += '</div>';
    htmlBalloon += '</div>';

    var htmlBalloon1 = '<div class="popup">';
    htmlBalloon1 += '<img src="circus.jpg" alt="" />';
    htmlBalloon1 += '<div class="popup-text">';
    htmlBalloon1 += '<p>Цирк им. Братьев Никитиных</p>';
    htmlBalloon1 += '<p>Достопримечательность г.Саратова</p>';
    htmlBalloon1 += '</div>';
    htmlBalloon1 += '</div>';


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

    var placemark1 = new ymaps.Placemark([51.633970, 46.021121], {
        balloonContent: htmlBalloon1,

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
    geoObjectsCollection.add(placemark1);

    // Добавляем коллекцию геообъектов на карту
    myMap.geoObjects.add(geoObjectsCollection);

    // Спозиционируем карту так, чтобы на ней были видны все объекты.
    if(geoObjectsCollection.getLength() > 1){
        myMap.setBounds(geoObjectsCollection.getBounds());
    }
}