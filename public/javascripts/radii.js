
var socket = io();
var bbox, radii = [], svg, target;
     
$("body").on("click", function() {
    socket.emit("need data");
})
socket.on("new data", function(r) {
    radii.push(r);
});

svg = d3.select("body").append('svg')
        .attr("height", 600)
        .attr("width", 600);
bbox = svg[0][0].getBoundingClientRect();
 
 // Center the circles in the bounding box
var target = svg.append('g')
    .attr('transform', "translate(" + (bbox.width / 2) + "," + (bbox.height / 2) + ")");

var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(bbox.width / 2);
