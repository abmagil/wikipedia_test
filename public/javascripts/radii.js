
var socket = io();
var bbox, radii, svg, target;
     
$("body").on("click", function() {
    socket.emit("need data");
})
socket.on("new data", function(r) {
    console.log(r);
    radii.push(r);
});

svg = d3.select("body").append('svg')
        .attr("height", 600)
        .attr("width", 600);
bbox = svg[0][0].getBoundingClientRect();
 
 // Center the circles in the bounding box
target = svg.append('g')
    .attr('transform', "translate(" + (bbox.width / 2) + "," + (bbox.height / 2) + ")");


target.selectAll('circle');
//     .data(radii)
//   .enter().append('circle')
//     .attr('r', function(d) {return d;});