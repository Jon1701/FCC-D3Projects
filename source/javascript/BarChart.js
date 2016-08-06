var getUniqueYears = function(arr) {

  // Array holding all the extracted years.
  var yearsArray = [];

  // Get all the years
  for (var i=0; i<arr.length; i++) {

    // Get the date.
    var date = arr[i][0];

    // Split into year, month, day.
    var yearMonthDay = date.split('-');

    // Get just the year.
    var year = date.split('-')[0];

    // Check to see if the year is already stored into yearsArray.
    //
    // If it is not stored, store it.
    // If it is stored, skip to next element.
    if (yearsArray.indexOf(year) == -1) {
      yearsArray.push(year);
    }

  }

  // Return a unique list of years within the data.
  return yearsArray;
}

// Use d3 library.
var d3 = require('d3');

// Define canvas dimensions.
var canvasWidth = 1500;
var canvasHeight = 700;

// Set canvas padding.
var padding = 60;
var leftShift = 1.5;
var graphWidth = canvasWidth - 2*padding;
var graphHeight = canvasHeight - 2*padding;

// Access the SVG Canvas and set attributes.
var svg = d3.select('#canvas')
            .attr('width', canvasWidth)
            .attr('height', canvasHeight);

// Translation function.
var translation = function(x,y) {
  return 'translate(' + x + ',' + y + ')';
}

// Error callback function for d3.json.
var jsonError = function(error) {
  console.log(error);
}

// Success callback function for d3.json.
var jsonSuccess = function(data) {



  // Access datapoints only.
  var dataset = data['data'];

  // Create bars.
  var bars = svg.selectAll('rect')
                .data(dataset)
                .enter()
                .append('rect');

  // Individual bar width.
  var barWidth = canvasWidth / dataset.length;

  // Scales the
  var startDate = dataset[0][0]; // Start date.
  var endDate = dataset[dataset.length-1][0]; // End date.
  var xScale = d3.scaleTime()
                  .domain([new Date(startDate), new Date(endDate)])
                  .range([0, graphWidth]);

  // Scales the dependent variable's values to the canvas height.
  var yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, function(d) {return d[1]})])
                  .range([graphHeight, 0]);

  // Horizontal axis.
  var xAxis = d3.axisBottom(xScale)
  svg.append('g')
      .attr('transform', translation(padding*leftShift, graphHeight + padding))
      .call(xAxis);

  // Vertical axis.
  var yAxis = d3.axisLeft(yScale);
  svg.append('g')
      .attr('transform', translation(padding*leftShift, padding))
      .call(yAxis);

  var xAxisLabel = svg.append('text')
                      .attr('id', 'x-axis-label')
                      .attr('x', 100)
                      .attr('y', 100)
                      .text('X Label')

  var yAxisLabel = svg.append('text')
                      .attr('id', 'y-axis-label')
                      .attr('x', 200)
                      .attr('y', 200)
                      .text('Y Label')


  // Set individual bar dimensions.
  bars.attr('x', function(d, i) {return xScale(new Date(d[0])) + padding*leftShift})
      .attr('y', function(d, i) {return yScale(d[1]) + padding})
      .attr('width', function(d, i) {return barWidth - 0.5})
      .attr('height', function(d, i) {return graphHeight - yScale(d[1])})
}

// Get GDP data.
d3.json('./datasets/GDP-data.json', function(error, result) {

  // Error checking.
  if (error) {

    // If an error was caught, delegate to jsonError callback function.
    jsonError(error);

  } else {

    // If no error was caught, delegate to jsonSuccess callback function.
    jsonSuccess(result);

  }

});
