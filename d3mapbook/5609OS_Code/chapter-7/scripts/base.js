if (d3.ext === null || typeof(d3.ext) !== 'object') { d3.ext = {}; }

this.d3.ext.base = function() {
  'use strict';

  var my = {};
  var config = {};

  my.accessor = function(accessor, value) {
    if (!arguments.length) { return config; }

    if (value !== undefined) { config[accessor] = value; }

    my[accessor] = function(value) {
      if (!arguments.length) { return config[accessor]; }
      config[accessor] = value;
      return my;
    };

    return my;
  };

  my.setupSVG = function(el) {
    var svg = d3.select(el);
    svg.selectAll('svg').data([1]).enter()
        .append("svg")
        .attr("width", my.width() )
        .attr("height", my.height() );
    return svg.select('svg');
  };

  my.setupChart = function(svg) {
    svg.selectAll('.chart-box').data([1]).enter()
        .append("g")
        .attr('class', 'chart-box')
        .attr("transform", "translate(" + my.margin().left + "," + my.margin().top + ")");
    return svg.select('.chart-box');
  };

  my.chartWidth = function(width, margin) {
    return width - margin.left - margin.right;
  };

  my.chartHeight = function(height, margin) {
    return height - margin.top - margin.bottom;
  };

  // These common accessors are in every visualization
  my.accessor('width', 900)
    .accessor('height', 600)
    .accessor('margin', {top: 10, right: 10, bottom: 10, left: 10});

  // Shortcuts for common used methods
  my.w = function() {
    return my.chartWidth(my.width(), my.margin());
  };

  my.h = function() {
    return my.chartHeight(my.height(), my.margin());
  };

  return my;
};
