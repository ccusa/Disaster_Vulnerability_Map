



var Donut=function(el,variable,iconurl){
 var donut=this;

var ele = features.offsetWidth;
/* Below is the width of ele */

console.log(ele);

donut.variable=variable;

donut.tau = 2 * Math.PI; // http://tauday.com/tau-manifesto

// An arc function with all values bound except the endAngle. So, to compute an
// SVG path string for a given angle, we pass an object with an endAngle
// property to the `arc` function, and it will return the corresponding string.



var donutwidth = (ele/6.5);
console.log(donutwidth);
var donutheight = donutwidth;
var donut_color_range =
['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'];

var donut_data_bins = [3,6,9,12,15,18,21,24,60];
donut.donutcolorScale = d3.scaleLinear().domain(donut_data_bins).range(donut_color_range);



    // nothing here yet



donut.arc = d3.arc()
    .innerRadius((donutwidth/2)*.5)
    .outerRadius(donutwidth/2*.9)
    .startAngle(0);

// Get the SVG container, and apply a transform such that the origin is the
// center of the canvas. This way, we don’t need to position arcs individually.
var svg = d3.select("#donut-1").append("svg")
    .attr('id','donut')
    .attr('width',donutwidth)
    .attr('height',donutheight)

    g = svg.append("g").attr("transform", "translate(" + donutwidth / 2 + "," + donutheight / 2 + ")");

// Add the background arc, from 0 to 100% (tau).

donut.foreground = g.append("path")
    .datum({endAngle: 0 * donut.tau})
    .style("fill", "orange")
    .style('border-radius',4)
    .attr("d", donut.arc);

var background = g.append("path")
    .datum({endAngle: donut.tau})
    .style('stroke', '#ccc')
    .style('fill', 'transparent')
    .attr("d", donut.arc);

// Add the foreground arc in orange, currently showing 12.7%.


//var text = g.append("text")
  //  .attr("x", 0)
    //.attr("y", 0)
    //.style('fill','#fff')
    //.text("");


var img=g.append('image')
    .attr("xlink:href", iconurl)
      .style('fill','#fff')
    .attr("x", -8)
    .attr("y", -8)
    .attr("width", 16)
    .attr("height", 16);

};

// Every so often, start a transition to a new random angle. The attrTween
// definition is encapsulated in a separate function (a closure) below.
Donut.prototype.updateHazard=function(options) {
  var donut=this;
  console.log(options);
  donut.foreground.transition()
      .duration(300)
      .style('fill',function(d) {
      return donut.donutcolorScale(options[donut.variable]);})
      .attrTween("d", donut.arcTween(options[donut.variable]/60 * donut.tau));

}



// Returns a tween for a transition’s "d" attribute, transitioning any selected
// arcs from their current angle to the specified new angle.
Donut.prototype.arcTween=function(newAngle) {
   var donut=this;
  // The function passed to attrTween is invoked for each selected element when
  // the transition starts, and for each element returns the interpolator to use
  // over the course of transition. This function is thus responsible for
  // determining the starting angle of the transition (which is pulled from the
  // element’s bound datum, d.endAngle), and the ending angle (simply the
  // newAngle argument to the enclosing function).
  return function(d) {

    // To interpolate between the two angles, we use the default d3.interpolate.
    // (Internally, this maps to d3.interpolateNumber, since both of the
    // arguments to d3.interpolate are numbers.) The returned function takes a
    // single argument t and returns a number between the starting angle and the
    // ending angle. When t = 0, it returns d.endAngle; when t = 1, it returns
    // newAngle; and for 0 < t < 1 it returns an angle in-between.
    var interpolate = d3.interpolate(d.endAngle, newAngle);

    // The return value of the attrTween is also a function: the function that
    // we want to run for each tick of the transition. Because we used
    // attrTween("d"), the return value of this last function will be set to the
    // "d" attribute at every tick. (It’s also possible to use transition.tween
    // to run arbitrary code for every tick, say if you want to set multiple
    // attributes from a single function.) The argument t ranges from 0, at the
    // start of the transition, to 1, at the end.
    return function(t) {

      // Calculate the current arc angle based on the transition time, t. Since
      // the t for the transition and the t for the interpolate both range from
      // 0 to 1, we can pass t directly to the interpolator.
      //
      // Note that the interpolated angle is written into the element’s bound
      // data object! This is important: it means that if the transition were
      // interrupted, the data bound to the element would still be consistent
      // with its appearance. Whenever we start a new arc transition, the
      // correct starting angle can be inferred from the data.
      d.endAngle = interpolate(t);

      // Lastly, compute the arc path given the updated data! In effect, this
      // transition uses data-space interpolation: the data is interpolated
      // (that is, the end angle) rather than the path string itself.
      // Interpolating the angles in polar coordinates, rather than the raw path
      // string, produces valid intermediate arcs during the transition.
      return donut.arc(d);
    };
  };
}

var donuts = [
  new Donut('#donut-1', 'Hurricane','icons/hurricane.svg'),
  new Donut('#donut-2', 'Flood','icons/flood.svg'),
  new Donut('#donut-3', 'Earthquake','icons/earthquake.svg'),
  new Donut('#donut-4', 'Wildfire','icons/wildfire.svg'),
  new Donut('#donut-5', 'Tornado','icons/tornado.svg'),
  new Donut('#donut-6', 'Hail','icons/hail.svg'),
];

function updateDonuts(options) {
  donuts.forEach(function(donut) {
    donut.updateHazard(options);
  })
}