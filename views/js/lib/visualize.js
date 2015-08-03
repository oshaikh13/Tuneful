
$(document).ready(function(){
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  var audioElement = $('audio')[0];
  var audioSrc = audioCtx.createMediaElementSource(audioElement);
  var analyser = audioCtx.createAnalyser();
  var numBars = 128;
  analyser.fftSize = numBars * 2;

  // Bind our analyser to the media element source.
  audioSrc.connect(analyser);
  audioSrc.connect(audioCtx.destination);

  //var frequencyData = new Float32Array(analyser.frequencyBinCount);
  var frequencyData = new Float32Array(analyser.frequencyBinCount);

  var svgHeight = '300';
  var svgWidth = '1200';
  var barPadding = '1';

  function createSvg(parent, height, width) {
    return d3.select(parent).append('svg').attr('height', height).attr('width', width);
  }

  var svg = createSvg('body', svgHeight, '100%');

  // Create our initial D3 chart.
  svg.selectAll('rect')
     .data(frequencyData)
     .enter()
     .append('rect')
     .attr('x', function (d, i) {
        return i * (svgWidth / frequencyData.length);
     })
     .attr('width', svgWidth / frequencyData.length - barPadding);


  var color = d3.scale.linear()
    .domain([0, 1])
    .range(["white", "green"]);

  // Continuously loop and update chart with frequency data.
  function renderChart() {

     requestAnimationFrame(renderChart);

     // Copy frequency data to frequencyData array.
     analyser.getFloatFrequencyData(frequencyData);


     // Update d3 chart with new data.
     svg.selectAll('rect')
        .data(frequencyData)
        .attr('y', function(d) {
           return svgHeight - Math.abs(d) * 2;
        })
        .attr('height', function(d) {
           return Math.abs(d) * 2;
        })
        .attr('fill', function(d) {
           //console.log(Math.abs(d) * 1.3);
           return color(Math.abs(d)/120);
        });
  }

  // Run the loop
  renderChart();
});