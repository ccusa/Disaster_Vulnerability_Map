'use strict';

describe('Visualization: Stacked', function () {
  var viz;

  var data = [
    {"category": "gold",  "cost": "10",  "sales": "60"},
    {"category": "white", "cost": "20",  "sales": "30"},
    {"category": "black", "cost": "100", "sales": "140"}
  ];

  beforeEach(function() {
    viz = d3.charts.viz()
        .height(600)
        .width(900)
        .margin({top: 10, right: 10, bottom: 10, left: 10});
  });

  it ('sets the profit', function() {
    var profits = viz.profit(data);
    expect(profits.length).toBe(3);
    expect(profits[0].profit).toBe(50)
  });

  it ('returns a list of all categories', function() {
    var categories = viz.categories(data);
    expect(categories.length).toBe(3);
    expect(categories).toEqual([ 'gold', 'white', 'black' ]);
  });

  it ('calculates the profit max', function() {
    var profits = viz.profit(data);
    expect(viz.profitMax(profits)).toEqual(50);
  });

  it ('calculates the height of the chart box', function() {
    expect(viz.h()).toBe(580);
    viz.height(700); // change the height
    viz.margin({top: 20, right: 10, bottom: 10, left: 10})
    expect(viz.h()).toBe(670);
  });

  it ('calculates the width of the chart box', function() {
    expect(viz.w()).toBe(880);
    viz.height(700); // change the height
    viz.margin({top: 10, right: 10, bottom: 10, left: 20})
    expect(viz.w()).toBe(870);
  });


});