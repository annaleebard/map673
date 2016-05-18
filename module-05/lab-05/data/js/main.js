L.mapbox.accessToken = 'pk.eyJ1Ijoicmdkb25vaHVlIiwiYSI6Im5Ua3F4UzgifQ.PClcVzU5OUj17kuxqsY_Dg';

var map = L.mapbox.map('map', 'mapbox.dark', {
    center: [-.23, 37.8],
    zoom: 7,
    minZoom: 2,
    maxZoom: 20,
    maxBounds: L.latLngBounds([-6.22, 27.72], [5.76, 47.83])
});


var scaleFactor = .6,
    dataLayer; // define globals explicitly

omnivore.csv('data/Kenya_HIV_Gender.csv')
    .on('ready', function (e) {


      $.getJSON("data/health_spending_county.json", function (data) {


          drawMap(e.target.toGeoJSON(), data);
      });

        // when this is fired, the layer
        // is done being initialized
    })
    .on('error', function (e) {
        // fired if the layer can't be loaded over AJAX
        // or can't be parsed
    })


function drawMap(hivData, countyData) {

    dataLayer = L.geoJson(countyData, {
        style: getStyle
    }).addTo(map).bringToBack();

    var women = L.geoJson(hivData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: '#ff8f25',
                opacity: 1,
                weight: 2.5,
                fillOpacity: 0,


            });
        }
    }).addTo(map);;
    var men = L.geoJson(hivData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: '#7d1404',
                fillColor: '#7d1404',
                opacity: 1,
                weight: 2.5,
                fillOpacity: 0,

            });
        }
    }).addTo(map);

    updateSymbols(women, men, 1);
    //			sequenceUI(women, men);

}

function updateSymbols(women, men) {

    var allRadii = [];
    var radius;

    women.eachLayer(function (layer) {
        radius = calcRadius(layer.feature.properties.wom_hiv);
        layer.setRadius(radius)
        allRadii.push(radius)

    });
    men.eachLayer(function (layer) {
        radius = calcRadius(layer.feature.properties.men_hiv);
        layer.setRadius(radius)
        allRadii.push(radius)
    });

    //drawLegend(allRadii);
    infoWindow(women, men);
}

function calcRadius(val) {
    var radius = Math.sqrt(val / Math.PI);
    return radius * 15;
}

function infoWindow(women, men) {

        var info = $('#info');

        men.on('mouseover', function (e) {

            var props = e.layer.feature.properties;
            console.log(props);
            info.show();
            $('#info p:first-child span').text(props.County);
            $('.women span:first-child').text('HIV rate ');
            $('.men span:first-child').text('HIV rate ');

            $('.women span:last-child').text(props['wom_hiv'] + "%");
            $('.men span:last-child').text(props['men_hiv'] + "%");

            e.layer.setStyle({
                fillOpacity: .4
            });

        });

        men.on('mouseout', function (e) {
            info.hide();
            e.layer.setStyle({
                fillOpacity: 0
            });
        });

        women.on('mouseover', function (e) {

            var props = e.layer.feature.properties;
            //console.log(props);
            info.show();
            $('#info p:first-child span').text(props.COUNTY);
            $('.women span:first-child').text('HIV rate ');
            $('.men span:first-child').text('HIV rate ');

            $('.women span:last-child').text(props['wom_hiv'] + "%");
            $('.men span:last-child').text(props['men_hiv'] + "%");

            e.layer.setStyle({
                fillOpacity: .4
            });

        });

        women.on('mouseout', function (e) {
            info.hide();
            e.layer.setStyle({
                fillOpacity: 0
            });
        });


        $(document).mousemove(function (e) {
            info.css({
                "left": e.pageX + 6,
                "top": e.pageY - info.height() - 15
            });

            if (info.offset().top < 4) {
                info.css({
                    "top": e.pageY + 15
                })
            }
            if (info.offset().left + info.width() >= $(window).width() - 40) {
                info.css({
                    "left": e.pageX - info.width() - 30
                })
            }
        });
    }
    //------------------------------------------------------

function getStyle(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.spendingpp)

    };
    console.log(feature.properties);
}

function getColor(d) {
    return d > 1510 ? '#047d50' :
        d > 876 ? '#6c9980' :
        d > 662 ? '#9cbba8' :
        d > 517 ? '#cddcd3' :
        d > 0 ? '#ffffff' :
        '#ffffff';
}