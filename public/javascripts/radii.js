
var socket = io();
var bbox, radii, svg, target;
var articles = {}, requests = 0;
              
// Create svg container     
svg = d3.select("#main").append('svg')
        .attr("height", 600)
        .attr("width", 600);
bbox = svg[0][0].getBoundingClientRect();
// Path generator
var circle = d3.svg.arc()
              .innerRadius(function(d) {return d})
              .outerRadius(bbox.width / 2 - 50)
              .startAngle(0)
              .endAngle( 2 * Math.PI);
 // Center the circles in the bounding box
var target = svg.append('g')
    .attr('transform', "translate(" + (bbox.width / 2) + "," + (bbox.height / 2) + ")");


$("form").on("submit", function() {
    socket.emit("get article", $("#article_name").val());
    return false;
});
$('.btn-success').on("click", function() {
  requests++;
  socket.emit("need data", $("#article_name").val());
});

socket.on("new data", function(r) {
    data = JSON.parse(r)
    if (data["query"]) {
      console.log(data);
      // add to articles object
      if (articles[requests]) {
        articles[requests].push(data.query.backlinks);
      } else {
        articles[requests] = data.query.backlinks;
      }
      // Draw a circle on the screen corresponding to the number of pages
      radii = data["query"]["backlinks"].length;
      target.append("path")
        .attr("d", circle(articles[requests].length))
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("fill", "none");
    }
})
.on("found article", function(article) {
  $('#article_text').html(article);
  $(".btn-primary").hide();
  $(".btn-success").show().removeClass("hidden");
});

 

