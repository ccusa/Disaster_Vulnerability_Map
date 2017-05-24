
function updateLegend(id,name) {
  mapLayers.forEach(function(layer) {
    if (layer[0].id === id) {
      $('.legend-block').remove()

      let stops = layer[0].paint['fill-color'].stops
      let stopsLength = stops.length - 1

      stops.forEach(function(stop, idx) {
        let number = stop[0];
        let color = stop[1];

        console.log(id);
        console.log(name);
        

      if (id=='tract') {
          d3.select('.legend-title').text('Total Flags')
        }else{
        d3.select('.legend-title').text(name);}

        if (idx == stopsLength && id=='tract') {
          number = stop[0] + '+'
        }

        let div = "<div class='legend-block'><span class='legend-key' style='background-color: "
            + color + "';> </span><span class='legend-number'>" + number +
            "</span></div>"

        $('#legend').append(div)

      })
    }
  })
}
