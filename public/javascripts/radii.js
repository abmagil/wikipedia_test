
var socket = io();
var bbox, radii, svg, target;
              
// Create svg container     
svg = d3.select("body").append('svg')
        .attr("height", 600)
        .attr("width", 600);
bbox = svg[0][0].getBoundingClientRect();
// Path generator
var circle = d3.svg.arc()
              .innerRadius(function(d) {console.log(d);return d})
              .outerRadius(bbox.width / 2)
              .startAngle(0)
              .endAngle(Math.PI);
 // Center the circles in the bounding box
var target = svg.append('g')
    .attr('transform', "translate(" + (bbox.width / 2) + "," + (bbox.height / 2) + ")");


$("body").on("click", function() {
    socket.emit("need data");
})
socket.on("new data", function(r) {
    radii = r;
    console.log(r);
    target.append("path")
      .attr("d", circle(radii))
      .attr("stroke", "blue")
      .attr("stroke-width", 2)
      .attr("fill", "none");
});

 

