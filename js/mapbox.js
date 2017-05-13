mapboxgl.accessToken = 'pk.eyJ1Ijoicm1jYXJkZXIiLCJhIjoiY2lqM2lwdHdzMDA2MHRwa25sdm44NmU5MyJ9.nQY5yF8l0eYk2jhQ1koy9g';

const toggleableLayerIds = [
  'Social Vulnerability - Overall',
  'Socioeconomic Status',
  'Household Composition & Disability',
  'Housing & Transportation',
  'Total Natural Hazard Risk',
  'Earthquake Risk',
  'Tornado Risk',
  'Hail Risk',
  'Hurricane Risk',
  'Flood Risk',
  'Wildfire Risk'
];

const toggleableLayersSocial = [
  { ids: ['tract', 'county'], name: 'Social Vulnerability - Overall'},
  { ids: ['tract-socio','county-socio'], name: 'Socioeconomic Vulnerability'},
  { ids: ['tract-household','county-household'], name: 'Household Composition and Disability Vulnerability'},
  { ids: ['tract-minority','county-minority'], name: 'Minority Status and Language Vulnerability'},
  { ids: ['tract-household','county-housing'], name: 'Housing and Transportation Vulnerability'},
];

const toggleableLayersHazard = [
  { ids: ['county-hazard'], name: 'Overall Hazard Risk'},
  { ids: ['county-hurricane'], name: 'Hurricane Risk'},
  { ids: ['county-flood'], name: 'Flood Risk'},
  { ids: ['county-earthquake'], name: 'Earthquake Risk'},
  { ids: ['county-wildfire'], name: 'Wildfire Risk'},
  { ids: ['county-tornado'], name: 'Tornado Risk'},
  { ids: ['county-hail'], name: 'Hail Risk'},
];

function addCustomLayers(map) {

  mapSources.forEach(function(source) {
    let id = source[0];
    let obj = source[1];
    map.addSource(id, obj)
  });

  mapLayers.forEach(function(layer) {
    let obj = layer[0];
    let label = layer[1];
    map.addLayer(obj, label);
  });

}


function hideAllLayers() {
  toggleableLayersSocial.forEach(function(layer, i) {
    var link = menusocial.children[i];
    link.className = '';
    layer.ids.forEach(function(layerId) {
      map.setLayoutProperty(layerId, 'visibility', 'none');
    });
  });
  toggleableLayersHazard.forEach(function(layer, i) {
    var link = menuhazard.children[i];
    link.className = '';
    layer.ids.forEach(function(layerId) {
      map.setLayoutProperty(layerId, 'visibility', 'none');
    });
  });
}

function setOnLinkClickHandler(link, layer) {
  link.onclick = function (e) {
    e.preventDefault();
    e.stopPropagation();
    hideAllLayers();
    this.className = 'active';
    layer.ids.forEach(function(layerId) {
      map.setLayoutProperty(layerId, 'visibility', 'visible');
    });

    updateLegend(layer.ids[0])
    updateSidebarTitle(layer.name)
  };
}

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  zoom: 14,
  types: 'region,postcode,district,place',
  country: 'US'
});

var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/rmcarder/cizru0urw00252ro740x73cea',
  zoom: 2,
  hash:true,
  center: [-76.92, 38.9072],
  minZoom: 3,
  // We only need to preserve drawing buffer if we implement printing
  // otherwise it is a performance drawback
  // preserveDrawingBuffer: true
  attributionControl: false
});

function addLayerNav(map) {

  var menusocial = document.getElementById('menusocial');
  var menuhazard = document.getElementById('menuhazard');

  toggleableLayersSocial.forEach(function(layer) {
    var link = document.createElement('a');
    link.href = '#';
    link.textContent = layer.name;

    setOnLinkClickHandler(link, layer);

    menusocial.appendChild(link);
  });

  toggleableLayersHazard.forEach(function(layer) {
    var link = document.createElement('a');
    link.href = '#';
    link.textContent = layer.name;

    setOnLinkClickHandler(link, layer);

    menuhazard.appendChild(link);
  });
}

//map.addControl(geocoder, 'top-left');

d3.select('#search')
  .node()
  .appendChild(geocoder.onAdd(map));


map.on('load', function() {
  console.log(map)
  addCustomLayers(map);
  addLayerNav(map);


var lastFIPS=0;
  map.on('mousemove', function (e) {
    var county = map.queryRenderedFeatures(e.point, {
       layers: ['county','county-socio','county-housing','county-household','county-minority',
              'county-hazard','county-hurricane','county-flood', 'county-earthquake','county-wildfire',
              'county-tornado','county-hail']
    });
    var tract = map.queryRenderedFeatures(e.point, {
      layers: ['tract','tract-socio','tract-household','tract-housing','tract-minority']
    });

    if (county.length > 0 && map.getZoom() < 8.0) {
      map.getSource('highlight').setData({
				"type": "FeatureCollection",
				"features": county
      });
      if (county[0].properties.FIPS !== lastFIPS) {
        // console.log('Select county', county[0].properties.FIPS);
        updateSidebar(county[0].properties);
        lastFIPS = county[0].properties.FIPS;
      }
    }
    else if (tract.length>0 && map.getZoom() >= 8.0) {
      map.getSource('highlight').setData({
				"type": "FeatureCollection",
				"features": tract
      });
      if (tract[0].properties.FIPS !== lastFIPS) {
        // console.log('Select tract', tract[0].properties.FIPS);
        updateSidebar(tract[0].properties);
        lastFIPS = tract[0].properties.FIPS;
      }
    } else {
      map.getCanvas().style.cursor = 'default';
    }
  });
});
