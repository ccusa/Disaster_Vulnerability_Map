if (d3.charts === null || typeof(d3.charts) !== 'object') { d3.charts = {}; }
d3.charts.viz = function () {
  // Functional inheritance of common areas
  var my = d3.ext.base();

  // Define getter/setter style accessors..
  // defaults assigned
  my.accessor('example', true);

  // Data for Global Scope
  var svg = void 0,
      chart = void 0;

  // Declare D3 functions, also global
  var x = d3.scale.linear(),
      y = d3.scale.ordinal();

  // main interface to the vizualization code
  my.draw = function(selection) {
    selection.each(function(data) {
      // code in base/scripts.js
      // resuable way of dealing with margins
      svg = my.setupSVG(this);
      chart = my.setupChart(svg);

      // Create the visualization
      my.chart(data);
    });
  };

  // main method for drawing the viz
  my.chart = function(data) {
    var chartData = my.profit(data);

    x.domain([0, my.profitMax(chartData)])
        .range([0,my.w()]);
    y.domain(my.categories(chartData))
        .rangeRoundBands([0, my.h()], 0.2);

    var boxes = chart.selectAll('.box').data(chartData);

    // Enter
    boxes.enter().append('rect')
        .attr('class', 'box')
        .attr('fill', 'steelblue');

    // Update
    boxes.transition().duration(1000)
        .attr('x', 0)
        .attr('y', function(d) { return y(d.category) })
        .attr('width', function(d) {  return x(d.profit) })
        .attr('height', y.rangeBand())

    // Exit
    boxes.exit().remove();
  };

  // Example function to create profit.
  my.profit = function(data) {
    return data.map(function(d) {
      d.profit = parseFloat(d.sales) - parseFloat(d.cost);
      return d;
    });
  };

  my.categories = function(data) {
    return data.map(function(d) {
      return d.category;
    });
  };

  my.profitMax = function(data) {
    return d3.max(data, function(d) { return d.profit; });
  };

  return my;
};
